import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useInteractionStore } from '@/stores/interaction'

export function useComments(postId?: string) {
  const store = useInteractionStore()
  const { loading, comments: allComments } = storeToRefs(store)
  
  const comments = computed(() => {
    if (!postId) return allComments.value
    return store.getPostComments(postId)
  })

  return {
    // State
    comments,
    loading,
    
    // Actions
    addComment: store.addComment,
    deleteComment: store.deleteComment,
    updateComment: store.updateComment
  }
}
