<template>
  <div class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="section-title mb-16 text-center">Experience</h2>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p class="text-gray-600 dark:text-dark-400 mt-4">Loading experience...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10">
        <p class="text-gray-600 dark:text-dark-400">{{ error }}</p>
        <button @click="fetchExperiences" class="mt-4 text-primary-400 hover:text-primary-300">
          Try Again
        </button>
      </div>

      <!-- Timeline -->
      <div v-else-if="experiences.length > 0" class="relative">
        <!-- Vertical Line -->
        <div class="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500/20 to-primary-400/20 dark:from-primary-500/30 dark:to-primary-400/30 md:transform md:-translate-x-1/2"></div>

        <!-- Timeline Items -->
        <div class="space-y-12">
          <div 
            v-for="(item, index) in experiences" 
            :key="item.id" 
            :class="['relative', index % 2 === 0 ? 'md:pr-1/2' : 'md:ml-1/2']"
          >
            <!-- Dot -->
            <div class="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-dark-900 md:left-1/2 md:transform md:-translate-x-1/2 z-10"></div>

            <!-- Content -->
            <div :class="['ml-8 md:ml-0', index % 2 === 0 ? 'md:mr-1/2 md:pr-12 md:text-right' : 'md:ml-1/2 md:pl-12']">
              <div class="card">
                <div class="flex items-start justify-between mb-2" :class="index % 2 === 0 ? 'md:flex-row-reverse' : ''">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-dark-100">{{ item.role }}</h3>
                  <span class="text-sm text-primary-400 whitespace-nowrap ml-4 md:ml-0 md:mr-4">{{ item.period }}</span>
                </div>
                <p class="text-primary-500 font-semibold mb-3">{{ item.company }}</p>
                <p class="text-gray-600 dark:text-dark-400 mb-4 text-sm leading-relaxed">{{ item.description }}</p>
                
                <!-- Technologies -->
                <div class="flex flex-wrap gap-2" :class="index % 2 === 0 ? 'md:justify-end' : ''">
                  <span 
                    v-for="tech in item.technologies" 
                    :key="tech" 
                    class="text-xs px-2 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-10">
        <p class="text-gray-600 dark:text-dark-400">No experience entries to display yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Experience } from '~/types/api'

const config = useRuntimeConfig()

// State
const experiences = ref<Experience[]>([])
const loading = ref(true)
const error = ref('')

// Fetch experiences from API
const fetchExperiences = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: fetchError } = await useFetch<{
      status: string
      data: { experiences: Experience[] }
    }>(`${config.public.apiBase}/api/experiences?limit=20`)

    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Failed to fetch experiences')
    }

    if (data.value?.data?.experiences) {
      // Sort by order field
      experiences.value = data.value.data.experiences.sort((a, b) => a.order - b.order)
    }
  } catch (e: any) {
    console.error('Failed to fetch experiences:', e)
    error.value = 'Failed to load experience data. Please try again.'
  } finally {
    loading.value = false
  }
}

// Fetch data on mount
onMounted(() => {
  fetchExperiences()
})
</script>