import { mockUsers } from '@/utils/mockData'
import type { User } from '@/types'

const DELAY = 800

export const authApi = {
  login: async (email: string, password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = Object.values(mockUsers).find(u => u.email === email)
        if (user) resolve(user)
        else resolve(mockUsers.alice) // Default fallback for mock
      }, DELAY)
    })
  },

  register: async (userData: Partial<User>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: userData.name || 'New User',
          email: userData.email || '',
          avatarUrl: userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'New')}`,
          bio: userData.bio || ''
        }
        resolve(newUser)
      }, DELAY)
    })
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300)
    })
  }
}
