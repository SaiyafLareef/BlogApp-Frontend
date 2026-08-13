<script setup lang="ts">
import { watch, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { blogSchema } from '@/validation/blog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import CoverImageUploader from './CoverImageUploader.vue'
import CategorySelector from './CategorySelector.vue'
import TagSelector from './TagSelector.vue'
import PublishStatus from './PublishStatus.vue'

const props = defineProps<{
  initialData?: any
  isSubmitting?: boolean
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', values: any, status: 'draft' | 'published', file: File | null): void
  (e: 'cancel'): void
}>()

const schema = toTypedSchema(blogSchema)

const { handleSubmit, setValues, values } = useForm({
  validationSchema: schema,
  initialValues: {
    title: props.initialData?.title || '',
    slug: props.initialData?.slug || '',
    summary: props.initialData?.summary || '',
    content: props.initialData?.content || '',
    coverImage: props.initialData?.coverImage || '',
    category: props.initialData?.category || '',
    tags: (props.initialData?.tags?.map((t: any) => t.name) || []).join(', ') || ''
  }
})

// Auto-generate slug from title
watch(() => values.title, (newTitle) => {
  if (!props.isEditing && newTitle) {
    const generated = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    setValues({ slug: generated })
  }
})

const { value: title, errorMessage: titleError } = useField<string>('title')
const { value: slug, errorMessage: slugError } = useField<string>('slug')
const { value: summary, errorMessage: summaryError } = useField<string>('summary')
const { value: content, errorMessage: contentError } = useField<string>('content')
const { value: coverImage, errorMessage: coverImageError } = useField<string>('coverImage')
const { value: category, errorMessage: categoryError } = useField<string>('category')
const { value: tags, errorMessage: tagsError } = useField<string>('tags')

const coverImageFile = ref<File | null>(null)

const handleDraft = handleSubmit((formValues) => {
  const processedValues = {
    ...formValues,
    tags: formValues.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
  }
  emit('submit', processedValues, 'draft', coverImageFile.value)
})

const handlePublish = handleSubmit((formValues) => {
  const processedValues = {
    ...formValues,
    tags: formValues.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
  }
  emit('submit', processedValues, 'published', coverImageFile.value)
})
</script>

<template>
  <form class="space-y-8 max-w-4xl mx-auto" @submit.prevent>

    <CoverImageUploader
      v-model="coverImage"
      @update:file="f => coverImageFile = f"
      :error="coverImageError"
      :disabled="isSubmitting"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <Label for="title">Title</Label>
        <Input id="title" v-model="title" placeholder="Blog post title" :disabled="isSubmitting" />
        <p v-if="titleError" class="text-xs text-destructive">{{ titleError }}</p>
      </div>

      <div class="space-y-2">
        <Label for="slug">Slug</Label>
        <Input id="slug" v-model="slug" placeholder="blog-post-title" :disabled="isSubmitting" />
        <p v-if="slugError" class="text-xs text-destructive">{{ slugError }}</p>
      </div>
    </div>

    <div class="space-y-2">
      <Label for="summary">Summary / Excerpt</Label>
      <textarea
        id="summary"
        v-model="summary"
        placeholder="A brief summary of your post..."
        class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
        :disabled="isSubmitting"
      ></textarea>
      <p v-if="summaryError" class="text-xs text-destructive">{{ summaryError }}</p>
    </div>

    <div class="space-y-2">
      <Label for="content">Content (Rich Text Placeholder)</Label>
      <textarea
        id="content"
        v-model="content"
        placeholder="Write your amazing content here... Use markdown formatting!"
        class="flex min-h-[350px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y font-mono bg-muted/10"
        :disabled="isSubmitting"
      ></textarea>
      <p class="text-xs text-muted-foreground mt-1">This area simulates a Rich Text Editor using Markdown support.</p>
      <p v-if="contentError" class="text-xs text-destructive">{{ contentError }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CategorySelector
        v-model="category"
        :error="categoryError"
        :disabled="isSubmitting"
      />

      <TagSelector
        v-model="tags"
        :error="tagsError"
        :disabled="isSubmitting"
      />
    </div>

    <PublishStatus
      :is-submitting="isSubmitting"
      :is-editing="isEditing"
      @draft="handleDraft"
      @publish="handlePublish"
      @cancel="emit('cancel')"
    />
  </form>
</template>
