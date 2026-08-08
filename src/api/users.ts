import type { User } from '@/types'

const DELAY = 600

export const usersApi = {
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(updates as User), DELAY)
    })
  },

  changeAvatar: async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(URL.createObjectURL(file)), DELAY + 400)
    })
  },

  updatePassword: async (currentPass: string, newPass: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), DELAY)
    })
  },

  deleteAccount: async (userId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), DELAY)
    })
  },

  toggleLike: async (postId: string): Promise<boolean> => {
    // Returns true if liked, false if unliked
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300)
    })
  },

  toggleBookmark: async (postId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 300)
    })
  }
}
