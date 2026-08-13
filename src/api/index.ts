import axios, { type AxiosResponse } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// ── Request interceptor: attach JWT token ──────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: unwrap { success, data } envelope ───────────────
// The backend always responds with { success: true, data: { ...payload } }.
// We unwrap to `data` so callers get the inner payload directly.
// On 401, clear auth state and redirect.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwrap the envelope: { success: true, data: <payload> } → <payload>
    return response.data?.data ?? response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Avoid circular import by using dynamic import
      const { useAuthStore } = await import('@/stores/auth');
      try {
        const authStore = useAuthStore();
        authStore.user = null;
      } catch (_) { /* store may not be ready yet */ }
    }

    // Surface the backend error message if available
    const backendError = error.response?.data?.error;
    return Promise.reject(backendError ?? error);
  }
);

/** Typed helper: POST with form data (multipart) */
export const apiUpload = <T = any>(url: string, formData: FormData): Promise<T> =>
  apiClient.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as unknown as Promise<T>;
