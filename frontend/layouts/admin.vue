<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const route = useRoute();
const mobileMenuOpen = ref(false);

const links = [
  { name: 'Dashboard', path: '/admin-panel', icon: 'dashboard' },
  { name: 'Projects', path: '/admin-panel/projects', icon: 'folder' },
  { name: 'Experience', path: '/admin-panel/experiences', icon: 'briefcase' },
  { name: 'Skills', path: '/admin-panel/skills', icon: 'code' },
  { name: 'Profile', path: '/admin-panel/profile', icon: 'user' },
  { name: 'Messages', path: '/admin-panel/messages', icon: 'mail' },
];

const isActive = (path: string) => route.path === path;

// Close mobile menu when route changes
watch(() => route.path, () => {
  mobileMenuOpen.value = false;
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex">
    <!-- Desktop Sidebar -->
    <aside class="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden md:flex md:flex-col">
      <div class="p-6">
        <h1 class="text-xl font-bold text-white">Admin Panel</h1>
        <p class="text-xs text-gray-500 mt-1">Portfolio CMS</p>
      </div>
      <nav class="flex-1 px-4 space-y-1">
        <NuxtLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="flex items-center px-4 py-3 rounded-md transition-colors"
          :class="isActive(link.path) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
        >
          <span class="mr-3">
            <!-- Dashboard Icon -->
            <svg v-if="link.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <!-- Folder Icon -->
            <svg v-else-if="link.icon === 'folder'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <!-- Briefcase Icon -->
            <svg v-else-if="link.icon === 'briefcase'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <!-- Code Icon -->
            <svg v-else-if="link.icon === 'code'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <!-- Mail Icon -->
            <svg v-else-if="link.icon === 'mail'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <!-- User Icon -->
            <svg v-else-if="link.icon === 'user'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          {{ link.name }}
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-gray-700">
        <button
          @click="authStore.logout"
          class="flex items-center w-full px-4 py-2 rounded-md text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700">
      <div class="flex items-center justify-between p-4">
        <h1 class="text-lg font-bold">Admin Panel</h1>
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 text-gray-400 hover:text-white"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="bg-gray-800 border-t border-gray-700">
        <nav class="px-4 py-2 space-y-1">
          <NuxtLink
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            class="block px-4 py-3 rounded-md transition-colors"
            :class="isActive(link.path) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
          >
            {{ link.name }}
          </NuxtLink>
          <button
            @click="authStore.logout"
            class="w-full text-left px-4 py-3 rounded-md text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto md:ml-0 mt-16 md:mt-0">
      <div class="p-8">
        <slot />
      </div>
    </main>

    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>
