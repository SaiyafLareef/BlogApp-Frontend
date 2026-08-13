<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Comment } from '@/types'
import { useAuth } from '@/composables/useAuth'
import { useComments } from '@/composables/useComments'
import { storeToRefs } from 'pinia'
import { useInteractionStore } from '@/stores/interaction'
import CommentForm from './CommentForm.vue'
import CommentCard from './CommentCard.vue'

const props = defineProps<{
  postId: string
}>()

interface CommentNode extends Comment {
  replies: CommentNode[]
}

const { user } = useAuth()
const { comments, addComment, updateComment, deleteComment } = useComments(props.postId)
const interactionStore = useInteractionStore()
const { loading } = storeToRefs(interactionStore)
const isSubmittingNew = ref(false)

// Build Tree
const commentTree = computed(() => {
  const map = new Map<string, CommentNode>()
  const roots: CommentNode[] = []

  // Initialize nodes
  comments.value.forEach(c => {
    map.set(c.id, { ...c, replies: [] })
  })

  // Build structure
  comments.value.forEach(c => {
    const node = map.get(c.id)!
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node)
    } else {
      roots.push(node)
    }
  })

  // Sort by date (newest first for roots, oldest first for replies)
  roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  const sortReplies = (node: CommentNode) => {
    node.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    node.replies.forEach(sortReplies)
  }
  roots.forEach(sortReplies)

  return roots
})

const handleAddComment = async (content: string) => {
  if (!user.value) return
  isSubmittingNew.value = true
  try {
    await addComment(props.postId, content, null)
  } catch (error) {
    console.error('Failed to add comment')
  } finally {
    isSubmittingNew.value = false
  }
}

const handleReply = async (parentId: string, content: string) => {
  if (!user.value) return
  try {
    await addComment(props.postId, content, parentId)
  } catch (error) {
    console.error('Failed to reply')
  }
}

const handleEdit = async (id: string, content: string) => {
  try {
    await updateComment(id, content)
  } catch (error) {
    console.error('Failed to edit')
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this comment?')) return
  try {
    await deleteComment(id)
  } catch (error) {
    console.error('Failed to delete')
  }
}

const handleLike = async (id: string) => {
  // Not implemented in backend yet
}
</script>

<template>
  <div class="mt-16 pt-12 border-t border-border/50 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold tracking-tight mb-8">
      Comments <span class="text-muted-foreground text-lg font-normal ml-2">({{ comments.length }})</span>
    </h2>

    <div class="mb-12 bg-muted/30 p-6 rounded-xl border border-border/40">
      <h3 class="font-medium text-foreground mb-4">Leave a comment</h3>
      <div class="flex gap-4">
        <div class="hidden sm:flex h-10 w-10 rounded-full overflow-hidden bg-primary/10 items-center justify-center text-primary font-bold flex-shrink-0">
          <img v-if="user?.avatar" :src="user.avatar as string" :alt="user?.name || ''" class="h-full w-full object-cover" />
          <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
        </div>
        <div class="flex-1">
          <CommentForm 
            :is-submitting="isSubmittingNew"
            @submit="handleAddComment"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
    
    <div v-else-if="comments.length === 0" class="text-center py-12 text-muted-foreground">
      <p>No comments yet. Be the first to share your thoughts!</p>
    </div>

    <div v-else class="space-y-4">
      <CommentCard 
        v-for="node in commentTree" 
        :key="node.id"
        :comment="node"
        :replies="node.replies"
        @reply="handleReply"
        @edit="handleEdit"
        @delete="handleDelete"
        @like="handleLike"
      />
    </div>
  </div>
</template>
