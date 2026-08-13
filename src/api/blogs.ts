import { apiClient, apiUpload } from './index';
import type { Post, PaginatedResponse } from '@/types';

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  /** Category name or slug */
  category?: string;
  /** Tag name or slug */
  tag?: string;
  /** Author username */
  author?: string;
  /** Author ID */
  authorId?: string;
  status?: 'PUBLISHED' | 'DRAFT';
  sort?: 'latest' | 'oldest' | 'popular';
}

export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  coverImage?: string;
  status?: 'PUBLISHED' | 'DRAFT';
  /** Comma-separated tag names or array of tag names */
  tags?: string[];
  /** Category name */
  category?: string;
}

export const blogApi = {
  /**
   * GET /blogs
   * Returns { message, posts, meta }
   */
  getPosts: (params?: GetBlogsParams): Promise<PaginatedResponse<Post>> =>
    apiClient.get('/blogs', { params }),

  /**
   * GET /blogs/:id
   * Returns { message, post }
   */
  getPost: (slugOrId: string): Promise<{ post: Post }> =>
    apiClient.get(`/blogs/${slugOrId}`),

  /**
   * POST /blogs  (requires auth)
   * Returns { message, post }
   */
  createPost: (postData: CreatePostData): Promise<{ post: Post }> =>
    apiClient.post('/blogs', postData),

  /**
   * PATCH /blogs/:id  (requires auth, must be author)
   * Returns { message, post }
   */
  updatePost: (id: string, updates: Partial<CreatePostData>): Promise<{ post: Post }> =>
    apiClient.patch(`/blogs/${id}`, updates),

  /**
   * DELETE /blogs/:id  (requires auth, must be author)
   */
  deletePost: (id: string): Promise<void> =>
    apiClient.delete(`/blogs/${id}`),

  /**
   * POST /blogs/:id/cover  (multipart/form-data, field: "image")
   * Returns { message, post }
   */
  uploadCoverImage: (id: string, file: File): Promise<{ post: Post }> => {
    const formData = new FormData();
    formData.append('image', file); // backend expects field named "image"
    return apiUpload(`/blogs/${id}/cover`, formData);
  },
};
