<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBlog } from '@/composables/useBlog'
import BlogEditor from '@/components/blog/BlogEditor.vue'

const router = useRouter()
const isSubmitting = ref(false)
const { user } = useAuth()
const { createPost } = useBlog()

const handleSubmit = async (values: any, status: 'draft' | 'published') => {
  isSubmitting.value = true
  if (!user.value) return
  try {
    await createPost({
      ...values,
      author: user.value,
      status
    })
    router.push('/my-blogs')
  } catch (error) {
    console.error('Failed to create post', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="mb-10 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Create New Blog Post</h1>
      <p class="text-muted-foreground">Share your knowledge with the community.</p>
    </div>
    
    <BlogEditor 
      :is-submitting="isSubmitting"
      @submit="handleSubmit"
      @cancel="router.push('/my-blogs')"
    />
  </div>
</template>
