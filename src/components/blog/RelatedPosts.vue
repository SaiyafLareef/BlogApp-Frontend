<script setup lang="ts">
import type { Post } from '@/types'
import BlogCard from './BlogCard.vue'

defineProps<{
  posts: Post[]
}>()
</script>

<template>
  <div v-if="posts.length > 0" class="mt-16 pt-8 border-t border-border/50 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold tracking-tight mb-6">Related Posts</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
