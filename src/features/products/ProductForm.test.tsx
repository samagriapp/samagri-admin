import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from './ProductForm';
import { productSchema } from './schema';

describe('ProductForm', () => {
  it('submits edited field values together with the complete product payload', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ProductForm
        initialValues={{
          name: 'Earphones',
          description: 'Active noise cancellation',
          price: 2499,
          category: 'Electronics',
          brand: 'SoundPro',
          sku: 'SP-HEAD-004',
          stock: 50,
          images: ['https://example.com/headphones.jpg'],
          status: 'active',
          isFeatured: true,
        }}
        onSubmit={onSubmit}
        submitLabel="Save changes"
      />,
    );

    await user.clear(screen.getByLabelText('Product Name'));
    await user.type(screen.getByLabelText('Product Name'), 'Studio Earphones');
    await user.clear(screen.getByLabelText('Price'));
    await user.type(screen.getByLabelText('Price'), '2799');
    await user.clear(screen.getByLabelText('Stock'));
    await user.type(screen.getByLabelText('Stock'), '42');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Studio Earphones',
      description: 'Active noise cancellation',
      price: 2799,
      category: 'Electronics',
      brand: 'SoundPro',
      sku: 'SP-HEAD-004',
      stock: 42,
      images: ['https://example.com/headphones.jpg'],
      status: 'active',
      isFeatured: true,
    });
  });

  it('submits the image URL directly from the input without an extra add action', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ProductForm onSubmit={onSubmit} submitLabel="Create product" />);

    await user.type(screen.getByLabelText('Product Name'), 'Earphones');
    await user.type(screen.getByLabelText('Price'), '2499');
    await user.type(screen.getByLabelText('SKU'), 'SP-HEAD-004');
    await user.type(screen.getByLabelText('Stock'), '50');
    await user.type(screen.getByLabelText('Image URL'), 'https://example.com/headphones.jpg');
    await user.click(screen.getByRole('button', { name: 'Create product' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      images: ['https://example.com/headphones.jpg'],
      description: '',
      category: '',
      brand: '',
    }));
  });

  it('requires product name, price, SKU, stock, and at least one image', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ProductForm onSubmit={onSubmit} submitLabel="Create product" />);
    await user.click(screen.getByRole('button', { name: 'Create product' }));

    expect(await screen.findByText('Product name is required')).toBeInTheDocument();
    expect(screen.getByText('Price is required')).toBeInTheDocument();
    expect(screen.getByText('SKU is required')).toBeInTheDocument();
    expect(screen.getByText('Stock is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows an image error when required fields are valid but no image is provided', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ProductForm onSubmit={onSubmit} submitLabel="Create product" />);
    await user.type(screen.getByLabelText('Product Name'), 'Earphones');
    await user.type(screen.getByLabelText('Price'), '2499');
    await user.type(screen.getByLabelText('SKU'), 'SP-HEAD-004');
    await user.type(screen.getByLabelText('Stock'), '50');
    await user.click(screen.getByRole('button', { name: 'Create product' }));

    expect(await screen.findByText('At least one image is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('enforces the 20-image maximum', () => {
    const result = productSchema.safeParse({
      name: 'Earphones',
      description: 'Active noise cancellation',
      price: 2499,
      category: 'Electronics',
      brand: 'SoundPro',
      sku: 'SP-HEAD-004',
      stock: 50,
      images: Array.from({ length: 21 }, (_, index) => `https://example.com/image-${index}.jpg`),
      status: 'active',
      isFeatured: true,
    });

    expect(result.success).toBe(false);
  });
});
