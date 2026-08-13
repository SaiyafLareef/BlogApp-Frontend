import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Post, Category, Tag } from '@/types'
import { blogApi } from '@/api/blogs'
import { categoryApi } from '@/api/categories'
import { tagApi } from '@/api/tags'

export const useBlogStore = defineStore('blog', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchQuery = ref('')
  const activeCategory = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(6)
  const totalPages = ref(1)
  const totalItems = ref(0)

  const categories = ref<Category[]>([])
  const tags = ref<Tag[]>([])

  const filteredPosts = computed(() => posts.value)
  const paginatedPosts = computed(() => posts.value) // Server-side pagination

  // ── Actions ───────────────────────────────────────────────────────────────
  const fetchTaxonomy = async () => {
    try {
      const [catsPayload, tagsPayload] = await Promise.all([
        categoryApi.getCategories(),
        tagApi.getTags(),
      ])
      categories.value = catsPayload.categories
      tags.value = tagsPayload.tags
    } catch (err) {
      console.error('Failed to fetch taxonomy', err)
    }
  }

  const fetchAllPosts = async () => {
    loading.value = true
    error.value = null
    try {
      const payload = await blogApi.getPosts({
        page: currentPage.value,
        limit: itemsPerPage.value,
        search: searchQuery.value || undefined,
        category: activeCategory.value || undefined,
        status: 'PUBLISHED',
      })
      // Backend returns { posts, meta } inside the data envelope
      posts.value = (payload as any).posts ?? payload.data ?? []
      const meta = (payload as any).meta
      if (meta) {
        totalPages.value = meta.totalPages ?? 1
        totalItems.value = meta.total ?? 0
      }
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch posts'
    } finally {
      loading.value = false
    }
  }

  const getPostById = async (slugOrId: string): Promise<Post | undefined> => {
    loading.value = true
    try {
      const payload = await blogApi.getPost(slugOrId)
      return payload.post
    } catch {
      return undefined
    } finally {
      loading.value = false
    }
  }

  const createPost = async (postData: Parameters<typeof blogApi.createPost>[0]) => {
    loading.value = true
    error.value = null
    try {
      const payload = await blogApi.createPost(postData)
      await fetchAllPosts()
      return payload.post
    } catch (err: any) {
      error.value = err?.message || 'Failed to create post'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (id: string, updates: Parameters<typeof blogApi.updatePost>[1]) => {
    loading.value = true
    error.value = null
    try {
      const payload = await blogApi.updatePost(id, updates)
      // Optimistically update in-place if the post is already in the store
      const idx = posts.value.findIndex(p => p.id === id)
      if (idx !== -1) posts.value[idx] = payload.post
      return payload.post
    } catch (err: any) {
      error.value = err?.message || 'Failed to update post'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await blogApi.deletePost(id)
      posts.value = posts.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err?.message || 'Failed to delete post'
      throw err
    } finally {
      loading.value = false
    }
  }

  const uploadCoverImage = async (id: string, file: File) => {
    loading.value = true
    try {
      const payload = await blogApi.uploadCoverImage(id, file)
      const idx = posts.value.findIndex(p => p.id === id)
      if (idx !== -1) posts.value[idx] = payload.post
      return payload.post
    } catch (err: any) {
      throw err
    } finally {
      loading.value = false
    }
  }

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchAllPosts()
    }
  }

  return {
    posts,
    loading,
    error,
    searchQuery,
    activeCategory,
    currentPage,
    itemsPerPage,
    categories,
    tags,
    filteredPosts,
    totalPages,
    totalItems,
    paginatedPosts,
    fetchTaxonomy,
    fetchAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    uploadCoverImage,
    setPage,
  }
})
