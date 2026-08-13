<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogApi } from '@/api/blogs'
import type { Post } from '@/types'
import BlogGrid from '@/components/blog/BlogGrid.vue'
import BlogFilters from '@/components/blog/BlogFilters.vue'
import BlogPagination from '@/components/blog/BlogPagination.vue'

const route = useRoute()
const router = useRouter()
const categories = ['Vue.js', 'CSS', 'TypeScript', 'UI/UX', 'Design', 'Testing']

const posts = ref<Post[]>([])
const loading = ref(true)
const totalPosts = ref(0)
const itemsPerPage = 6

const searchQuery = ref(route.query.search as string || '')
const selectedCategory = ref(route.query.category as string || 'All')
const currentSort = ref(route.query.sort as string || 'newest')
const currentPage = ref(Number(route.query.page) || 1)

const fetchPosts = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      limit: itemsPerPage,
    }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (selectedCategory.value !== 'All') params.category = selectedCategory.value.toLowerCase()
    if (currentSort.value !== 'newest') params.sort = currentSort.value

    const res = await blogApi.getPosts(params)
    posts.value = res.posts
    totalPosts.value = res.total
  } catch (error) {
    console.error('Failed to load posts', error)
  } finally {
    loading.value = false
  }
}

const updateQueryParams = () => {
  const query: any = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedCategory.value !== 'All') query.category = selectedCategory.value
  if (currentSort.value !== 'newest') query.sort = currentSort.value
  if (currentPage.value > 1) query.page = currentPage.value
  
  router.replace({ query }).catch(() => {})
}

// When our local state changes, update the URL
watch([searchQuery, selectedCategory, currentSort, currentPage], () => {
  updateQueryParams()
})

// When the URL changes (e.g. from navbar search), sync state and fetch
watch(() => route.query, (newQuery) => {
  if (newQuery.search !== undefined) searchQuery.value = newQuery.search as string
  if (newQuery.category !== undefined) selectedCategory.value = newQuery.category as string
  if (newQuery.sort !== undefined) currentSort.value = newQuery.sort as string
  if (newQuery.page !== undefined) currentPage.value = Number(newQuery.page)
  fetchPosts()
}, { deep: true })

onMounted(() => {
  fetchPosts()
})

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

    <BlogGrid :posts="posts" />

    <BlogPagination 
      :total="totalPosts"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      @update:page="handlePageUpdate"
    />
  </div>
</template>
