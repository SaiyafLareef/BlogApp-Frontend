<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { registerSchema } from '@/validation/auth'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from '@lucide/vue'

const router = useRouter()
const { register, loading, error } = useAuth()

const schema = toTypedSchema(registerSchema)
const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField<string>('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  await register({ name: values.name, email: values.email })
  if (!error.value) {
    router.push('/')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/40 p-4">
    <Card class="w-full max-w-md shadow-lg border-primary/10">
      <CardHeader class="space-y-1 text-center">
        <CardTitle class="text-3xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription>Enter your information to get started</CardDescription>
      </CardHeader>
      <form @submit.prevent="onSubmit">
        <CardContent class="space-y-4 pt-4">
          <div v-if="error" class="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
            {{ error }}
          </div>
          
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" v-model="name" />
            <p v-if="nameError" class="text-xs text-destructive">{{ nameError }}</p>
          </div>
          
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" v-model="email" />
            <p v-if="emailError" class="text-xs text-destructive">{{ emailError }}</p>
          </div>
          
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="password" />
            <p v-if="passwordError" class="text-xs text-destructive">{{ passwordError }}</p>
          </div>
          
          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" v-model="confirmPassword" />
            <p v-if="confirmPasswordError" class="text-xs text-destructive">{{ confirmPasswordError }}</p>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col space-y-4 pt-4">
          <Button type="submit" class="w-full" :disabled="loading || isSubmitting">
            <Loader2 v-if="loading || isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Create Account
          </Button>
          <div class="text-center text-sm text-muted-foreground">
            Already have an account? 
            <RouterLink to="/login" class="font-medium text-primary hover:underline">Log in</RouterLink>
          </div>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
