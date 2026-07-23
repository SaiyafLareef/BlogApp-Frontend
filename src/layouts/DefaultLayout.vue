<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <AppNavbar />
    
    <main class="flex-grow container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
