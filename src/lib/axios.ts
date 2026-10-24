import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const storedSession = sessionStorage.getItem('samagri-admin-session');

  if (storedSession) {
    try {
      const parsed = JSON.parse(storedSession) as { token?: string };
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      sessionStorage.removeItem('samagri-admin-session');
    }
  }

  return config;
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message || error.response?.data?.error;

    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource could not be found.';
    if (status === 409) return 'This action conflicts with existing data.';
    if (status === 422) return 'The provided details are invalid. Please review and try again.';
    if (status === 429) return 'Too many requests. Please wait a moment and try again.';
    if (status === 500) return 'The server encountered an error. Please try again later.';

    if (typeof serverMessage === 'string' && serverMessage.trim()) return serverMessage;
    return 'Something went wrong while processing your request.';
  }

  if (error instanceof Error && error.message) return error.message;
  return 'Unexpected error occurred.';
};
