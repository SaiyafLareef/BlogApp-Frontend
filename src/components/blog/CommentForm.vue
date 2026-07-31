<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { commentSchema } from '@/validation/comment'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  initialValue?: string
  isSubmitting?: boolean
  submitLabel?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'submit', content: string): void
  (e: 'cancel'): void
}>()

const schema = toTypedSchema(commentSchema)

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    content: props.initialValue || ''
  }
})

const { value: content, errorMessage } = useField<string>('content')

const onSubmit = handleSubmit((values) => {
  emit('submit', values.content)
  if (!props.initialValue) {
    resetForm()
  }
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <div class="relative">
      <textarea
        v-model="content"
        :placeholder="placeholder || 'Write a comment...'"
        class="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
        :disabled="isSubmitting"
      ></textarea>
      <p v-if="errorMessage" class="text-xs text-destructive mt-1">{{ errorMessage }}</p>
    </div>
    
    <div class="flex items-center justify-end gap-2">
      <Button 
        type="button" 
        variant="ghost" 
        @click="emit('cancel')"
        :disabled="isSubmitting"
        v-if="initialValue || placeholder !== 'Write a comment...'"
      >
        Cancel
      </Button>
      <Button type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
        {{ submitLabel || 'Post Comment' }}
      </Button>
    </div>
  </form>
</template>
