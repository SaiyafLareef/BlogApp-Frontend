import * as z from 'zod'

export const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title is too long'),
  slug: z.string().min(5, 'Slug must be at least 5 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(300, 'Summary is too long'),
  content: z.string().min(20, 'Blog content must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  tags: z.string().min(1, 'At least one tag is required'), // Comma separated list in form
  coverImage: z.string().url('Must be a valid image URL (or upload a local file)').min(1, 'Cover image is required')
})

export type BlogInput = z.infer<typeof blogSchema>
