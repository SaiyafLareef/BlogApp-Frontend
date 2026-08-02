<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layers, Code2, Paintbrush, MonitorSmartphone, Beaker, FileType2 } from '@lucide/vue'

const router = useRouter()

const categories = [
  { name: 'Vue.js', icon: Layers, description: 'Articles and tutorials about Vue.js framework and ecosystem.', count: 12 },
  { name: 'CSS', icon: Paintbrush, description: 'Modern CSS techniques, Tailwind, and styling best practices.', count: 8 },
  { name: 'TypeScript', icon: FileType2, description: 'Deep dives into TypeScript features and types.', count: 15 },
  { name: 'UI/UX', icon: MonitorSmartphone, description: 'User interface design principles and user experience.', count: 6 },
  { name: 'Design', icon: Code2, description: 'General design patterns and architectural concepts.', count: 9 },
  { name: 'Testing', icon: Beaker, description: 'Unit, integration, and end-to-end testing strategies.', count: 4 },
]

const navigateToCategory = (categoryName: string) => {
  // In a real app with proper query params: router.push({ path: '/explore', query: { category: categoryName } })
  // Since the current BlogsView uses an internal state for filtering, we could pass state or query
  // For now, we'll route to explore (which is the main blogs view).
  // Note: To fully connect this, BlogsView would need to read from route.query.category.
  router.push({ path: '/explore', query: { category: categoryName } })
}
</script>

<template>
  <div class="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
    <div class="text-center mb-16 space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight">Browse Categories</h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Find exactly what you're looking for by exploring our curated topic categories.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        v-for="cat in categories" 
        :key="cat.name"
        class="group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300"
        @click="navigateToCategory(cat.name)"
      >
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between mb-2">
            <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <component :is="cat.icon" class="h-5 w-5" />
            </div>
            <span class="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {{ cat.count }} posts
            </span>
          </div>
          <CardTitle class="text-xl group-hover:text-primary transition-colors">{{ cat.name }}</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground text-sm line-clamp-2">
            {{ cat.description }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
