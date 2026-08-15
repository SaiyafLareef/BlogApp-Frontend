<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { BookOpen } from '@lucide/vue'
</script>

<template>
  <div class="min-h-screen bg-muted/40 flex flex-col justify-center items-center p-4">
    <div class="w-full max-w-md mb-8 flex justify-center">
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary transition-colors hover:text-primary/80">
        <BookOpen class="h-8 w-8" />
        TechChronicle
      </RouterLink>
    </div>
    
    <!-- Auth Content -->
    <div class="flex-grow flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <RouterView />
      </div>
    </div>
    
    <!-- Footer -->
    <div class="p-6 text-center text-sm text-muted-foreground">
      <p>&copy; {{ new Date().getFullYear() }} TechChronicle. All rights reserved.</p>
    </div>
  </div>
</template>
