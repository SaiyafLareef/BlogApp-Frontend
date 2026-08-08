<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useBlog } from '@/composables/useBlog'
import { blogsApi } from '@/api/blogs'
import type { Post } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, Heart, Bookmark } from '@lucide/vue'
import BlogGrid from '@/components/blog/BlogGrid.vue'

const { user } = useAuth()
const { posts: allPosts, fetchAllPosts } = useBlog()
const activeTab = ref<'recent' | 'liked' | 'saved'>('recent')

const recentPosts = ref<Post[]>([])
const likedPosts = ref<Post[]>([])
const savedPosts = ref<Post[]>([])

const isLoading = ref(true)

// Mock joined date since it's not on the User type
const joinedDate = 'October 2023'

onMounted(async () => {
  isLoading.value = true
  try {
    if (!user.value) return
    
    if (allPosts.value.length === 0) {
      await fetchAllPosts()
    }
    
    // Fetch authored posts
    recentPosts.value = await blogsApi.getPostsByUser(user.value.id)
    
    // Simulate liked and saved posts
    const otherPosts = allPosts.value.filter(p => p.author.id !== user.value!.id)
    likedPosts.value = otherPosts.slice(0, 2)
    savedPosts.value = otherPosts.slice(1, 3)
    
  } catch (error) {
    console.error('Failed to load profile data')
  } finally {
    isLoading.value = false
  }
})

const currentPosts = computed(() => {
  switch (activeTab.value) {
    case 'recent': return recentPosts.value
    case 'liked': return likedPosts.value
    case 'saved': return savedPosts.value
    default: return []
  }
})

// Mock Statistics
const totalLikesReceived = computed(() => {
  return recentPosts.value.reduce((total, post) => total + (post.likes || 0), 0)
})
</script>

<template>
  <div class="min-h-screen bg-background pb-12">
    <!-- Cover & Profile Header -->
    <div class="relative bg-muted h-48 md:h-64 border-b border-border">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 opacity-50"></div>
    </div>
    
    <div class="container mx-auto px-4 relative max-w-5xl">
      <div class="flex flex-col md:flex-row gap-6 md:gap-10 -mt-16 md:-mt-24 mb-10">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <Avatar class="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl bg-background">
            <AvatarImage :src="user?.avatarUrl || user?.avatar" :alt="user?.name" />
          <AvatarFallback class="text-4xl">{{ user?.name?.charAt(0).toUpperCase() }}</AvatarFallback>
        </Avatar>
        </div>
        
        <!-- User Info -->
        <div class="pt-16 md:pt-28 flex-1">
          <h1 class="text-3xl font-bold tracking-tight text-foreground">{{ user?.name }}</h1>
          <p class="text-muted-foreground">{{ user?.bio || 'Passionate writer and tech enthusiast sharing thoughts on modern web development.' }}</p>
          
          <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-4">
            <Calendar class="h-4 w-4" />
            Joined {{ joinedDate }}
          </div>
        </div>
      </div>
      
      <!-- Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div class="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center transition-colors hover:border-primary/50">
          <FileText class="h-6 w-6 text-primary mb-2" />
          <span class="text-3xl font-bold">{{ recentPosts.length }}</span>
          <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Posts Published</span>
        </div>
        
        <div class="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center transition-colors hover:border-primary/50">
          <Heart class="h-6 w-6 text-rose-500 mb-2" />
          <span class="text-3xl font-bold">{{ totalLikesReceived }}</span>
          <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Likes Received</span>
        </div>
        
        <div class="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center transition-colors hover:border-primary/50">
          <Heart class="h-6 w-6 text-primary mb-2" />
          <span class="text-3xl font-bold">{{ likedPosts.length }}</span>
          <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Posts Liked</span>
        </div>
        
        <div class="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center transition-colors hover:border-primary/50">
          <Bookmark class="h-6 w-6 text-primary mb-2" />
          <span class="text-3xl font-bold">{{ savedPosts.length }}</span>
          <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Posts Saved</span>
        </div>
      </div>
      
      <!-- Content Tabs -->
      <div class="border-b border-border mb-8">
        <div class="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
          <Button 
            :variant="activeTab === 'recent' ? 'default' : 'ghost'" 
            class="rounded-full px-6 transition-all"
            @click="activeTab = 'recent'"
          >
            Recent Posts
          </Button>
          <Button 
            :variant="activeTab === 'liked' ? 'default' : 'ghost'" 
            class="rounded-full px-6 transition-all"
            @click="activeTab = 'liked'"
          >
            Liked Posts
          </Button>
          <Button 
            :variant="activeTab === 'saved' ? 'default' : 'ghost'" 
            class="rounded-full px-6 transition-all"
            @click="activeTab = 'saved'"
          >
            Saved Posts
          </Button>
        </div>
      </div>
      
      <!-- Post Grid -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
      
      <div v-else-if="currentPosts.length === 0" class="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border/60">
        <h3 class="text-lg font-medium mb-1">No posts found</h3>
        <p class="text-muted-foreground text-sm">There are no posts in this category yet.</p>
      </div>
      
      <BlogGrid v-else :posts="currentPosts" />
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
