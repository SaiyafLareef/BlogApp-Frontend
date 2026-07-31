<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Post } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Eye } from '@lucide/vue'

const props = defineProps<{
  post: Post
}>()

const formattedDate = computed(() => {
  return new Date(props.post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})
</script>

<template>
  <Card class="overflow-hidden flex flex-col h-full transition-all hover:shadow-md border-border/50">
    <RouterLink :to="`/blog/${post.id}`" class="block overflow-hidden h-48 bg-muted">
      <img :src="post.imageUrl" :alt="post.title" class="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
    </RouterLink>
    <CardHeader class="p-5 pb-3 space-y-2">
      <div class="flex justify-between items-center">
        <Badge variant="secondary" class="hover:bg-secondary/80 font-medium">{{ post.category }}</Badge>
        <div class="flex items-center text-xs text-muted-foreground gap-1">
          <Eye class="h-3.5 w-3.5" />
          <span>{{ post.views }}</span>
        </div>
      </div>
      <RouterLink :to="`/blog/${post.id}`" class="block">
        <h3 class="font-bold text-xl leading-tight hover:text-primary transition-colors line-clamp-2 mt-1">
          {{ post.title }}
        </h3>
      </RouterLink>
    </CardHeader>
    <CardContent class="p-5 pt-0 flex-grow">
      <p class="text-muted-foreground text-sm line-clamp-3">
        {{ post.excerpt }}
      </p>
    </CardContent>
    <CardFooter class="p-5 pt-0 flex justify-between items-center text-xs text-muted-foreground border-t mt-4 border-border/30">
      <div class="flex items-center gap-2 mt-4">
        <div class="h-6 w-6 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-semibold">
          <img v-if="post.author.avatarUrl" :src="post.author.avatarUrl" :alt="post.author.name" class="h-full w-full object-cover" />
          <span v-else>{{ post.author.name.charAt(0).toUpperCase() }}</span>
        </div>
        <span>{{ post.author.name }}</span>
      </div>
      <div class="flex items-center gap-1 mt-4">
        <Calendar class="h-3.5 w-3.5" />
        <span>{{ formattedDate }}</span>
      </div>
    </CardFooter>
  </Card>
</template>
