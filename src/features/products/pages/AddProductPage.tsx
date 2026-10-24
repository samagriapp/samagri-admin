import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ProductForm } from '../ProductForm';
import { productApi } from '../../../services/productApi';
import type { ProductFormValues } from '../../../types';

export function AddProductPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);

    try {
      await productApi.createProduct(values);
      toast.success('Product created successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Inventory</p>
        <h2 className="text-2xl font-semibold text-slate-900">Add Product</h2>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create product" isSubmitting={submitting} />
      </div>
    </div>
  );
}
