<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{
  total: number
  currentPage: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage))
</script>

<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-12 mb-8">
    <Button 
      variant="outline" 
      size="icon" 
      :disabled="currentPage === 1"
      @click="emit('update:page', currentPage - 1)"
      class="h-9 w-9"
    >
      <ChevronLeft class="h-4 w-4" />
      <span class="sr-only">Previous page</span>
    </Button>
    
    <div class="flex space-x-1">
      <Button 
        v-for="page in totalPages" 
        :key="page"
        :variant="page === currentPage ? 'default' : 'ghost'"
        class="w-9 h-9"
        @click="emit('update:page', page)"
      >
        {{ page }}
      </Button>
    </div>

    <Button 
      variant="outline" 
      size="icon" 
      :disabled="currentPage === totalPages"
      @click="emit('update:page', currentPage + 1)"
      class="h-9 w-9"
    >
      <ChevronRight class="h-4 w-4" />
      <span class="sr-only">Next page</span>
    </Button>
  </div>
</template>
