import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'

export function useBlog() {
  const store = useBlogStore()
  const { posts, loading, error, categories, activeCategory } = storeToRefs(store)
  
  return {
    // State
    posts,
    loading,
    error,
    categories,
    activeCategory,
    
    // Actions
    fetchAllPosts: store.fetchAllPosts,
    getPostById: store.getPostById,
    createPost: store.createPost,
    updatePost: store.updatePost,
    deletePost: store.deletePost
  }
}
