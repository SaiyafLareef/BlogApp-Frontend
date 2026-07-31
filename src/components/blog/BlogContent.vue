<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

// Normally, if content is markdown, you would parse it here (e.g. using marked).
// For this mock, we assume content might be plain text or pre-parsed HTML.
// We wrap it in standard typographic classes to ensure it renders beautifully.
</script>

<template>
  <div class="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80">
    <p v-if="!content.includes('<')">{{ content }}</p>
    <div v-else v-html="content"></div>
  </div>
</template>

<style>
/* Base typography styles matching standard prose if not using @tailwindcss/typography */
.prose h1, .prose h2, .prose h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
  line-height: 1.2;
}
.prose p {
  margin-top: 1em;
  margin-bottom: 1em;
  line-height: 1.75;
}
.prose strong {
  font-weight: 600;
}
</style>
