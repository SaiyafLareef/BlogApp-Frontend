<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { loginSchema } from '@/validation/auth'
import { useAuth } from '@/composables/useAuth'
import { useRouter, useRoute } from 'vue-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const { login, loading, error } = useAuth()

const schema = toTypedSchema(loginSchema)
const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  await login(values.email, values.password)
  if (!error.value) {
    const redirectPath = route.query.redirect as string || '/'
    router.push(redirectPath)
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/40 p-4">
    <Card class="w-full max-w-md shadow-lg border-primary/10">
      <CardHeader class="space-y-1 text-center">
        <CardTitle class="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription>Enter your email and password to log in to your account</CardDescription>
      </CardHeader>
      <form @submit.prevent="onSubmit">
        <CardContent class="space-y-4 pt-4">
          <div v-if="error" class="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
            {{ error }}
          </div>
          
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" v-model="email" />
            <p v-if="emailError" class="text-xs text-destructive">{{ emailError }}</p>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
              <a href="#" class="text-sm font-medium text-primary hover:underline">Forgot password?</a>
            </div>
            <Input id="password" type="password" v-model="password" />
            <p v-if="passwordError" class="text-xs text-destructive">{{ passwordError }}</p>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col space-y-4 pt-4">
          <Button type="submit" class="w-full" :disabled="loading || isSubmitting">
            <Loader2 v-if="loading || isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Log in
          </Button>
          <div class="text-center text-sm text-muted-foreground">
            Don't have an account? 
            <RouterLink to="/register" class="font-medium text-primary hover:underline">Sign up</RouterLink>
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
