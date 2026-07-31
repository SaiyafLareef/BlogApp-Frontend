<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { ImagePlus, X, Loader2 } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  modelValue: string
  error?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileSelect = () => {
  if (props.disabled || isUploading.value) return
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  isUploading.value = true
  
  // Mock an API upload delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Create object URL for local preview mock
  const objectUrl = URL.createObjectURL(file)
  emit('update:modelValue', objectUrl)
  
  isUploading.value = false
  if (fileInput.value) fileInput.value.value = ''
}

const removeImage = () => {
  if (props.disabled) return
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="space-y-2">
    <Label>Cover Image</Label>
    
    <div 
      v-if="modelValue" 
      class="relative group rounded-xl overflow-hidden border border-border aspect-[21/9] bg-muted/30"
    >
      <img :src="modelValue" alt="Cover preview" class="w-full h-full object-cover" />
      
      <div 
        class="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"
        :class="{ 'hidden': disabled }"
      >
        <Button type="button" variant="secondary" @click="triggerFileSelect">
          Change Image
        </Button>
        <Button type="button" variant="destructive" @click="removeImage">
          <X class="h-4 w-4 mr-2" />
          Remove
        </Button>
      </div>
    </div>
    
    <div 
      v-else 
      @click="triggerFileSelect"
      class="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer aspect-[21/9]"
      :class="{ 'opacity-50 cursor-not-allowed': disabled || isUploading }"
    >
      <template v-if="isUploading">
        <Loader2 class="h-10 w-10 animate-spin text-primary mb-4" />
        <p class="font-medium text-foreground">Uploading image...</p>
      </template>
      <template v-else>
        <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <ImagePlus class="h-6 w-6" />
        </div>
        <p class="font-medium text-foreground mb-1">Click to upload cover image</p>
        <p class="text-sm">SVG, PNG, JPG or GIF (max. 5MB)</p>
      </template>
    </div>
    
    <input 
      type="file" 
      ref="fileInput" 
      accept="image/*" 
      class="hidden" 
      @change="handleFileSelect"
    />
    
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
  </div>
</template>
