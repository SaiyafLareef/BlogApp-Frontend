<script setup lang="ts">
import type { Post } from '@/types'
import BlogCard from './BlogCard.vue'

defineProps<{
  posts: Post[]
}>()
</script>

<template>
  <div v-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <BlogCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
  <div v-else class="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
    <h3 class="text-lg font-medium text-foreground">No posts found</h3>
    <p class="text-sm text-muted-foreground mt-2">Try adjusting your search query or filters.</p>
  </div>
</template>
