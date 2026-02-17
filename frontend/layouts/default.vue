<template>
  <div class="min-h-screen bg-white dark:bg-dark-900">
    <SpeedInsights />
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 glass-effect border-b border-gray-200 dark:border-dark-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2 group">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span class="text-white font-bold text-lg">&lt;/&gt;</span>
            </div>
            <span class="text-xl font-bold gradient-text hidden sm:inline">Portfolio</span>
          </NuxtLink>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#about" class="text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">About</a>
            <a href="#experience" class="text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">Experience</a>
            <a href="#projects" class="text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">Projects</a>
            <a href="#skills" class="text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">Skills</a>
            <a href="#contact" class="text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">Contact</a>
            <ThemeToggle />
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-gray-900 dark:text-dark-100"
              :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            >
              <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <MobileMenu :isOpen="mobileMenuOpen" @close="mobileMenuOpen = false" />

    <!-- Main Content -->
    <main class="pt-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50 backdrop-blur dark:backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold gradient-text mb-4">Portfolio</h3>
            <p class="text-gray-600 dark:text-dark-400 text-sm">Crafting exceptional digital experiences with modern technologies.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-dark-100 mb-4">Navigation</h4>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-dark-400">
              <li><a href="#about" class="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">About</a></li>
              <li><a href="#projects" class="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Projects</a></li>
              <li><a href="#skills" class="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Skills</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-dark-100 mb-4">Social</h4>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-dark-400">
              <li><a href="#" class="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">GitHub</a></li>
              <li><a href="#" class="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">LinkedIn</a></li>
              <li><a href="#" class="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-dark-100 mb-4">Contact</h4>
            <p class="text-sm text-gray-600 dark:text-dark-400">hello@example.com</p>
          </div>
        </div>
        <div class="border-t border-gray-200 dark:border-dark-700 pt-8">
          <p class="text-center text-gray-500 dark:text-dark-500 text-sm">&copy; 2024 All rights reserved. Built with Nuxt 3 & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue'

const mobileMenuOpen = ref(false)
</script>
