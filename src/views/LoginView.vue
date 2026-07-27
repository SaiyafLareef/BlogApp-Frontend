<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, AlertCircle } from '@lucide/vue'

const router = useRouter()

const formSchema = toTypedSchema(z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().default(false).optional(),
}))

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const errorMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = ''
  
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  if (values.email === 'test@example.com' && values.password === 'password') {
    router.push('/')
  } else {
    errorMessage.value = 'Invalid email or password. Try test@example.com / password.'
  }
})
</script>

<template>
  <Card class="w-full border-border/50 shadow-lg">
    <CardHeader class="space-y-1">
      <CardTitle class="text-2xl text-center">Welcome back</CardTitle>
      <CardDescription class="text-center">
        Enter your email and password to login to your account
      </CardDescription>
    </CardHeader>
    
    <CardContent>
      <Alert v-if="errorMessage" variant="destructive" class="mb-6">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ errorMessage }}</AlertDescription>
      </Alert>

      <form @submit="onSubmit" class="space-y-4">
        
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
            <div class="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <a href="#" class="text-sm font-medium text-primary hover:underline">Forgot password?</a>
            </div>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ value, handleChange }" name="remember">
          <FormItem class="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
            <FormControl>
              <Checkbox :checked="value" @update:checked="handleChange" />
            </FormControl>
            <div class="space-y-1 leading-none">
              <FormLabel class="font-normal text-muted-foreground">
                Remember me for 30 days
              </FormLabel>
            </div>
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full" :disabled="isSubmitting">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
        </Button>
      </form>
    </CardContent>
    
    <CardFooter class="flex justify-center border-t p-6">
      <p class="text-sm text-muted-foreground">
        Don't have an account? 
        <RouterLink to="/register" class="text-primary font-medium hover:underline">Sign up</RouterLink>
      </p>
    </CardFooter>
  </Card>
</template>
