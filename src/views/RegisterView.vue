<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, AlertCircle } from '@lucide/vue'

const router = useRouter()

const formSchema = toTypedSchema(z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}))

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const errorMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = ''
  
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Simulate successful registration
  router.push('/login')
})
</script>

<template>
  <Card class="w-full border-border/50 shadow-lg">
    <CardHeader class="space-y-1">
      <CardTitle class="text-2xl text-center">Create an account</CardTitle>
      <CardDescription class="text-center">
        Enter your details below to create your account
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <Alert v-if="errorMessage" variant="destructive" class="mb-6">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <form @submit="onSubmit" class="space-y-4">
        
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input type="text" placeholder="johndoe" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="m@example.com" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full mt-6" :disabled="isSubmitting">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          {{ isSubmitting ? 'Creating account...' : 'Create account' }}
        </Button>
      </form>
    </CardContent>
    
    <CardFooter class="flex justify-center border-t p-6">
      <p class="text-sm text-muted-foreground">
        Already have an account? 
        <RouterLink to="/login" class="text-primary font-medium hover:underline">Sign in</RouterLink>
      </p>
    </CardFooter>
  </Card>
</template>
