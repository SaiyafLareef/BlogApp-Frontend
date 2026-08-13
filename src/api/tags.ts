import { apiClient } from './index';
import type { Tag } from '@/types';

export const tagApi = {
  getTags: async (): Promise<{ tags: Tag[] }> => {
    return apiClient.get('/tags');
  }
};
