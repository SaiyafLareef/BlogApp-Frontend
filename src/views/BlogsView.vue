<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Post } from '@/types'
import BlogGrid from '@/components/blog/BlogGrid.vue'
import BlogFilters from '@/components/blog/BlogFilters.vue'
import BlogPagination from '@/components/blog/BlogPagination.vue'

import { MOCK_POSTS } from '@/utils/mockData'

const route = useRoute()
const categories = ['Vue.js', 'CSS', 'TypeScript', 'UI/UX', 'Design', 'Testing']

const searchQuery = ref('')
const selectedCategory = ref(route.query.category as string || 'All')
const currentSort = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 6

// Filter and Sort Logic
const filteredAndSortedPosts = computed(() => {
  let result = [...MOCK_POSTS]

  // Filter by category
  if (selectedCategory.value !== 'All') {
    result = result.filter(post => post.category === selectedCategory.value)
  }

  // Filter by search
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      post => post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
    )
  }

  // Sort
  result.sort((a, b) => {
    if (currentSort.value === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (currentSort.value === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (currentSort.value === 'popular') {
      return b.views - a.views
    }
    return 0
  })

  return result
})

// Pagination Logic
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedPosts.value.slice(start, end)
})

// Reset page to 1 when filters change
const handleSearchUpdate = (val: string) => {
  searchQuery.value = val
  currentPage.value = 1
}

const handleCategoryUpdate = (val: string) => {
  selectedCategory.value = val
  currentPage.value = 1
}

const handleSortUpdate = (val: string) => {
  currentSort.value = val
  currentPage.value = 1
}

const handlePageUpdate = (val: number) => {
  currentPage.value = val
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">Explore Our Blog</h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Discover the latest articles, tutorials, and insights from our community of developers and designers.
      </p>
    </div>

    <BlogFilters 
      :search="searchQuery"
      :category="selectedCategory"
      :sort="currentSort"
      :categories="categories"
      @update:search="handleSearchUpdate"
      @update:category="handleCategoryUpdate"
      @update:sort="handleSortUpdate"
    />

    <BlogGrid :posts="paginatedPosts" />

    <BlogPagination 
      :total="filteredAndSortedPosts.length"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      @update:page="handlePageUpdate"
    />
  </div>
</template>
