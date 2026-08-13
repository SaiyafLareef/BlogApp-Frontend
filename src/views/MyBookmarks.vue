<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bookmarkApi } from '@/api/bookmarks'
import { useAuth } from '@/composables/useAuth'
import type { Post } from '@/types'
import { Button } from '@/components/ui/button'
import { BookmarkIcon } from '@lucide/vue'
import BlogGrid from '@/components/blog/BlogGrid.vue'
import BlogPagination from '@/components/blog/BlogPagination.vue'

const router = useRouter()
const { user } = useAuth()
const posts = ref<Post[]>([])
const isLoading = ref(true)

const currentPage = ref(1)
const itemsPerPage = 6
const totalPosts = ref(0)

const fetchBookmarks = async () => {
  isLoading.value = true
  if (!user.value) return
  try {
    const res = await bookmarkApi.getUserBookmarks({ page: currentPage.value, limit: itemsPerPage })
    // The backend returns bookmarks which contains the post
    posts.value = res.bookmarks.map((b: any) => b.post)
    totalPosts.value = res.total
  } catch (error) {
    console.error('Failed to load user bookmarks')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchBookmarks)

const handlePageUpdate = (val: number) => {
  currentPage.value = val
  fetchBookmarks()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-6xl">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight mb-2">My Bookmarks</h1>
        <p class="text-muted-foreground">Articles you've saved for later.</p>
      </div>
      <Button @click="router.push('/explore')" class="flex items-center gap-2">
        <BookmarkIcon class="h-4 w-4" />
        Explore Posts
      </Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-20 bg-muted/30 rounded-xl border border-border/40">
      <h3 class="text-xl font-medium mb-2">No bookmarks found</h3>
      <p class="text-muted-foreground mb-6">You haven't bookmarked any articles yet.</p>
      <Button @click="router.push('/explore')">Explore articles to save</Button>
    </div>

    <div v-else>
      <BlogGrid :posts="posts" />
      <BlogPagination 
        :total="totalPosts"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @update:page="handlePageUpdate"
      />
    </div>
  </div>
</template>
