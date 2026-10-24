import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { Product, ProductFormValues } from '../../types';
import { productSchema } from './schema';

const defaultValues: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  category: '',
  brand: '',
  sku: '',
  stock: '',
  status: 'active',
  images: [],
  isFeatured: false,
};

export function ProductForm({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting,
}: {
  initialValues?: Partial<Product> | null;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
}) {
  const [imageInput, setImageInput] = useState('');

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      price: initialValues?.price ?? '',
      stock: initialValues?.stock ?? '',
      images: initialValues?.images ?? [],
      status: initialValues?.status ?? 'active',
      isFeatured: Boolean(initialValues?.isFeatured),
    },
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
      ...initialValues,
      price: initialValues?.price ?? '',
      stock: initialValues?.stock ?? '',
      images: initialValues?.images ?? [],
      status: initialValues?.status ?? 'active',
      isFeatured: Boolean(initialValues?.isFeatured),
    });
  }, [initialValues, form]);

  const images = form.watch('images') || [];

  const handleSubmit = async (values: ProductFormValues) => {
    const pendingImage = imageInput.trim();
    const submittedImages = [...values.images.filter(Boolean), ...(pendingImage ? [pendingImage] : [])];
    if (submittedImages.length === 0) {
      form.setError('images', { type: 'manual', message: 'At least one image is required' });
      return;
    }

    const imageValidation = productSchema.shape.images.safeParse(submittedImages);
    if (!imageValidation.success) {
      form.setError('images', {
        type: 'manual',
        message: imageValidation.error.issues[0]?.message ?? 'Please provide valid image URLs',
      });
      return;
    }

    await onSubmit({
      ...values,
      images: imageValidation.data,
      price: Number(values.price),
      stock: Number(values.stock),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Product Name</label>
          <Input id="name" placeholder="Earphones" error={form.formState.errors.name?.message} {...form.register('name')} />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-slate-700">Description</label>
          <textarea id="description" rows={4} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10" {...form.register('description')} />
          {form.formState.errors.description ? <p className="mt-1 text-xs text-red-500">{form.formState.errors.description.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="price" className="text-sm font-medium text-slate-700">Price</label>
          <Input id="price" type="number" min="0" step="0.01" placeholder="2499" error={form.formState.errors.price?.message} {...form.register('price')} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="category" className="text-sm font-medium text-slate-700">Category</label>
          <Input id="category" placeholder="Electronics" error={form.formState.errors.category?.message} {...form.register('category')} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="brand" className="text-sm font-medium text-slate-700">Brand</label>
          <Input id="brand" placeholder="SoundPro" error={form.formState.errors.brand?.message} {...form.register('brand')} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sku" className="text-sm font-medium text-slate-700">SKU</label>
          <Input id="sku" placeholder="SP-HEAD-004" error={form.formState.errors.sku?.message} {...form.register('sku')} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="stock" className="text-sm font-medium text-slate-700">Stock</label>
          <Input id="stock" type="number" min="0" step="1" placeholder="50" error={form.formState.errors.stock?.message} {...form.register('stock')} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="status" className="text-sm font-medium text-slate-700">Status</label>
          <select id="status" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10" {...form.register('status')}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
          <input id="isFeatured" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" {...form.register('isFeatured')} />
          <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">Mark as featured product</label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-800">Product images</h3>
          <span className="text-xs text-slate-500">{images.length}/20 added</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={imageInput}
            onChange={(event) => setImageInput(event.target.value)}
            placeholder="https://example.com/image.jpg"
            className="sm:flex-1"
            disabled={images.length >= 20}
            aria-label="Image URL"
          />
        </div>
        {form.formState.errors.images?.message ? (
          <p role="alert" className="mt-2 text-xs text-red-500">{form.formState.errors.images.message}</p>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {images.length === 0 ? (
            <div className="col-span-full flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" />
                No images added yet
              </div>
            </div>
          ) : (
            images.map((image) => (
              <div key={image} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                <img src={image} alt="Product preview" className="h-24 w-full rounded-lg object-cover" onError={(event) => {
                  event.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
                }} />
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-red-500 shadow-sm hover:bg-red-50"
                  onClick={() => {
                    form.clearErrors('images');
                    form.setValue('images', images.filter((item) => item !== image), {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} className="sm:min-w-[180px]">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
