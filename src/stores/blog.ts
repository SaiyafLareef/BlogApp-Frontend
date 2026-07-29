import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Post } from '@/types'
import { MOCK_POSTS } from '@/utils/mockData'

export const useBlogStore = defineStore('blog', () => {
  // State
  const posts = ref<Post[]>([...MOCK_POSTS])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Filters and Pagination
  const searchQuery = ref('')
  const activeCategory = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(6)

  // Getters
  const categories = computed(() => {
    const allCategories = posts.value.map(p => p.category).filter(Boolean)
    return [...new Set(allCategories)]
  })

  const filteredPosts = computed(() => {
    let result = posts.value
    
    // Drafts should generally be hidden unless we're on a dashboard, 
    // but for simplicity in this global store, we'll return all published posts.
    result = result.filter(p => p.status !== 'draft')

    if (activeCategory.value) {
      result = result.filter(p => p.category === activeCategory.value)
    }

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q)
      )
    }

    // Sort newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredPosts.value.length / itemsPerPage.value)
  })

  const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredPosts.value.slice(start, end)
  })

  // Actions
  const fetchAllPosts = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      // In a real app, we'd fetch from API here.
      // We are already initialized with MOCK_POSTS.
    } finally {
      loading.value = false
    }
  }

  const getPostById = (id: string) => {
    return posts.value.find(p => p.id === id)
  }

  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const newPost: Post = {
        ...postData,
        id: `post-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        bookmarks: 0
      }
      posts.value.unshift(newPost)
      return newPost
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (id: string, updates: Partial<Post>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = {
          ...posts.value[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (id: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      posts.value = posts.value.filter(p => p.id !== id)
    } finally {
      loading.value = false
    }
  }
  
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
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
    filteredPosts,
    totalPages,
    paginatedPosts,
    fetchAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    setPage
  }
})
