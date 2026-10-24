import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { LoginPage } from './features/auth/LoginPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AddProductPage } from './features/products/pages/AddProductPage';
import { EditProductPage } from './features/products/pages/EditProductPage';
import { ProductsPage } from './features/products/ProductsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><AppLayout title="Dashboard"><DashboardPage /></AppLayout></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><AppLayout title="Products"><ProductsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/products/new" element={<ProtectedRoute><AppLayout title="Add Product"><AddProductPage /></AppLayout></ProtectedRoute>} />
      <Route path="/products/:id/edit" element={<ProtectedRoute><AppLayout title="Edit Product"><EditProductPage /></AppLayout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
