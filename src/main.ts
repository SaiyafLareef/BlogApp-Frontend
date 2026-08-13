import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Rehydrate authenticated user from stored token on app boot.
// This runs before mounting so the nav/guards have accurate auth state.
const authStore = useAuthStore()
authStore.fetchCurrentUser().finally(() => {
  app.mount('#app')
})
