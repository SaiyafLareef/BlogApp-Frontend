<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Heart } from '@lucide/vue'

const props = defineProps<{
  initialCount?: number
}>()

const isLiked = ref(false)
const count = ref(props.initialCount || 0)

const toggleLike = () => {
  isLiked.value = !isLiked.value
  count.value += isLiked.value ? 1 : -1
}
</script>

<template>
  <Button 
    variant="outline" 
    class="flex items-center gap-2 rounded-full transition-colors"
    :class="isLiked ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/30 dark:border-red-900 dark:hover:bg-red-900/50' : 'hover:text-red-500'"
    @click="toggleLike"
  >
    <Heart class="h-4 w-4 transition-transform active:scale-75" :class="isLiked ? 'fill-current' : ''" />
    <span>{{ count }}</span>
    <span class="sr-only">{{ isLiked ? 'Unlike post' : 'Like post' }}</span>
  </Button>
</template>
