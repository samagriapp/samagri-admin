export type ProductStatus = 'active' | 'draft' | 'archived' | 'inactive';

export interface AuthUser {
  id?: string;
  name?: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: number | string;
  category: string;
  brand: string;
  sku: string;
  stock: number | string;
  status: ProductStatus;
  images: string[];
  isFeatured: boolean;
}

export interface ApiErrorShape {
  message?: string;
  error?: string;
}
