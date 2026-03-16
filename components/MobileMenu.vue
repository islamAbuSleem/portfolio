<template>
  <Transition name="menu">
    <div
      v-if="isOpen"
      class="fixed inset-0 top-16 z-40 bg-white dark:bg-dark-900 md:hidden"
    >
      <nav class="px-4 py-6 space-y-4">
        <a
          href="#about"
          class="block px-4 py-2 text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
          @click="closeMenu"
        >
          About
        </a>
        <a
          href="#experience"
          class="block px-4 py-2 text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
          @click="closeMenu"
        >
          Experience
        </a>
        <a
          href="#projects"
          class="block px-4 py-2 text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
          @click="closeMenu"
        >
          Projects
        </a>
        <a
          href="#skills"
          class="block px-4 py-2 text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
          @click="closeMenu"
        >
          Skills
        </a>
        <a
          href="#contact"
          class="block px-4 py-2 text-gray-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
          @click="closeMenu"
        >
          Contact
        </a>
      </nav>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const closeMenu = () => {
  emit('close')
}

// Close menu on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      closeMenu()
    }
  }
  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-enter-to,
.menu-leave-from {
  opacity: 1;
}
</style>
