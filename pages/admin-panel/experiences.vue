<script setup lang="ts">
import { ref } from 'vue';

const toast = useToast();

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  order: number;
}

const experiences = ref<Experience[]>([]);
const loading = ref(true);
const showForm = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);

// Form state
const form = ref({
  company: '',
  role: '',
  period: '',
  description: '',
  technologies: '',
});

// Fetch experiences
const fetchExperiences = async () => {
  loading.value = true;
  try {
    const { data } = await useApi<any>('/api/experiences');
    if (data.value) {
      experiences.value = data.value.data.experiences;
    }
  } finally {
    loading.value = false;
  }
};

await fetchExperiences();

// Create / Update
const handleSubmit = async () => {
  saving.value = true;
  const payload = {
    ...form.value,
    technologies: form.value.technologies.split(',').map(s => s.trim()).filter(Boolean),
  };

  try {
    if (editingId.value) {
      await useApi(`/api/experiences/${editingId.value}`, {
        method: 'PATCH',
        body: payload,
      });
      toast.success('Experience updated successfully');
    } else {
      await useApi('/api/experiences', {
        method: 'POST',
        body: payload,
      });
      toast.success('Experience created successfully');
    }
    closeForm();
    await fetchExperiences();
  } catch (error) {
    toast.error('Failed to save experience');
    console.error(error);
  } finally {
    saving.value = false;
  }
};

// Delete
const deleteExperience = async (id: string) => {
  if (!confirm('Are you sure you want to delete this experience?')) return;

  try {
    await useApi(`/api/experiences/${id}`, { method: 'DELETE' });
    await fetchExperiences();
    toast.success('Experience deleted successfully');
  } catch (error) {
    toast.error('Failed to delete experience');
  }
};

// Reorder
const moveExperience = async (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= experiences.value.length) return;

  const newExperiences = [...experiences.value];
  const temp = newExperiences[index];
  newExperiences[index] = newExperiences[newIndex];
  newExperiences[newIndex] = temp;

  // Update order values
  newExperiences.forEach((exp, i) => {
    exp.order = i;
  });

  try {
    // Update all experiences with new order
    await Promise.all(
      newExperiences.map(exp =>
        useApi(`/api/experiences/${exp.id}`, {
          method: 'PATCH',
          body: { order: exp.order },
        })
      )
    );
    await fetchExperiences();
  } catch (error) {
    console.error('Failed to reorder:', error);
    toast.error('Failed to reorder experiences');
  }
};

// Helpers
const openCreate = () => {
  resetForm();
  editingId.value = null;
  showForm.value = true;
};

const openEdit = (experience: Experience) => {
  editingId.value = experience.id;
  form.value = {
    company: experience.company,
    role: experience.role,
    period: experience.period,
    description: experience.description,
    technologies: experience.technologies.join(', '),
  };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    company: '',
    role: '',
    period: '',
    description: '',
    technologies: '',
  };
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Experience</h2>
      <button 
        @click="openCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        + Add Experience
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10 text-gray-400">Loading experiences...</div>

    <!-- Empty State -->
    <div v-else-if="experiences.length === 0" class="text-center py-10 bg-gray-800 rounded-lg">
      <p class="text-gray-400">No experiences found.</p>
    </div>

    <!-- Experiences List -->
    <div v-else class="space-y-4">
      <div 
        v-for="(experience, index) in experiences" 
        :key="experience.id" 
        class="bg-gray-800 p-4 rounded-lg border border-gray-700"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="font-bold text-lg text-white">{{ experience.role }}</h3>
              <span class="text-gray-500">at</span>
              <h4 class="font-semibold text-white">{{ experience.company }}</h4>
            </div>
            <p class="text-sm text-blue-400 mt-1">{{ experience.period }}</p>
            <p class="text-gray-300 mt-2 text-sm">{{ experience.description }}</p>
            <div class="flex flex-wrap gap-2 mt-3">
              <span 
                v-for="tech in experience.technologies" 
                :key="tech" 
                class="px-2 py-0.5 bg-gray-700 text-xs rounded text-gray-300"
              >
                {{ tech }}
              </span>
            </div>
          </div>
          
          <div class="flex flex-col gap-2 ml-4">
            <!-- Reorder buttons -->
            <div class="flex gap-1">
              <button 
                @click="moveExperience(index, 'up')"
                :disabled="index === 0"
                class="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                title="Move up"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button 
                @click="moveExperience(index, 'down')"
                :disabled="index === experiences.length - 1"
                class="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                title="Move down"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div class="flex gap-2">
              <button @click="openEdit(experience)" class="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
              <button @click="deleteExperience(experience.id)" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">{{ editingId ? 'Edit Experience' : 'Add Experience' }}</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Company *</label>
              <input v-model="form.company" required class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Role *</label>
              <input v-model="form.role" required class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Period *</label>
            <input 
              v-model="form.period" 
              required 
              placeholder="e.g., 2022 - Present"
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Description *</label>
            <textarea 
              v-model="form.description" 
              rows="4" 
              required 
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Technologies (comma separated)</label>
            <input 
              v-model="form.technologies" 
              placeholder="React, Node.js, PostgreSQL"
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
            />
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="closeForm" class="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
            <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              <span v-if="saving">{{ editingId ? 'Updating...' : 'Creating...' }}</span>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
