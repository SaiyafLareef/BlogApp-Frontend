import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useInteractionStore } from '@/stores/interaction'

export function useBookmarks(postId?: string) {
  const store = useInteractionStore()
  const { loading } = storeToRefs(store)
  
  const isBookmarked = computed(() => {
    if (!postId) return false
    return store.isBookmarked(postId)
  })

  const toggle = async () => {
    if (postId) {
      await store.toggleBookmark(postId)
    }
  }

  return {
    // State
    isBookmarked,
    loading,
    
    // Actions
    toggleBookmark: store.toggleBookmark,
    toggle
  }
}
