<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Link as LinkIcon } from '@lucide/vue'

const props = defineProps<{
  url?: string
  title?: string
}>()

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.url || window.location.href)
  // In a real app, you might want to show a toast notification here
}
</script>

<template>
  <div class="flex items-center gap-2 mt-8 pt-8 border-t border-border/40">
    <span class="text-sm font-semibold text-muted-foreground mr-2">Share:</span>
    <Button variant="outline" size="icon" class="h-8 w-8 rounded-full hover:text-blue-400 hover:border-blue-400 transition-colors">
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.007 4.15H5.038z" /></svg>
      <span class="sr-only">Share on Twitter</span>
    </Button>
    <Button variant="outline" size="icon" class="h-8 w-8 rounded-full hover:text-blue-700 hover:border-blue-700 transition-colors">
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
      <span class="sr-only">Share on LinkedIn</span>
    </Button>
    <Button variant="outline" size="icon" class="h-8 w-8 rounded-full hover:text-blue-600 hover:border-blue-600 transition-colors">
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>
      <span class="sr-only">Share on Facebook</span>
    </Button>
    <Button variant="outline" size="icon" class="h-8 w-8 rounded-full" @click="copyToClipboard">
      <LinkIcon class="h-4 w-4" />
      <span class="sr-only">Copy link</span>
    </Button>
  </div>
</template>
