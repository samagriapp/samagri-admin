import { productApi } from './productApi';
import { apiClient } from '../lib/axios';
import type { ProductFormValues } from '../types';

vi.mock('../lib/axios', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  getErrorMessage: vi.fn(() => 'Request failed'),
}));

const productValues: ProductFormValues = {
  name: 'Earphones',
  description: 'Active noise cancellation',
  price: '2499',
  category: 'Electronics',
  brand: 'SoundPro',
  sku: 'SP-HEAD-004',
  stock: '50',
  images: ['https://example.com/headphones.jpg'],
  status: 'active',
  isFeatured: true,
};

const productDetails = {
  id: 'product-id',
  ...productValues,
  price: 2499,
  stock: 50,
};

describe('productApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads the first product page from the public products endpoint', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { products: [] } } as never);

    await expect(productApi.listProducts()).resolves.toEqual([]);
    expect(apiClient.get).toHaveBeenCalledWith('/products/', {
      params: { index: 0, limit: 10 },
    });
  });

  it('loads a product by ID and unwraps the product response for edit-form values', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { product: productDetails } } } as never);

    await expect(productApi.getProduct('product-id')).resolves.toEqual(productDetails);
    expect(apiClient.get).toHaveBeenCalledWith('/products/product-id');
  });

  it('creates products through the admin endpoint with numeric fields', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'product-id' } } as never);

    await productApi.createProduct(productValues);

    expect(apiClient.post).toHaveBeenCalledWith('/admin/products', {
      ...productValues,
      price: 2499,
      stock: 50,
    });
  });

  it('sends every current form value in the PATCH body and deletes through the admin endpoint', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: {} } as never);
    vi.mocked(apiClient.delete).mockResolvedValue({ data: {} } as never);

    const editedValues = {
      ...productValues,
      name: 'Studio Earphones',
      description: 'Updated noise cancellation description',
      price: '2799',
      category: 'Audio',
      brand: 'SoundPro Plus',
      sku: 'SP-HEAD-005',
      stock: '42',
      status: 'draft' as const,
      isFeatured: false,
    };

    await productApi.updateProduct('product-id', editedValues);
    await productApi.deleteProduct('product-id');

    expect(apiClient.patch).toHaveBeenCalledWith('/admin/products/product-id', {
      name: 'Studio Earphones',
      description: 'Updated noise cancellation description',
      price: 2799,
      category: 'Audio',
      brand: 'SoundPro Plus',
      sku: 'SP-HEAD-005',
      stock: 42,
      images: ['https://example.com/headphones.jpg'],
      status: 'draft',
      isFeatured: false,
    });
    expect(apiClient.delete).toHaveBeenCalledWith('/admin/products/product-id');
  });
});
