import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authApi } from '@/api/auth'
import { userApi } from '@/api/users'

export const useAuthStore = defineStore('auth', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const savedUser = localStorage.getItem('auth_user')
  const user = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!localStorage.getItem('auth_token'))

  // ── Actions ───────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const payload = await authApi.login(email, password)
      user.value = payload.user
      localStorage.setItem('auth_user', JSON.stringify(payload.user))
      localStorage.setItem('auth_token', payload.token)
    } catch (err: any) {
      error.value = err?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (data: {
    username: string
    email: string
    password: string
    name?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      await authApi.register(data)
      // Auto-login after successful registration
      await login(data.email, data.password)
    } catch (err: any) {
      error.value = err?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (user.value) {
        await authApi.logout().catch(() => {}) // Ignore logout endpoint errors
      }
    } finally {
      user.value = null
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    }
  }

  const updateProfile = async (updates: { name?: string; bio?: string; email?: string }) => {
    loading.value = true
    error.value = null
    try {
      const payload = await userApi.updateProfile(updates)
      user.value = payload.user
      localStorage.setItem('auth_user', JSON.stringify(payload.user))
    } catch (err: any) {
      error.value = err?.message || 'Update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const uploadAvatar = async (file: File) => {
    loading.value = true
    error.value = null
    try {
      const payload = await userApi.uploadAvatar(file)
      user.value = payload.user
      localStorage.setItem('auth_user', JSON.stringify(payload.user))
    } catch (err: any) {
      error.value = err?.message || 'Avatar upload failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Called on app boot. Verifies the stored token is still valid and
   * refreshes the user object from the server.
   * Silently logs out if the token is missing or expired.
   */
  const fetchCurrentUser = async () => {
    if (!localStorage.getItem('auth_token')) return
    loading.value = true
    try {
      const payload = await authApi.getMe()
      user.value = payload.user
      localStorage.setItem('auth_user', JSON.stringify(payload.user))
    } catch {
      // Token is invalid / expired — clear everything
      user.value = null
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    loading.value = true
    error.value = null
    try {
      await authApi.updatePassword({ currentPassword, newPassword })
    } catch (err: any) {
      error.value = err?.message || 'Password update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteAccount = async () => {
    loading.value = true
    error.value = null
    try {
      await userApi.deleteAccount()
      user.value = null
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    } catch (err: any) {
      error.value = err?.message || 'Account deletion failed'
      throw err
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
    updateProfile,
    uploadAvatar,
    fetchCurrentUser,
    updatePassword,
    deleteAccount,
  }
})
