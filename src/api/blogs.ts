import { MOCK_POSTS } from '@/utils/mockData'
import type { Post } from '@/types'

const DELAY = 500
let posts = [...MOCK_POSTS]

export const blogsApi = {
  getPosts: async (): Promise<Post[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...posts]), DELAY)
    })
  },
  
  getPostsByUser: async (userId: string): Promise<Post[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(posts.filter(p => p.author.id === userId)), DELAY)
    })
  },

  getPostById: async (id: string): Promise<Post | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(posts.find(p => p.id === id)), DELAY)
    })
  },

  createPost: async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'bookmarks'>): Promise<Post> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost: Post = {
          ...postData,
          id: `post-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          likes: 0,
          bookmarks: 0
        } as Post
        posts.unshift(newPost)
        resolve(newPost)
      }, DELAY)
    })
  },

  updatePost: async (id: string, updates: Partial<Post>): Promise<Post> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = posts.findIndex(p => p.id === id)
        if (index !== -1) {
          posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() }
          resolve(posts[index])
        } else {
          reject(new Error('Post not found'))
        }
      }, DELAY)
    })
  },

  deletePost: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        posts = posts.filter(p => p.id !== id)
        resolve()
      }, DELAY)
    })
  }
}
