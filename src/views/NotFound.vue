<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
    <div class="space-y-6 max-w-md">
      <h1 class="text-9xl font-extrabold tracking-tighter text-primary/10 relative select-none">
        404
        <span class="absolute inset-0 flex items-center justify-center text-3xl font-bold tracking-tight text-foreground drop-shadow-sm">
          Oops!
        </span>
      </h1>
      
      <div class="space-y-2">
        <h2 class="text-2xl font-semibold tracking-tight">Page not found</h2>
        <p class="text-muted-foreground">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button 
          @click="router.back()" 
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full sm:w-auto"
        >
          Go Back
        </button>
        <router-link 
          to="/" 
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
        >
          Return Home
        </router-link>
      </div>
    </div>
  </div>
</template>
