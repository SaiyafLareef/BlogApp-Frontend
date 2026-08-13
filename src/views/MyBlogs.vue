<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { blogApi } from '@/api/blogs'
import { useAuth } from '@/composables/useAuth'
import { useBlog } from '@/composables/useBlog'
import { formatDate } from '@/utils/date'
import type { Post } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Plus, Eye, Heart, MessageCircle } from '@lucide/vue'

const router = useRouter()
const { user } = useAuth()
const { deletePost: storeDeletePost } = useBlog()
const posts = ref<Post[]>([])
const isLoading = ref(true)

const fetchPosts = async () => {
  isLoading.value = true
  if (!user.value) return
  try {
    const res = await blogApi.getPosts({ authorId: user.value.id })
    posts.value = res.posts
  } catch (error) {
    console.error('Failed to load user posts')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPosts)

const deletePost = async (id: string) => {
  if (!confirm('Are you sure you want to delete this post?')) return
  try {
    await storeDeletePost(id)
    posts.value = posts.value.filter(p => p.id !== id)
  } catch (error) {
    console.error('Failed to delete post')
  }
}

</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-6xl">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight mb-2">My Blogs</h1>
        <p class="text-muted-foreground">Manage your articles and drafts.</p>
      </div>
      <Button @click="router.push('/blog/create')" class="flex items-center gap-2">
        <Plus class="h-4 w-4" />
        Create New Blog
      </Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-20 bg-muted/30 rounded-xl border border-border/40">
      <h3 class="text-xl font-medium mb-2">No blogs found</h3>
      <p class="text-muted-foreground mb-6">You haven't written any articles yet.</p>
      <Button @click="router.push('/blog/create')">Write your first post</Button>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
        v-for="post in posts"
        :key="post.id"
        class="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors group"
      >
        <div class="sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <img :src="(post.coverImage as string) || ''" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <Badge :variant="post.status === 'PUBLISHED' ? 'default' : 'secondary'">
                {{ post.status === 'PUBLISHED' ? 'Published' : 'Draft' }}
              </Badge>
              <span class="text-xs text-muted-foreground">{{ formatDate(post.updatedAt) }}</span>
            </div>
            <h3 class="text-lg font-semibold line-clamp-1 mb-1">{{ post.title }}</h3>
            <p class="text-sm text-muted-foreground line-clamp-2">{{ post.summary }}</p>
          </div>

          <div class="flex items-center gap-4 mt-4 pt-4 border-t border-border/40">
            <div class="flex items-center gap-4 text-xs text-muted-foreground">
              <span class="flex items-center"><Heart class="w-4 h-4 mr-1" /> {{ post._count?.likes || post.likes || 0 }}</span>
              <span class="flex items-center"><MessageCircle class="w-4 h-4 mr-1" /> {{ post._count?.comments || 0 }}</span>
              <span>{{ post.views }} views</span>
            </div>

            <div class="flex items-center gap-2 ml-auto">
              <Button
                v-if="post.status === 'PUBLISHED'"
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-primary"
                @click="router.push(`/blog/${post.id}`)"
                title="View Post"
              >
                <Eye class="h-4 w-4" />
                <span class="sr-only">View</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-primary"
                @click="router.push(`/blog/edit/${post.id}`)"
                title="Edit Post"
              >
                <Edit2 class="h-4 w-4" />
                <span class="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-destructive"
                @click="deletePost(post.id)"
                title="Delete Post"
              >
                <Trash2 class="h-4 w-4" />
                <span class="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
