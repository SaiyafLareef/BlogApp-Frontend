import { apiClient } from './index';
import type { Comment, PaginatedResponse } from '@/types';

export const commentApi = {
  /**
   * GET /posts/:postId/comments
   * Returns { comments, meta }
   */
  getComments: (
    postId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Comment>> =>
    apiClient.get(`/posts/${postId}/comments`, { params }),

  /**
   * POST /posts/:postId/comments  (requires auth)
   * Returns { message, comment }
   */
  addComment: (
    postId: string,
    content: string,
    parentId?: string | null
  ): Promise<{ comment: Comment }> =>
    apiClient.post(`/posts/${postId}/comments`, { content, parentId: parentId || undefined }),

  /**
   * PATCH /posts/comments/:commentId  (requires auth, must be owner)
   * Returns { message, comment }
   */
  editComment: (commentId: string, content: string): Promise<{ comment: Comment }> =>
    apiClient.patch(`/posts/comments/${commentId}`, { content }),

  /**
   * DELETE /posts/comments/:commentId  (requires auth, must be owner)
   */
  deleteComment: (commentId: string): Promise<void> =>
    apiClient.delete(`/posts/comments/${commentId}`),
};
