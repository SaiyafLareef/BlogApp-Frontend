<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BookOpen, Search, LogOut, Settings, User as UserIcon, PenSquare, FileText, Bookmark } from '@lucide/vue'
import MobileMenu from './MobileMenu.vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'explore', query: { search: searchQuery.value } })
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <header class="border-b sticky top-0 bg-background/80 backdrop-blur z-40">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      
      <div class="flex items-center gap-4">
        <!-- Mobile Menu (Only visible on small screens) -->
        <MobileMenu />

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl tracking-tight text-primary transition-colors hover:text-primary/80">
          <BookOpen class="h-6 w-6" />
          <span class="hidden sm:inline-block">TechChronicle</span>
        </RouterLink>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        <RouterLink to="/" class="text-sm font-medium hover:text-primary transition-colors">Home</RouterLink>
        <RouterLink to="/explore" class="text-sm font-medium hover:text-primary transition-colors">Explore Posts</RouterLink>
        <RouterLink to="/categories" class="text-sm font-medium hover:text-primary transition-colors">Categories</RouterLink>
      </nav>
      
      <!-- Right Side Actions -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative hidden sm:block w-48 lg:w-64">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search articles..." 
            class="pl-8 bg-muted/50 rounded-full border-transparent focus-visible:ring-1 focus-visible:border-border h-9" 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
        </div>
        
        <Button variant="ghost" size="icon" class="sm:hidden" @click="handleSearch">
          <Search class="h-5 w-5" />
        </Button>

        <!-- Auth / Avatar -->
        <template v-if="isAuthenticated">
          <Button variant="default" size="sm" class="hidden sm:flex items-center gap-2 mr-2 rounded-full" as-child>
            <RouterLink to="/blog/create">
              <PenSquare class="h-4 w-4" />
              Write Post
            </RouterLink>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-9 w-9 rounded-full">
                <Avatar class="h-9 w-9 border">
                  <AvatarImage :src="(user?.avatar as string) || ''" :alt="user?.name || ''" />
                  <AvatarFallback>{{ user?.name?.charAt(0).toUpperCase() }}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="end">
              <DropdownMenuLabel class="font-normal flex flex-col">
                <span class="text-sm font-medium leading-none">{{ user?.name }}</span>
                <span class="text-xs leading-none text-muted-foreground mt-1">{{ user?.email }}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="cursor-pointer" as-child>
                <RouterLink to="/profile" class="w-full flex items-center">
                  <UserIcon class="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </RouterLink>
              </DropdownMenuItem>
              <DropdownMenuItem class="cursor-pointer" as-child>
                <RouterLink to="/my-blogs" class="w-full flex items-center">
                  <FileText class="mr-2 h-4 w-4" />
                  <span>My Blogs</span>
                </RouterLink>
              </DropdownMenuItem>
              <DropdownMenuItem class="cursor-pointer" as-child>
                <RouterLink to="/my-bookmarks" class="w-full flex items-center">
                  <Bookmark class="mr-2 h-4 w-4" />
                  <span>My Bookmarks</span>
                </RouterLink>
              </DropdownMenuItem>
              <DropdownMenuItem class="cursor-pointer" as-child>
                <RouterLink to="/settings" class="w-full flex items-center">
                  <Settings class="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </RouterLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout" class="text-destructive focus:text-destructive cursor-pointer">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
        <template v-else>
          <div class="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" size="sm" as-child>
              <RouterLink to="/login">Log in</RouterLink>
            </Button>
            <Button size="sm" class="rounded-full" as-child>
              <RouterLink to="/register">Register</RouterLink>
            </Button>
          </div>
        </template>
      </div>

    </div>
  </header>
</template>
