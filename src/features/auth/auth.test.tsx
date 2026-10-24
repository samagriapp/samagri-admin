import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Topbar } from '../../components/layout/Topbar';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { LoginPage } from './LoginPage';
import { productSchema } from '../products/schema';

const authValue = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  setUser: vi.fn(),
};

function CurrentPath() {
  return <span>{useLocation().pathname}</span>;
}

vi.mock('../../services/authApi', () => ({
  authApi: {
    login: vi.fn(),
    requestPasswordReset: vi.fn().mockResolvedValue({ message: 'ok' }),
    resetPassword: vi.fn(),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('Authentication and validation', () => {
  it('shows validation errors when login fields are empty', async () => {
    const user = userEvent.setup();
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows reset confirmation after forgot password submission', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/email address/i), 'admin@example.com');
    await user.click(screen.getByRole('button', { name: /send recovery link/i }));

    expect(await screen.findByText(/if that email is registered/i)).toBeInTheDocument();
  });

  it('logs out from the profile menu and navigates to login', async () => {
    const user = userEvent.setup();
    const logout = vi.fn().mockResolvedValue(undefined);
    render(
      <AuthContext.Provider value={{ ...authValue, user: { email: 'admin@example.com' }, isAuthenticated: true, logout }}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <CurrentPath />
          <Routes>
            <Route path="/dashboard" element={<Topbar title="Dashboard" />} />
            <Route path="/login" element={<p>Login page</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    await user.click(screen.getByRole('button', { name: /open profile menu/i }));
    await user.click(screen.getByRole('menuitem', { name: /logout/i }));

    expect(logout).toHaveBeenCalledOnce();
    expect(screen.getByText('/login')).toBeInTheDocument();
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('rejects invalid product payloads with zod schema', () => {
    const result = productSchema.safeParse({
      name: '',
      description: 'short',
      price: 0,
      category: '',
      brand: '',
      sku: '',
      stock: -1,
      images: ['not-a-url'],
      status: 'active',
      isFeatured: false,
    });

    expect(result.success).toBe(false);
  });
});
