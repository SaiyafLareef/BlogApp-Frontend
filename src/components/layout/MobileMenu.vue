<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, X, Home, BookOpen, PenSquare, User as UserIcon, Settings, LogOut, FileText } from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const isOpen = ref(false)
const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  await logout()
  isOpen.value = false
  router.push('/login')
}
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon" class="md:hidden">
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle menu</span>
      </Button>
    </SheetTrigger>
    
    <SheetContent side="left" class="flex flex-col">
      <SheetHeader>
        <SheetTitle class="flex items-center gap-2">
          <BookOpen class="h-5 w-5 text-primary" />
          Modern Blog
        </SheetTitle>
      </SheetHeader>
      
      <div class="flex flex-col gap-4 mt-8">
        <RouterLink to="/" class="text-lg font-medium hover:text-primary transition-colors" @click="isOpen = false">
          Home
        </RouterLink>
        <RouterLink to="/explore" class="text-lg font-medium hover:text-primary transition-colors" @click="isOpen = false">
          Explore Posts
        </RouterLink>
        <RouterLink to="/categories" class="text-lg font-medium hover:text-primary transition-colors" @click="isOpen = false">
          Categories
        </RouterLink>
      </div>

      <div class="mt-auto flex flex-col gap-2 pt-6 border-t">
        <template v-if="isAuthenticated">
          <div class="flex items-center gap-3 mb-4 px-2">
            <Avatar class="h-10 w-10 border">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback>{{ user?.name?.charAt(0) }}</AvatarFallback>
            </Avatar>
            <div class="flex flex-col">
              <span class="text-sm font-medium">{{ user?.name }}</span>
              <span class="text-xs text-muted-foreground">{{ user?.email }}</span>
            </div>
          </div>
          
          <Button variant="default" class="w-full justify-start rounded-full" as-child>
            <RouterLink to="/blog/create" @click="isOpen = false">
              <PenSquare class="mr-2 h-4 w-4" />
              Write Post
            </RouterLink>
          </Button>
          
          <div class="flex flex-col gap-1 mt-2">
            <Button variant="ghost" class="w-full justify-start text-muted-foreground" as-child>
              <RouterLink to="/my-blogs" @click="isOpen = false">
                <FileText class="mr-2 h-4 w-4" />
                My Blogs
              </RouterLink>
            </Button>
            <Button variant="ghost" class="w-full justify-start text-muted-foreground" as-child>
              <RouterLink to="/profile" @click="isOpen = false">
                <UserIcon class="mr-2 h-4 w-4" />
                Profile
              </RouterLink>
            </Button>
            <Button variant="ghost" class="w-full justify-start text-muted-foreground" as-child>
              <RouterLink to="/settings" @click="isOpen = false">
                <Settings class="mr-2 h-4 w-4" />
                Settings
              </RouterLink>
            </Button>
            <button @click="handleLogout" class="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 w-full text-left transition-colors">
              <LogOut class="mr-2 h-4 w-4" />
              Log out
            </button>
          </div>
        </template>
        
        <template v-else>
          <Button variant="outline" class="w-full justify-center" as-child>
            <RouterLink to="/login" @click="isOpen = false">Log in</RouterLink>
          </Button>
          <Button class="w-full justify-center" as-child>
            <RouterLink to="/register" @click="isOpen = false">Register</RouterLink>
          </Button>
        </template>
      </div>
    </SheetContent>
  </Sheet>
</template>
