import { apiClient } from './index';

export const likeApi = {
  /**
   * POST /posts/:postId/like  (requires auth)
   * Returns { message, count }
   */
  likePost: (postId: string): Promise<{ message: string; count: number }> =>
    apiClient.post(`/posts/${postId}/like`),

  /**
   * DELETE /posts/:postId/like  (requires auth)
   * Returns { message, count }
   */
  unlikePost: (postId: string): Promise<{ message: string; count: number }> =>
    apiClient.delete(`/posts/${postId}/like`),

  /**
   * GET /posts/:postId/likes  (requires auth)
   * Returns { count, hasLiked }
   */
  getLikeStatus: (postId: string): Promise<{ count: number; hasLiked: boolean }> =>
    apiClient.get(`/posts/${postId}/likes`),
};
