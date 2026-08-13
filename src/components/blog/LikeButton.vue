<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Heart } from '@lucide/vue'
import { useInteractionStore } from '@/stores/interaction'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{
  postId: string
  initialCount?: number
}>()

const interactionStore = useInteractionStore()
const { isAuthenticated } = useAuth()

const isLiked = computed(() => interactionStore.isLiked(props.postId))

const localOffset = ref(0)
let lastIsLiked = isLiked.value

watch(isLiked, (newVal) => {
  if (newVal !== lastIsLiked) {
    localOffset.value += newVal ? 1 : -1
    lastIsLiked = newVal
  }
})

// The like count: prefer live data from the store, fall back to initial prop
const count = computed(() => {
  const base = props.initialCount ?? 0
  return Math.max(0, base + localOffset.value)
})

const toggleLike = async () => {
  if (!isAuthenticated.value) return
  await interactionStore.toggleLike(props.postId)
}
</script>

<template>
  <Button 
    variant="outline" 
    class="flex items-center gap-2 rounded-full transition-colors"
    :class="isLiked ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/30 dark:border-red-900 dark:hover:bg-red-900/50' : 'hover:text-red-500'"
    @click="toggleLike"
    :title="!isAuthenticated ? 'Login to like this post' : undefined"
  >
    <Heart class="h-4 w-4 transition-transform active:scale-75" :class="isLiked ? 'fill-current' : ''" />
    <span>{{ count }}</span>
    <span class="sr-only">{{ isLiked ? 'Unlike post' : 'Like post' }}</span>
  </Button>
</template>
