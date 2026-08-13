import { apiClient } from './index';
import type { Post, PaginatedResponse } from '@/types';

export const bookmarkApi = {
  /**
   * POST /posts/:postId/bookmark  (requires auth)
   */
  bookmarkPost: (postId: string): Promise<{ message: string }> =>
    apiClient.post(`/posts/${postId}/bookmark`),

  /**
   * DELETE /posts/:postId/bookmark  (requires auth)
   */
  unbookmarkPost: (postId: string): Promise<{ message: string }> =>
    apiClient.delete(`/posts/${postId}/bookmark`),

  /**
   * GET /posts/:postId/bookmark  (requires auth)
   * Returns { hasBookmarked }
   */
  getBookmarkStatus: (postId: string): Promise<{ hasBookmarked: boolean }> =>
    apiClient.get(`/posts/${postId}/bookmark`),

  /**
   * GET /users/me/bookmarks  (requires auth)
   * Returns { bookmarks, meta }
   */
  getUserBookmarks: (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Post>> =>
    apiClient.get('/users/me/bookmarks', { params }),
};
