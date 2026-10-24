import { apiClient, getErrorMessage } from '../lib/axios';
import type { Product, ProductFormValues } from '../types';

const getResponseData = <T>(payload: unknown): T => {
  const value = (payload as { data?: T })?.data ?? payload;
  return value as T;
};

const getProducts = (payload: unknown): Product[] => {
  const data = getResponseData<unknown>(payload);

  if (Array.isArray(data)) return data as Product[];

  if (data && typeof data === 'object') {
    const result = data as { items?: unknown; products?: unknown };
    if (Array.isArray(result.items)) return result.items as Product[];
    if (Array.isArray(result.products)) return result.products as Product[];
  }

  throw new Error('The products endpoint returned an unexpected response.');
};

const unwrapProduct = (payload: unknown): Product => {
  let data = payload;

  for (let depth = 0; depth < 4; depth += 1) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('The product endpoint returned an unexpected response.');
    }

    const record = data as Record<string, unknown>;
    if (record.product && typeof record.product === 'object') {
      data = record.product;
      continue;
    }
    if ('data' in record) {
      data = record.data;
      continue;
    }

    return data as Product;
  }

  throw new Error('The product endpoint returned an unexpected response.');
};

const toProductPayload = (payload: ProductFormValues) => ({
  name: payload.name,
  description: payload.description,
  price: Number(payload.price),
  category: payload.category,
  brand: payload.brand,
  sku: payload.sku,
  stock: Number(payload.stock),
  images: (payload.images ?? []).filter(Boolean),
  status: payload.status,
  isFeatured: payload.isFeatured,
});

export const productApi = {
  async listProducts() {
    try {
      const response = await apiClient.get('/products/', {
        params: { index: 0, limit: 10 },
      });
      return getProducts(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getProduct(id: string) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return unwrapProduct(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async createProduct(payload: ProductFormValues) {
    try {
      const response = await apiClient.post('/admin/products', toProductPayload(payload));
      return getResponseData<Product>(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateProduct(id: string, payload: ProductFormValues) {
    try {
      const response = await apiClient.patch(`/admin/products/${id}`, toProductPayload(payload));
      return getResponseData<Product>(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteProduct(id: string) {
    try {
      const response = await apiClient.delete(`/admin/products/${id}`);
      return getResponseData<{ success?: boolean; message?: string }>(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
