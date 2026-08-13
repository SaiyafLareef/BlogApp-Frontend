import { apiClient } from './index';
import type { Category } from '@/types';

export const categoryApi = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    return apiClient.get('/categories');
  }
};
