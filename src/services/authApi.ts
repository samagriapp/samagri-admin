import { apiClient, getErrorMessage } from '../lib/axios';
import type { AuthUser, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload } from '../types';

const getResponseData = <T>(payload: unknown): T => {
  const value = (payload as { data?: T })?.data ?? payload;
  return value as T;
};

export const authApi = {
  async login(credentials: LoginPayload) {
    const response = await apiClient.post('/auth/login', credentials);
    const data = getResponseData<{ token?: string; user?: AuthUser; accessToken?: string; userData?: AuthUser }>(response.data);
    const user = data?.user ?? data?.userData ?? {
      email: credentials.email,
      name: credentials.email.split('@')[0],
      role: 'admin',
    };
    const token = data?.token ?? data?.accessToken ?? '';

    return { user, token, data };
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return getResponseData<AuthUser>(response.data);
  },

  async requestPasswordReset(payload: ForgotPasswordPayload) {
    const response = await apiClient.post('/auth/forgot-password', payload);
    return getResponseData<{ message?: string }>(response.data);
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const response = await apiClient.post('/auth/reset-password', payload);
    return getResponseData<{ message?: string }>(response.data);
  },
};
