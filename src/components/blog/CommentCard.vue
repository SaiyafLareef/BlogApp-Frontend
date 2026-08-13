<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Comment } from '@/types'
import { useAuth } from '@/composables/useAuth'
import { formatTimeAgo } from '@/utils/date'
import { Heart, Reply, Edit2, Trash2 } from '@lucide/vue'
import CommentForm from './CommentForm.vue'

interface CommentNode extends Comment {
  replies?: CommentNode[]
}

const props = defineProps<{
  comment: CommentNode
  replies?: CommentNode[]
  depth?: number
}>()

const emit = defineEmits<{
  (e: 'reply', parentId: string, content: string): void
  (e: 'edit', id: string, content: string): void
  (e: 'delete', id: string): void
  (e: 'like', id: string): void
}>()

const currentDepth = computed(() => props.depth || 0)
const maxDepthReached = computed(() => currentDepth.value >= 3)

const isReplying = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)

const { user } = useAuth()

const isAuthor = computed(() => user.value && props.comment.user.id === user.value.id)

const handleReply = async (content: string) => {
  isSubmitting.value = true
  const parentIdToUse = maxDepthReached.value && props.comment.parentId
    ? props.comment.parentId
    : props.comment.id

  emit('reply', parentIdToUse, content)
  isSubmitting.value = false
  isReplying.value = false
}

const handleEdit = async (content: string) => {
  isSubmitting.value = true
  emit('edit', props.comment.id, content)
  isSubmitting.value = false
  isEditing.value = false
}

const forwardReply = (parentId: string, content: string) => emit('reply', parentId, content)
const forwardEdit = (id: string, content: string) => emit('edit', id, content)
const forwardDelete = (id: string) => emit('delete', id)
const forwardLike = (id: string) => emit('like', id)
</script>

<template>
  <div :class="['flex gap-4 relative', currentDepth > 0 ? 'mt-4' : 'mt-8']">
    <!-- Connecting line for nested replies -->
    <div v-if="currentDepth > 0" class="absolute -left-[27px] top-10 bottom-[-16px] w-px bg-border/50 hidden sm:block"></div>

    <!-- Avatar -->
    <div class="flex-shrink-0">
      <div class="h-10 w-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold">
        <img v-if="comment.user?.avatar" :src="comment.user.avatar as string" :alt="comment.user?.name || ''" class="h-full w-full object-cover" />
        <span v-else>{{ comment.user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-medium text-sm">{{ comment.user?.name || 'Unknown' }}</span>
        <span class="text-xs text-muted-foreground">{{ formatTimeAgo(comment.createdAt) }}</span>
      </div>

      <div v-if="!isEditing" class="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
        {{ comment.content }}
      </div>

      <div v-else class="mt-2">
        <CommentForm
          :initial-value="comment.content"
          submit-label="Save changes"
          :is-submitting="isSubmitting"
          @submit="handleEdit"
          @cancel="isEditing = false"
        />
      </div>

      <!-- Action row -->
      <div v-if="!isEditing" class="flex items-center gap-4 text-xs font-medium pt-2">
        <button
          class="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors"
          @click="emit('like', comment.id)"
        >
          <Heart class="h-3.5 w-3.5" />
          <span>Like</span>
        </button>

        <button
          class="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          @click="isReplying = !isReplying"
        >
          <Reply class="h-3.5 w-3.5" />
          <span>Reply</span>
        </button>

        <button
          v-if="isAuthor"
          class="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          @click="isEditing = true"
        >
          <Edit2 class="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>

        <button
          v-if="isAuthor"
          class="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors"
          @click="emit('delete', comment.id)"
        >
          <Trash2 class="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>

      <!-- Reply form -->
      <div v-if="isReplying" class="mt-4 border-l-2 border-primary/20 pl-4 py-2">
        <CommentForm
          placeholder="Write a reply..."
          submit-label="Reply"
          :is-submitting="isSubmitting"
          @submit="handleReply"
          @cancel="isReplying = false"
        />
      </div>

      <!-- Recursive Replies -->
      <div v-if="replies && replies.length > 0" class="mt-4 space-y-2 pl-4 border-l border-border/40">
        <CommentCard
          v-for="reply in replies"
          :key="reply.id"
          :comment="reply"
          :replies="reply.replies"
          :depth="currentDepth + 1"
          @reply="forwardReply"
          @edit="forwardEdit"
          @delete="forwardDelete"
          @like="forwardLike"
        />
      </div>
    </div>
  </div>
</template>
