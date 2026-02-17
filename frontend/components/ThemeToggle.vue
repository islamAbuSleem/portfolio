<template>
  <button 
    @click="toggleTheme"
    class="p-2 rounded-lg transition-colors"
    :class="isDark 
      ? 'bg-dark-700 hover:bg-dark-600 text-yellow-400' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.121-2.121a4 4 0 00 5.657 0l2.121 2.121a6 6 0 11-5.657-5.657l2.121 2.121A4 4 0 0010 10a4 4 0 00-2.828 1.172z" clip-rule="evenodd" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

