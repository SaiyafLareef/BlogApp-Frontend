 <script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from '@lucide/vue'

defineProps<{
  search: string
  category: string
  sort: string
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:category', value: string): void
  (e: 'update:sort', value: string): void
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 mb-8">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder="Search posts by title or summary..." 
        class="pl-9 bg-background h-10" 
        :value="search"
        @input="(e: any) => emit('update:search', (e.target as HTMLInputElement).value)"
      />
    </div>
    
    <div class="flex flex-wrap sm:flex-nowrap gap-4 w-full md:w-auto">
      <Select :model-value="category" @update:model-value="(v) => emit('update:category', v as string)">
        <SelectTrigger class="w-full sm:w-[160px] bg-background h-10">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Select :model-value="sort" @update:model-value="(v) => emit('update:sort', v as string)">
        <SelectTrigger class="w-full sm:w-[160px] bg-background h-10">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
