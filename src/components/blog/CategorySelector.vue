<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

defineProps<{
  modelValue: string
  error?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const categories = ['Vue.js', 'CSS', 'TypeScript', 'UI/UX', 'Design', 'Testing', 'Engineering']
</script>

<template>
  <div class="space-y-2">
    <Label for="category">Category</Label>
    <Select 
      :model-value="modelValue" 
      @update:model-value="emit('update:modelValue', $event as string)"
      :disabled="disabled"
    >
      <SelectTrigger id="category">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
  </div>
</template>
