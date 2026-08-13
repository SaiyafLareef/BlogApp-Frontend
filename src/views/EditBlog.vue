<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlog } from '@/composables/useBlog'
import BlogEditor from '@/components/blog/BlogEditor.vue'
import type { Post } from '@/types'

const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
const isLoading = ref(true)
const postData = ref<Post | null>(null)
const { getPostById, updatePost } = useBlog()

onMounted(async () => {
  isLoading.value = true
  try {
    const post = await getPostById(route.params.id as string)
    if (post) {
      postData.value = post
    } else {
      router.push('/my-blogs')
    }
  } catch (error) {
    console.error('Failed to fetch post')
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async (values: any, status: 'draft' | 'published') => {
  if (!postData.value) return
  isSubmitting.value = true
  try {
    await updatePost(postData.value.id, {
      title: values.title,
      slug: values.slug,
      content: values.content,
      summary: values.summary,
      coverImage: values.coverImage,
      category: values.category,
      tags: Array.isArray(values.tags) ? values.tags : [],
      status: status === 'published' ? 'PUBLISHED' : 'DRAFT',
    })
    router.push('/my-blogs')
  } catch (error) {
    console.error('Failed to update post', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[40vh]">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
    
    <div v-else-if="postData">
      <div class="mb-10 max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold tracking-tight mb-2">Edit Blog Post</h1>
        <p class="text-muted-foreground">Update your content.</p>
      </div>
      
      <BlogEditor 
        :initial-data="postData"
        :is-editing="true"
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="router.push('/my-blogs')"
      />
    </div>
  </div>
</template>
