<script setup lang="ts">
import { ref, computed } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from '@lucide/vue'

const props = defineProps<{
  modelValue: string
  error?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputValue = ref('')

const tagsList = computed(() => {
  if (!props.modelValue) return []
  return props.modelValue.split(',').map(t => t.trim()).filter(Boolean)
})

const addTag = (event: Event) => {
  event.preventDefault()
  if (props.disabled) return
  
  const val = inputValue.value.trim()
  if (!val) return
  
  // Basic duplicate check
  if (tagsList.value.some(t => t.toLowerCase() === val.toLowerCase())) {
    inputValue.value = ''
    return
  }
  
  const newTags = [...tagsList.value, val].join(', ')
  emit('update:modelValue', newTags)
  inputValue.value = ''
}

const removeTag = (index: number) => {
  if (props.disabled) return
  const newTags = [...tagsList.value]
  newTags.splice(index, 1)
  emit('update:modelValue', newTags.join(', '))
}
</script>

<template>
  <div class="space-y-2">
    <Label for="tags-input">Tags</Label>
    
    <div class="flex flex-wrap gap-2 mb-2" v-if="tagsList.length > 0">
      <Badge 
        v-for="(tag, index) in tagsList" 
        :key="index"
        variant="secondary"
        class="flex items-center gap-1 pr-1"
      >
        {{ tag }}
        <button 
          type="button" 
          @click="removeTag(index)" 
          :disabled="disabled"
          class="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors disabled:opacity-50"
        >
          <X class="h-3 w-3" />
          <span class="sr-only">Remove {{ tag }} tag</span>
        </button>
      </Badge>
    </div>

    <Input 
      id="tags-input" 
      v-model="inputValue" 
      @keydown.enter.prevent="addTag"
      @keydown.comma.prevent="addTag"
      placeholder="Type a tag and press Enter or comma" 
      :disabled="disabled" 
    />
    <p class="text-xs text-muted-foreground">Press enter or comma to add a tag</p>
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
  </div>
</template>
