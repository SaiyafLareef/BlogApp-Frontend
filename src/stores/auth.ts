import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { mockUsers } from '@/utils/mockData'

export const useAuthStore = defineStore('auth', () => {
  // Try to load user from localStorage immediately
  const savedUser = localStorage.getItem('auth_user')
  const user = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // Mock Login
  const login = async (email: string, password?: string) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Look for a mock user matching the email, default to Alice if none found
      const mockUser = Object.values(mockUsers).find(u => u.email === email) || mockUsers.alice
      
      user.value = mockUser
      localStorage.setItem('auth_user', JSON.stringify(mockUser))
    } catch (err: any) {
      error.value = err.message || 'Login failed'
    } finally {
      loading.value = false
    }
  }

  // Mock Register
  const register = async (userData: Partial<User>) => {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || 'New User',
        email: userData.email || '',
        avatarUrl: userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'New')}`,
        bio: userData.bio || ''
      }
      
      user.value = newUser
      localStorage.setItem('auth_user', JSON.stringify(newUser))
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  const updateProfile = async (updates: Partial<User>) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      if (user.value) {
        user.value = { ...user.value, ...updates }
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  }
})
