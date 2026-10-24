import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../../components/common/Button';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { productApi } from '../../../services/productApi';
import type { Product, ProductFormValues } from '../../../types';
import { ProductForm } from '../ProductForm';

export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const getProduct = async () => {
      setLoading(true);
      setLoadError('');

      if (!id) {
        setLoadError('A product ID is required to edit a product.');
        setLoading(false);
        return;
      }

      try {
        const productRecord = await productApi.getProduct(id);
        if (active) setProduct(productRecord);
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : 'Unable to load product';
          setLoadError(message);
          toast.error(message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void getProduct();
    return () => {
      active = false;
    };
  }, [id, retryCount]);

  const handleSubmit = async (values: ProductFormValues) => {
    if (!id) return;
    setSubmitting(true);

    try {
      await productApi.updateProduct(id, values);
      toast.success('Product updated successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading product details..." />;
  if (loadError || !product) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">Unable to load this product for editing.</p>
        {loadError ? <p className="mt-2 text-sm">{loadError}</p> : null}
        <div className="mt-4 flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setRetryCount((count) => count + 1)}>
            Retry
          </Button>
          <Link to="/products">
            <Button type="button" variant="ghost">Back to products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Inventory</p>
        <h2 className="text-2xl font-semibold text-slate-900">Edit Product</h2>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <ProductForm initialValues={product} onSubmit={handleSubmit} submitLabel="Save changes" isSubmitting={submitting} />
      </div>
    </div>
  );
}
