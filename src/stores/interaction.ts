import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Comment } from '@/types'
import { likeApi } from '@/api/likes'
import { bookmarkApi } from '@/api/bookmarks'
import { commentApi } from '@/api/comments'
import { useAuthStore } from './auth'

export const useInteractionStore = defineStore('interaction', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const likedPostIds = ref<Set<string>>(new Set())
  const bookmarkedPostIds = ref<Set<string>>(new Set())
  const comments = ref<Comment[]>([])
  const loading = ref(false)

  // ── Getters ───────────────────────────────────────────────────────────────
  const isLiked = computed(() => (postId: string) => likedPostIds.value.has(postId))
  const isBookmarked = computed(() => (postId: string) => bookmarkedPostIds.value.has(postId))

  const getPostComments = computed(() => (postId: string) =>
    comments.value.filter(c => c.postId === postId)
  )

  // ── Likes ─────────────────────────────────────────────────────────────────
  const toggleLike = async (postId: string) => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return

    // Optimistic update
    const wasLiked = likedPostIds.value.has(postId)
    if (wasLiked) {
      likedPostIds.value.delete(postId)
    } else {
      likedPostIds.value.add(postId)
    }

    try {
      if (wasLiked) {
        await likeApi.unlikePost(postId)
      } else {
        await likeApi.likePost(postId)
      }
    } catch (err) {
      // Rollback on failure
      if (wasLiked) likedPostIds.value.add(postId)
      else likedPostIds.value.delete(postId)
      console.error('Failed to toggle like', err)
    }
  }

  // ── Bookmarks ─────────────────────────────────────────────────────────────
  const toggleBookmark = async (postId: string) => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return

    const wasBookmarked = bookmarkedPostIds.value.has(postId)
    if (wasBookmarked) {
      bookmarkedPostIds.value.delete(postId)
    } else {
      bookmarkedPostIds.value.add(postId)
    }

    try {
      if (wasBookmarked) {
        await bookmarkApi.unbookmarkPost(postId)
      } else {
        await bookmarkApi.bookmarkPost(postId)
      }
    } catch (err) {
      if (wasBookmarked) bookmarkedPostIds.value.add(postId)
      else bookmarkedPostIds.value.delete(postId)
      console.error('Failed to toggle bookmark', err)
    }
  }

  /** Fetch like + bookmark status for a single post (called when a post page loads) */
  const fetchInteractionStatus = async (postId: string) => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return
    try {
      const [likePayload, bookmarkPayload] = await Promise.all([
        likeApi.getLikeStatus(postId),
        bookmarkApi.getBookmarkStatus(postId),
      ])

      if (likePayload.hasLiked) likedPostIds.value.add(postId)
      else likedPostIds.value.delete(postId)

      if (bookmarkPayload.hasBookmarked) bookmarkedPostIds.value.add(postId)
      else bookmarkedPostIds.value.delete(postId)
    } catch (err) {
      console.error('Failed to fetch interaction status', err)
    }
  }

  // ── Comments ──────────────────────────────────────────────────────────────
  const fetchComments = async (postId: string) => {
    loading.value = true
    try {
      const payload = await commentApi.getComments(postId, { limit: 100 })
      // Backend returns { comments, meta } — handle both shapes
      const fetched: Comment[] = (payload as any).comments ?? payload.data ?? []
      // Replace comments for this post
      comments.value = comments.value
        .filter(c => c.postId !== postId)
        .concat(fetched)
    } catch (err) {
      console.error('Failed to fetch comments', err)
    } finally {
      loading.value = false
    }
  }

  const addComment = async (postId: string, content: string, parentId?: string | null) => {
    loading.value = true
    try {
      const payload = await commentApi.addComment(postId, content, parentId)
      comments.value.push(payload.comment)
      return payload.comment
    } catch (err) {
      console.error('Failed to add comment', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteComment = async (id: string) => {
    loading.value = true
    try {
      await commentApi.deleteComment(id)
      comments.value = comments.value.filter(c => c.id !== id)
    } catch (err) {
      console.error('Failed to delete comment', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateComment = async (id: string, content: string) => {
    loading.value = true
    try {
      const payload = await commentApi.editComment(id, content)
      const idx = comments.value.findIndex(c => c.id === id)
      if (idx !== -1) comments.value[idx] = payload.comment
    } catch (err) {
      console.error('Failed to update comment', err)
      throw err
    } finally {
      loading.value = false
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
    fetchInteractionStatus,
    fetchComments,
    addComment,
    deleteComment,
    updateComment,
  }
})
