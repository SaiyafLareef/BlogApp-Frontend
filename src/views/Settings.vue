<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { profileUpdateSchema, passwordUpdateSchema } from '@/validation/profile'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Upload, AlertTriangle } from '@lucide/vue'

const { user, updateProfile } = useAuth()
const authStore = useAuthStore()

// --- PROFILE FORM ---
const profileSchema = toTypedSchema(profileUpdateSchema)

const { handleSubmit: handleProfileSubmit, isSubmitting: isProfileSubmitting } = useForm({
  validationSchema: profileSchema,
  initialValues: {
    name: user.value?.name || '',
    email: user.value?.email || '',
    bio: user.value?.bio || '',
    avatar: user.value?.avatar || ''
  }
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: bio, errorMessage: bioError } = useField<string>('bio')
const { value: avatar, errorMessage: avatarError } = useField<string>('avatar')

const isUploadingAvatar = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const avatarUrl = ref<string | null>(null)

const triggerAvatarUpload = () => {
  fileInput.value?.click()
}

const handleAvatarSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file: File = target.files.item(0)!
  avatarFile.value = file
  // Show local preview immediately
  avatarUrl.value = URL.createObjectURL(file)
  avatar.value = avatarUrl.value

  isUploadingAvatar.value = true
  try {
    await authStore.uploadAvatar(file)
  } catch (err: any) {
    console.error('Avatar upload failed', err)
  } finally {
    isUploadingAvatar.value = false
  }
}

const profileSuccess = ref(false)
const onProfileSubmit = handleProfileSubmit(async (values) => {
  profileSuccess.value = false
  if (!user.value) return
  try {
    await updateProfile({ name: values.name, bio: values.bio })
    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 3000)
  } catch (err: any) {
    console.error('Profile update failed', err)
  }
})

// --- PASSWORD FORM ---
const passwordSchema = toTypedSchema(passwordUpdateSchema)

const { handleSubmit: handlePasswordSubmit, isSubmitting: isPasswordSubmitting, resetForm: resetPasswordForm } = useForm({
  validationSchema: passwordSchema
})

const { value: currentPassword, errorMessage: currentPasswordError } = useField<string>('currentPassword')
const { value: newPassword, errorMessage: newPasswordError } = useField<string>('newPassword')
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField<string>('confirmPassword')

const onPasswordSubmit = handlePasswordSubmit(async (values) => {
  try {
    await authStore.updatePassword(values.currentPassword, values.newPassword)
    alert('Password updated successfully!')
    resetPasswordForm()
  } catch (err: any) {
    alert(err?.response?.data?.error?.message || 'Failed to update password')
  }
})

// --- DELETE ACCOUNT ---
const isDeleting = ref(false)
const deleteAccount = async () => {
  if (confirm('Are you absolutely sure? This action cannot be undone.')) {
    isDeleting.value = true
    try {
      await authStore.deleteAccount()
      alert('Account deleted. You will be redirected to the home page.')
      window.location.href = '/' 
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || 'Failed to delete account')
      isDeleting.value = false
    }
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-3xl">
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
      <p class="text-muted-foreground">Manage your profile information and security preferences.</p>
    </div>
    
    <div class="space-y-8">
      
      <!-- PROFILE SETTINGS -->
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your public profile information.</CardDescription>
        </CardHeader>
        <form @submit.prevent="onProfileSubmit">
          <CardContent class="space-y-6">
            
            <!-- Avatar Section -->
            <div class="flex items-center gap-6">
              <Avatar class="h-24 w-24 border bg-background">
                <AvatarImage :src="avatar || user?.avatar || ''" />
                <AvatarFallback class="text-3xl">{{ name ? name.charAt(0).toUpperCase() : user?.name?.charAt(0).toUpperCase() }}</AvatarFallback>
              </Avatar>
              <div class="space-y-2">
                <Button type="button" variant="outline" size="sm" @click="triggerAvatarUpload" :disabled="isUploadingAvatar">
                  <Loader2 v-if="isUploadingAvatar" class="h-4 w-4 mr-2 animate-spin" />
                  <Upload v-else class="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
                <p class="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleAvatarSelect" />
                <p v-if="avatarError" class="text-xs text-destructive">{{ avatarError }}</p>
              </div>
            </div>
            
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <Label for="name">Display Name</Label>
                <Input id="name" v-model="name" />
                <p v-if="nameError" class="text-xs text-destructive">{{ nameError }}</p>
              </div>
              <div class="space-y-2">
                <Label for="email">Email Address</Label>
                <Input id="email" type="email" v-model="email" />
                <p v-if="emailError" class="text-xs text-destructive">{{ emailError }}</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="bio">Bio</Label>
              <textarea
                id="bio"
                v-model="bio"
                placeholder="Tell us a little bit about yourself..."
                class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              ></textarea>
              <p v-if="bioError" class="text-xs text-destructive">{{ bioError }}</p>
            </div>
            
          </CardContent>
          <CardFooter class="border-t border-border/50 px-6 py-4 flex items-center gap-4">
            <Button type="submit" :disabled="isProfileSubmitting">
              <Loader2 v-if="isProfileSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              Save Changes
            </Button>
            <span v-if="profileSuccess" class="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Profile updated successfully
            </span>
          </CardFooter>
        </form>
      </Card>

      <!-- SECURITY SETTINGS -->
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <form @submit.prevent="onPasswordSubmit">
          <CardContent class="space-y-4">
            <div class="space-y-2 max-w-md">
              <Label for="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" v-model="currentPassword" />
              <p v-if="currentPasswordError" class="text-xs text-destructive">{{ currentPasswordError }}</p>
            </div>
            <div class="space-y-2 max-w-md">
              <Label for="newPassword">New Password</Label>
              <Input id="newPassword" type="password" v-model="newPassword" />
              <p v-if="newPasswordError" class="text-xs text-destructive">{{ newPasswordError }}</p>
            </div>
            <div class="space-y-2 max-w-md">
              <Label for="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" v-model="confirmPassword" />
              <p v-if="confirmPasswordError" class="text-xs text-destructive">{{ confirmPasswordError }}</p>
            </div>
          </CardContent>
          <CardFooter class="border-t border-border/50 px-6 py-4">
            <Button type="submit" :disabled="isPasswordSubmitting">
              <Loader2 v-if="isPasswordSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <!-- DANGER ZONE -->
      <Card class="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle class="text-destructive flex items-center gap-2">
            <AlertTriangle class="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Permanently remove your personal account and all of its contents from the platform. This action is not reversible.</CardDescription>
        </CardHeader>
        <CardFooter class="px-6 pb-6 pt-0">
          <Button variant="destructive" @click="deleteAccount" :disabled="isDeleting">
            <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
            Delete Account
          </Button>
        </CardFooter>
      </Card>
      
    </div>
  </div>
</template>
