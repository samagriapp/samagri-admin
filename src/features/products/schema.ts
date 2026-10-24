import { z } from 'zod';

export const productStatusEnum = z.enum(['active', 'draft', 'archived', 'inactive']);

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  description: z.string().trim().optional(),
  price: z.union([z.number(), z.string()]).refine((value) => String(value).trim().length > 0, {
    message: 'Price is required',
  }).refine((value) => Number(value) > 0, {
    message: 'Price must be greater than zero',
  }),
  category: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  sku: z.string().trim().min(1, 'SKU is required'),
  stock: z.union([z.number(), z.string().trim().min(1, 'Stock is required')]).refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, {
    message: 'Stock must be a non-negative integer',
  }),
  images: z
    .array(z.string().trim().url('Please provide valid image URLs'))
    .max(20, 'You can add up to 20 images')
    .default([]),
  status: productStatusEnum,
  isFeatured: z.boolean().default(false),
});
