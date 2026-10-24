import { ArrowRight, Package2, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { productApi } from '../../services/productApi';
import type { Product } from '../../types';

export function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productApi.listProducts();
        setProducts(data);
        setError('');
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard summary');
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const summary = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((product) => product.status === 'active').length;
    const outOfStockProducts = products.filter((product) => product.stock <= 0).length;
    const featuredProducts = products.filter((product) => product.isFeatured).length;

    return { totalProducts, activeProducts, outOfStockProducts, featuredProducts };
  }, [products]);

  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime()).slice(0, 5);

  if (loading) return <LoadingSpinner message="Loading dashboard summary..." />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">Unable to load dashboard data.</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">Overview</p>
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        </div>
        <Link to="/products/new">
          <Button icon={<ArrowRight className="h-4 w-4" />}>Add Product</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Products" value={summary.totalProducts} icon={<Package2 className="h-5 w-5" />} accent="brand" />
        <SummaryCard title="Active Products" value={summary.activeProducts} icon={<TrendingUp className="h-5 w-5" />} accent="emerald" />
        <SummaryCard title="Out of Stock" value={summary.outOfStockProducts} icon={<ShoppingBag className="h-5 w-5" />} accent="amber" />
        <SummaryCard title="Featured" value={summary.featuredProducts} icon={<Sparkles className="h-5 w-5" />} accent="violet" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">Recent products</h3>
          <Link to="/products" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</Link>
        </div>

        {recentProducts.length === 0 ? (
          <EmptyState title="No products yet" description="Create your first catalog item to start tracking sales and inventory." action={<Link to="/products/new"><Button variant="secondary">Add a product</Button></Link>} />
        ) : (
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3">
                <div className="flex items-center gap-3">
                  <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.category} · {product.stock} in stock</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">₹{product.price}</p>
                  <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-700">{product.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, accent }: { title: string; value: number; icon: React.ReactNode; accent: 'brand' | 'emerald' | 'amber' | 'violet' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[accent]}`}>{icon}</div>
      </div>
    </div>
  );
}
