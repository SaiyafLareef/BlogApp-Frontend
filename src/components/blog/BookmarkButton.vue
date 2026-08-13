<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Bookmark } from '@lucide/vue'
import { useInteractionStore } from '@/stores/interaction'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{
  postId: string
  initialCount?: number
}>()

const interactionStore = useInteractionStore()
const { isAuthenticated } = useAuth()

const isBookmarked = computed(() => interactionStore.isBookmarked(props.postId))

const localOffset = ref(0)
let lastIsBookmarked = isBookmarked.value

watch(isBookmarked, (newVal) => {
  if (newVal !== lastIsBookmarked) {
    localOffset.value += newVal ? 1 : -1
    lastIsBookmarked = newVal
  }
})

const count = computed(() => {
  const base = props.initialCount ?? 0
  return Math.max(0, base + localOffset.value)
})

const toggleBookmark = async () => {
  if (!isAuthenticated.value) return
  await interactionStore.toggleBookmark(props.postId)
}
</script>

<template>
  <Button 
    variant="outline" 
    class="flex items-center gap-2 rounded-full transition-colors"
    :class="isBookmarked ? 'text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 dark:bg-blue-950/30 dark:border-blue-900 dark:hover:bg-blue-900/50' : 'hover:text-blue-500'"
    @click="toggleBookmark"
    :title="!isAuthenticated ? 'Login to bookmark this post' : undefined"
  >
    <Bookmark class="h-4 w-4 transition-transform active:scale-75" :class="isBookmarked ? 'fill-current' : ''" />
    <span>{{ count }}</span>
    <span class="sr-only">{{ isBookmarked ? 'Remove bookmark' : 'Bookmark post' }}</span>
  </Button>
</template>
