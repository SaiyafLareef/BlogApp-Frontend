import { apiClient, apiUpload } from './index';
import type { User } from '@/types';

export const userApi = {
  /**
   * GET /users/:username
   * Returns { user }
   */
  getProfile: (username: string): Promise<{ user: User }> =>
    apiClient.get(`/users/${username}`),

  /**
   * PATCH /users/me
   * Returns { user }
   */
  updateProfile: (updates: { name?: string; bio?: string; email?: string }): Promise<{ user: User }> =>
    apiClient.patch('/users/me', updates),

  /**
   * POST /users/me/avatar  (multipart/form-data)
   * Returns { user }
   */
  uploadAvatar: (file: File): Promise<{ user: User }> => {
    const formData = new FormData();
    formData.append('image', file); // changed from 'avatar' to 'image' to match backend expectation
    return apiUpload('/users/me/avatar', formData);
  },

  /**
   * DELETE /users/me
   * Returns { message }
   */
  deleteAccount: (): Promise<{ message: string }> =>
    apiClient.delete('/users/me'),

  /**
   * GET /users/me/likes
   * Returns { posts }
   */
  getLikedPosts: (): Promise<{ posts: any[] }> =>
    apiClient.get('/users/me/likes'),

  /**
   * GET /users/me/bookmarks
   * Returns { bookmarks } or { posts } depending on API. The backend returns paginated bookmarks.
   */
  getBookmarkedPosts: (): Promise<any> =>
    apiClient.get('/users/me/bookmarks'),
};
