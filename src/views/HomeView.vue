<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles } from '@lucide/vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import { useBlog } from '@/composables/useBlog'

const router = useRouter()
const { posts, fetchAllPosts, loading } = useBlog()

onMounted(async () => {
  if (posts.value.length === 0) {
    await fetchAllPosts()
  }
})

const featuredPosts = computed(() => {
  // Return top 3 posts (mocked as most recent)
  return [...posts.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)
})
</script>

<template>
  <div class="space-y-16 pb-16">
    <section class="py-16 md:py-28 lg:py-36 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <!-- Decorative background glow -->
      <div class="absolute -top-24 -z-10 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]"></div>

      <Badge variant="secondary" class="mb-6 py-1.5 px-4 text-sm font-medium flex items-center gap-2 rounded-full">
        <Sparkles class="h-4 w-4 text-primary" />
        Discover the new frontend architecture
      </Badge>

      <h1 class="text-5xl font-extrabold tracking-tight lg:text-7xl mb-6 max-w-4xl">
        Welcome to the <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Modern Blog</span>
      </h1>

      <p class="text-xl text-muted-foreground max-w-[700px] mb-10 leading-relaxed">
        Discover amazing stories, deep-dive technical articles, and insights built with an outstanding user experience using Vue 3 and shadcn-vue.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button size="lg" class="rounded-full px-8 text-base h-12" @click="router.push('/explore')">
          Start Reading
        </Button>
        <Button size="lg" variant="outline" class="rounded-full px-8 text-base h-12 group" @click="router.push('/about')">
          Learn More
          <ArrowRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold tracking-tight">Featured Stories</h2>
        <Button variant="link" class="text-primary hidden sm:flex" @click="router.push('/explore')">
          View all posts <ArrowRight class="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BlogCard
          v-for="post in featuredPosts"
          :key="post.id"
          :post="post"
          class="h-full"
        />
      </div>
    </section>
  </div>
</template>
