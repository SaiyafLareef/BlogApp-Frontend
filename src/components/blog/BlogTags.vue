<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Tag } from '@lucide/vue'

defineProps<{
  tags: string[]
}>()
</script>

<template>
  <div class="mt-8 pt-8 border-t border-border/40">
    <h3 class="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-4">
      <Tag class="h-4 w-4" />
      Tags
    </h3>
    <div class="flex flex-wrap gap-2">
      <Badge 
        v-for="tag in tags" 
        :key="tag" 
        variant="secondary"
        class="cursor-pointer hover:bg-secondary/80 text-sm font-medium"
      >
        #{{ tag }}
      </Badge>
    </div>
  </div>
</template>
