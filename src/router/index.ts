import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'explore',
          name: 'explore',
          component: () => import('../views/BlogsView.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('../views/CategoriesView.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: 'blog/:slug',
          name: 'blog-details',
          component: () => import('../views/BlogDetails.vue'),
        },
        {
          path: 'blog/create',
          name: 'create-blog',
          component: () => import('../views/CreateBlog.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'blog/edit/:id',
          name: 'edit-blog',
          component: () => import('../views/EditBlog.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'my-blogs',
          name: 'my-blogs',
          component: () => import('../views/MyBlogs.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'my-bookmarks',
          name: 'my-bookmarks',
          component: () => import('../views/MyBookmarks.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/Profile.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/Settings.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

// Route Guards
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  } else if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
