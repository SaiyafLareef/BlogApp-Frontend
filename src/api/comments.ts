import { MOCK_COMMENTS } from '@/utils/mockData'
import type { Comment } from '@/types'

const DELAY = 400
let comments = [...MOCK_COMMENTS]

export const commentsApi = {
  getCommentsForPost: async (postId: string): Promise<Comment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(comments.filter(c => c.postId === postId)), DELAY)
    })
  },

  addComment: async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likes'>): Promise<Comment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComment: Comment = {
          ...commentData,
          id: `comment-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: 0
        }
        comments.push(newComment)
        resolve(newComment)
      }, DELAY)
    })
  },

  deleteComment: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const idsToDelete = new Set<string>([id])
        let addedNew = true
        while (addedNew) {
          addedNew = false
          comments.forEach(c => {
            if (c.parentId && idsToDelete.has(c.parentId) && !idsToDelete.has(c.id)) {
              idsToDelete.add(c.id)
              addedNew = true
            }
          })
        }
        comments = comments.filter(c => !idsToDelete.has(c.id))
        resolve()
      }, DELAY)
    })
  },

  updateComment: async (id: string, content: string): Promise<Comment> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = comments.findIndex(c => c.id === id)
        if (index !== -1) {
          comments[index].content = content
          comments[index].updatedAt = new Date().toISOString()
          resolve(comments[index])
        } else {
          reject(new Error('Comment not found'))
        }
      }, DELAY)
    })
  },

  likeComment: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = comments.findIndex(c => c.id === id)
        if (index !== -1) {
          comments[index].likes = (comments[index].likes || 0) + 1
        }
        resolve()
      }, 200)
    })
  }
}
