<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Mail } from '@lucide/vue'
</script>

<template>
  <div class="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
    <!-- Hero Section -->
    <section class="text-center mb-20 space-y-6">
      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">
        Empowering Developers Through <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Knowledge</span>
      </h1>
      <p class="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        We are a community-driven platform dedicated to sharing high-quality technical articles, tutorials, and insights for modern web development.
      </p>
    </section>

    <!-- Mission & Vision -->
    <section class="grid md:grid-cols-2 gap-10 mb-24">
      <Card class="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-muted/30">
        <CardContent class="p-8 space-y-4">
          <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h2 class="text-2xl font-bold">Our Mission</h2>
          <p class="text-muted-foreground leading-relaxed">
            To provide a space where developers of all skill levels can learn, share, and grow together. We believe that knowledge should be accessible, and the best way to learn is by sharing what you know.
          </p>
        </CardContent>
      </Card>

      <Card class="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-muted/30">
        <CardContent class="p-8 space-y-4">
          <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h2 class="text-2xl font-bold">Our Vision</h2>
          <p class="text-muted-foreground leading-relaxed">
            To become the go-to resource for modern frontend development, pushing the boundaries of what's possible on the web while fostering a supportive and inclusive community.
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- Contact / CTA -->
    <section class="bg-card border border-border/50 rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto shadow-sm">
      <h2 class="text-3xl font-bold mb-4">Want to Contribute?</h2>
      <p class="text-muted-foreground mb-8 max-w-2xl mx-auto">
        We are always looking for passionate writers and developers to join our community. Share your expertise and help others learn.
      </p>
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button size="lg" class="w-full sm:w-auto">
          Start Writing Today
        </Button>
        <Button variant="outline" size="lg" class="w-full sm:w-auto group">
          Contact Us
          <ArrowRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div class="flex justify-center items-center gap-6 mt-12 pt-8 border-t border-border/50">
        <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
          <Github class="h-6 w-6" />
          <span class="sr-only">GitHub</span>
        </a>
        <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
          <Twitter class="h-6 w-6" />
          <span class="sr-only">Twitter</span>
        </a>
        <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
          <Linkedin class="h-6 w-6" />
          <span class="sr-only">LinkedIn</span>
        </a>
        <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
          <Mail class="h-6 w-6" />
          <span class="sr-only">Email</span>
        </a>
      </div>
    </section>
  </div>
</template>
