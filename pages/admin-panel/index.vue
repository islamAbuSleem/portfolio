<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

const { data: stats } = await useApi<any>('/api/portfolio-data'); // Reuse public endpoint for simple stats or fetch explicit admin stats
// Since we don't have a dedicated stats endpoint yet, we can mock it or fetch lists to count
const { data: messages } = await useApi<any[]>('/api/messages');
const { data: projects } = await useApi<any>('/api/projects');

const messageCount = computed(() => messages.value?.data?.messages?.length || 0);
const projectCount = computed(() => projects.value?.data?.projects?.length || 0);
</script>

<template>
  <div>
    <h2 class="text-3xl font-bold mb-8">Dashboard</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-sm">
        <h3 class="text-gray-400 text-sm font-medium uppercase">Total Projects</h3>
        <p class="text-3xl font-bold mt-2 text-white">{{ projectCount }}</p>
      </div>
      
      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-sm">
        <h3 class="text-gray-400 text-sm font-medium uppercase">Messages</h3>
        <p class="text-3xl font-bold mt-2 text-white">{{ messageCount }}</p>
      </div>

      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-sm">
        <h3 class="text-gray-400 text-sm font-medium uppercase">System Status</h3>
        <div class="flex items-center mt-2">
          <span class="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
          <span class="text-white font-bold">Online</span>
        </div>
      </div>
    </div>
  </div>
</template>
