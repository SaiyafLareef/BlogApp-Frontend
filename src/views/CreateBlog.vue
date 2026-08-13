<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBlog } from '@/composables/useBlog'
import { blogApi } from '@/api/blogs'
import BlogEditor from '@/components/blog/BlogEditor.vue'

const router = useRouter()
const isSubmitting = ref(false)
const { user } = useAuth()
const { createPost } = useBlog()

const handleSubmit = async (values: any, status: 'draft' | 'published', file: File | null = null) => {
  isSubmitting.value = true
  if (!user.value) return
  try {
    // If the coverImage is a blob string, we should omit it from the payload
    // since we'll upload the actual file right after creating the post
    const coverImagePayload = values.coverImage?.startsWith('blob:') ? undefined : values.coverImage;

    const postData = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      summary: values.summary,
      coverImage: coverImagePayload,
      category: values.category,
      tags: Array.isArray(values.tags) ? values.tags : [],
      status: status === 'published' ? 'PUBLISHED' : 'DRAFT',
    };
    
    // Wait, createPost from useBlog doesn't return the created post directly, it just returns it internally or updates state?
    // Let's check useBlog.ts. If it returns the post, we can use it. Wait, the store returns the promise.
    // Actually, blogStore.createPost returns void or the post? 
    // Let's use blogApi directly to be safe, or assume createPost returns the post data. 
    // Wait, let's use blogApi directly here to get the ID, or just check useBlog.
    // I can import blogApi directly to guarantee I get the created post's ID.
    const res = await blogApi.createPost(postData);
    
    if (file) {
      await blogApi.uploadCoverImage(res.post.id, file);
    }
    
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
