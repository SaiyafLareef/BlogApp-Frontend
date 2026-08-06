<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Post } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Eye } from '@lucide/vue'

import BlogContent from '@/components/blog/BlogContent.vue'
import AuthorCard from '@/components/blog/AuthorCard.vue'
import BlogTags from '@/components/blog/BlogTags.vue'
import ShareButtons from '@/components/blog/ShareButtons.vue'
import RelatedPosts from '@/components/blog/RelatedPosts.vue'
import CommentList from '@/components/blog/CommentList.vue'
import LikeButton from '@/components/blog/LikeButton.vue'
import BookmarkButton from '@/components/blog/BookmarkButton.vue'

import { useBlog } from '@/composables/useBlog'
import { formatDate } from '@/utils/date'

const route = useRoute()
const { getPostById, posts } = useBlog()

const post = ref<Post | null>(null)
const relatedPosts = ref<Post[]>([])
const loading = ref(true)

const fetchPost = async (id: string | string[]) => {
  loading.value = true
  const postId = Array.isArray(id) ? id[0] : id
  
  const found = await getPostById(postId)
  if (found) {
    post.value = found
    relatedPosts.value = posts.value.filter(p => p.id !== postId).slice(0, 3)
  } else {
    post.value = null
    relatedPosts.value = []
  }
  loading.value = false
}

onMounted(() => fetchPost(route.params.slug as string))
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) fetchPost(newSlug as string)
})

</script>

<template>
  <div v-if="loading" class="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>

  <div v-else-if="!post" class="container mx-auto px-4 py-24 text-center">
    <h1 class="text-4xl font-bold tracking-tight mb-4 text-foreground">Post Not Found</h1>
    <p class="text-muted-foreground mb-8">The article you are looking for doesn't exist or has been removed.</p>
    <router-link to="/explore" class="text-primary hover:underline font-medium">Return to Blog</router-link>
  </div>

  <article v-else class="container mx-auto px-4 py-12">
    <!-- Header Section -->
    <header class="max-w-4xl mx-auto mb-10 text-center">
      <Badge class="mb-6 hover:bg-primary" variant="default">{{ post.category }}</Badge>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
        {{ post.title }}
      </h1>
      
      <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-2">
          <img v-if="post.author.avatarUrl" :src="post.author.avatarUrl" :alt="post.author.name" class="h-6 w-6 rounded-full object-cover" />
          <span class="font-medium text-foreground">{{ post.author.name }}</span>
        </div>
        <span class="hidden sm:inline-block text-border">•</span>
        <div class="flex items-center gap-1.5">
          <Calendar class="h-4 w-4" />
          <span>{{ formatDate(post.createdAt) }}</span>
        </div>
        <span class="hidden sm:inline-block text-border">•</span>
        <div class="flex items-center gap-1.5">
          <Clock class="h-4 w-4" />
          <span>{{ post.readingTime }} min read</span>
        </div>
        <span class="hidden sm:inline-block text-border">•</span>
        <div class="flex items-center gap-1.5">
          <Eye class="h-4 w-4" />
          <span>{{ post.views }} views</span>
        </div>
      </div>
    </header>

    <!-- Cover Image -->
    <div class="max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-lg border border-border/50">
      <img :src="post.imageUrl" :alt="post.title" class="w-full h-auto aspect-video object-cover" />
    </div>

    <!-- Main Content & Sidebar Layout -->
    <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
      <!-- Content Area -->
      <div class="lg:col-span-8">
        <BlogContent :content="post.content" />
        <BlogTags :tags="post.tags" />
        <ShareButtons />
      </div>
      
      <!-- Sidebar Area -->
      <aside class="lg:col-span-4">
        <div class="sticky top-24 space-y-6">
          <div class="flex gap-4">
            <LikeButton :initial-count="post.likes || 120" class="flex-1 justify-center" />
            <BookmarkButton :initial-count="post.bookmarks || 45" class="flex-1 justify-center" />
          </div>
          <AuthorCard :author="post.author" />
        </div>
      </aside>
    </div>

    <!-- Comments Section -->
    <CommentList :post-id="post.id" />

    <!-- Related Posts -->
    <RelatedPosts :posts="relatedPosts" />
  </article>
</template>
