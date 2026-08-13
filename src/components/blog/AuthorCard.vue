<script setup lang="ts">
import type { User } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

defineProps<{
  author: User
}>()
</script>

<template>
  <Card class="border-border/50 shadow-sm overflow-hidden">
    <CardContent class="p-6">
      <h3 class="text-lg font-semibold mb-4">About the Author</h3>
      <div class="flex items-start gap-4">
        <div class="h-16 w-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
          <img v-if="author.avatar" :src="author.avatar as string" :alt="author.name || ''" class="h-full w-full object-cover" />
          <span v-else>{{ author.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-foreground">{{ author.name }}</h4>
          <p class="text-sm text-muted-foreground mt-1 line-clamp-3">
            {{ author.bio || 'Software developer and writer sharing insights on modern web development and design.' }}
          </p>
          <Button variant="outline" size="sm" class="mt-4 w-full">Follow</Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
