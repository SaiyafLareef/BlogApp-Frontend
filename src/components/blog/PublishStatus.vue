<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
  isSubmitting?: boolean
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'draft'): void
  (e: 'publish'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-border/50">
    <Button 
      variant="ghost" 
      type="button" 
      @click="emit('cancel')" 
      :disabled="isSubmitting"
      class="w-full sm:w-auto"
    >
      Cancel
    </Button>
    
    <Button 
      variant="outline" 
      type="button" 
      @click="emit('draft')" 
      :disabled="isSubmitting"
      class="w-full sm:w-auto"
    >
      <span v-if="isSubmitting" class="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
      Save as Draft
    </Button>
    
    <Button 
      type="button" 
      @click="emit('publish')" 
      :disabled="isSubmitting"
      class="w-full sm:w-auto"
    >
      <span v-if="isSubmitting" class="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
      {{ isEditing ? 'Update & Publish' : 'Publish' }}
    </Button>
  </div>
</template>
