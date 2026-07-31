<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Bookmark } from '@lucide/vue'

const props = defineProps<{
  initialCount?: number
}>()

const isBookmarked = ref(false)
const count = ref(props.initialCount || 0)

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  count.value += isBookmarked.value ? 1 : -1
}
</script>

<template>
  <Button 
    variant="outline" 
    class="flex items-center gap-2 rounded-full transition-colors"
    :class="isBookmarked ? 'text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 dark:bg-blue-950/30 dark:border-blue-900 dark:hover:bg-blue-900/50' : 'hover:text-blue-500'"
    @click="toggleBookmark"
  >
    <Bookmark class="h-4 w-4 transition-transform active:scale-75" :class="isBookmarked ? 'fill-current' : ''" />
    <span>{{ count }}</span>
    <span class="sr-only">{{ isBookmarked ? 'Remove bookmark' : 'Bookmark post' }}</span>
  </Button>
</template>
