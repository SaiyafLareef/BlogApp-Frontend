import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Comment } from '@/types'
import { MOCK_COMMENTS } from '@/utils/mockData'

export const useInteractionStore = defineStore('interaction', () => {
  // State
  const likedPostIds = ref<Set<string>>(new Set())
  const bookmarkedPostIds = ref<Set<string>>(new Set())
  const comments = ref<Comment[]>([...MOCK_COMMENTS])
  const loading = ref(false)

  // Getters
  const isLiked = computed(() => (postId: string) => likedPostIds.value.has(postId))
  const isBookmarked = computed(() => (postId: string) => bookmarkedPostIds.value.has(postId))
  
  const getPostComments = computed(() => (postId: string) => {
    return comments.value.filter(c => c.postId === postId)
  })

  // Actions
  const toggleLike = async (postId: string) => {
    // In a real app, make API call here
    if (likedPostIds.value.has(postId)) {
      likedPostIds.value.delete(postId)
    } else {
      likedPostIds.value.add(postId)
    }
  }

  const toggleBookmark = async (postId: string) => {
    if (bookmarkedPostIds.value.has(postId)) {
      bookmarkedPostIds.value.delete(postId)
    } else {
      bookmarkedPostIds.value.add(postId)
    }
  }

  // Comments CRUD
  const addComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newComment: Comment = {
        ...commentData,
        id: `comment-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0
      }
      comments.value.push(newComment)
      return newComment
    } finally {
      loading.value = false
    }
  }

  const deleteComment = async (id: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Helper to recursively delete nested replies
      const idsToDelete = new Set<string>([id])
      let addedNew = true
      while (addedNew) {
        addedNew = false
        comments.value.forEach(c => {
          if (c.parentId && idsToDelete.has(c.parentId) && !idsToDelete.has(c.id)) {
            idsToDelete.add(c.id)
            addedNew = true
          }
        })
      }
      
      comments.value = comments.value.filter(c => !idsToDelete.has(c.id))
    } finally {
      loading.value = false
    }
  }

  const updateComment = async (id: string, content: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = comments.value.findIndex(c => c.id === id)
      if (index !== -1) {
        comments.value[index].content = content
        comments.value[index].updatedAt = new Date().toISOString()
      }
    } finally {
      loading.value = false
    }
  }

  const likeComment = async (id: string) => {
    const index = comments.value.findIndex(c => c.id === id)
    if (index !== -1) {
      comments.value[index].likes = (comments.value[index].likes || 0) + 1
    }
  }

  return {
    likedPostIds,
    bookmarkedPostIds,
    comments,
    loading,
    isLiked,
    isBookmarked,
    getPostComments,
    toggleLike,
    toggleBookmark,
    addComment,
    deleteComment,
    updateComment,
    likeComment
  }
})
