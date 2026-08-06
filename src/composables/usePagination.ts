import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog'

export function usePagination() {
  const store = useBlogStore()
  const { currentPage, itemsPerPage, totalPages, paginatedPosts } = storeToRefs(store)
  
  const nextPage = () => store.setPage(currentPage.value + 1)
  const prevPage = () => store.setPage(currentPage.value - 1)

  return {
    // State
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedPosts,
    
    // Actions
    setPage: store.setPage,
    nextPage,
    prevPage
  }
}
