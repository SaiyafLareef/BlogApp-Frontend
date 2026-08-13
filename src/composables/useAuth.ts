import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()
  const { user, isAuthenticated, loading, error } = storeToRefs(store)
  
  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    updateProfile: store.updateProfile,
    uploadAvatar: store.uploadAvatar,
  }
}
