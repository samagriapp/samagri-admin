import { Pencil, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { productApi } from '../../services/productApi';
import type { Product } from '../../types';

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'createdAt'>('name');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.listProducts();
      setProducts(data);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category).filter(Boolean))), [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...products]
      .filter((product) => {
        const matchesQuery =
          !normalizedQuery ||
          [product.name, product.sku, product.brand, product.category].some((value) => value.toLowerCase().includes(normalizedQuery));
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

        return matchesQuery && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price') return b.price - a.price;
        if (sortBy === 'stock') return b.stock - a.stock;
        return new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime();
      });
  }, [products, query, statusFilter, categoryFilter, sortBy]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeletingId(productToDelete.id);

    try {
      await productApi.deleteProduct(productToDelete.id);
      setProducts((current) => current.filter((product) => product.id !== productToDelete.id));
      toast.success(`${productToDelete.name} was deleted successfully`);
    } catch (deleteError) {
      toast.error(deleteError instanceof Error ? deleteError.message : 'Unable to delete product');
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading products..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">Catalog</p>
          <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
        </div>
        <Link to="/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="text" placeholder="Search products..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10" />
          </div>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10">
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="inactive">Inactive</option>
          </select>

          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10">
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'name' | 'price' | 'stock' | 'createdAt')} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10">
            <option value="name">Sort by name</option>
            <option value="price">Sort by price</option>
            <option value="stock">Sort by stock</option>
            <option value="createdAt">Sort by date</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <Button type="button" variant="secondary" className="mt-3" onClick={() => void fetchProducts()}>
            Retry
          </Button>
        </div>
      ) : null}

      {filteredProducts.length === 0 ? (
        <EmptyState title="No products found" description="Try adjusting filters or add a new product to the catalog." action={<Link to="/products/new"><Button variant="secondary">Add Product</Button></Link>} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Brand</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                    <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                    <td className="px-4 py-3 text-slate-600">{product.category}</td>
                    <td className="px-4 py-3 text-slate-600">{product.brand}</td>
                    <td className="px-4 py-3 text-slate-600">₹{product.price}</td>
                    <td className="px-4 py-3 text-slate-600">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{product.isFeatured ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100" onClick={() => navigate(`/products/${product.id}/edit`)} aria-label={`Edit ${product.name}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100" onClick={() => setProductToDelete(product)} aria-label={`Delete ${product.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(productToDelete)}
        title="Delete product"
        message={`Are you sure you want to delete “${productToDelete?.name}”? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
        loading={Boolean(deletingId)}
      />
    </div>
  );
}
