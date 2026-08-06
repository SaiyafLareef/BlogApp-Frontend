import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'

export function useSearch() {
  const store = useBlogStore()
  const { searchQuery, filteredPosts } = storeToRefs(store)
  
  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    // State
    searchQuery,
    filteredPosts,
    
    // Actions
    clearSearch
  }
}
