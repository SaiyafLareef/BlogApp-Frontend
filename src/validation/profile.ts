import * as z from 'zod'

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email address'),
  bio: z.string().max(200, 'Bio is too long').optional(),
  avatar: z.string().url('Must be a valid URL').optional().or(z.literal(''))
})

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(6, 'Password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>
