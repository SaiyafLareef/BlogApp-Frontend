import { apiClient, apiUpload } from './index';
import type { User } from '@/types';

interface AuthPayload {
  user: User;
  token: string;
}

interface RegisterPayload {
  message: string;
  user: User;
}

export const authApi = {
  /**
   * POST /auth/login
   * Returns { message, user, token }
   */
  login: (email: string, password: string): Promise<AuthPayload> =>
    apiClient.post('/auth/login', { email, password }),

  /**
   * POST /auth/register
   * Returns { message, user }
   */
  register: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    name?: string;
  }): Promise<RegisterPayload> =>
    apiClient.post('/auth/register', data),

  /**
   * POST /auth/logout
   */
  logout: (): Promise<void> =>
    apiClient.post('/auth/logout'),

  /**
   * GET /auth/me  (requires bearer token)
   * Returns { user }
   */
  getMe: (): Promise<{ user: User }> =>
    apiClient.get('/auth/me'),

  /**
   * PATCH /auth/password (requires auth)
   * Returns { message }
   */
  updatePassword: (data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> =>
    apiClient.patch('/auth/password', data),
};
