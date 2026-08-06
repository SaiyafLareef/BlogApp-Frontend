import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useInteractionStore } from '@/stores/interaction'

export function useLikes(postId?: string) {
  const store = useInteractionStore()
  const { loading } = storeToRefs(store)
  
  const isLiked = computed(() => {
    if (!postId) return false
    return store.isLiked(postId)
  })

  const toggle = async () => {
    if (postId) {
      await store.toggleLike(postId)
    }
  }

  return {
    // State
    isLiked,
    loading,
    
    // Actions
    toggleLike: store.toggleLike,
    toggle
  }
}
