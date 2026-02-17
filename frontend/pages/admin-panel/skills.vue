<script setup lang="ts">
import { ref, computed } from 'vue';

const toast = useToast();

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

interface Skill {
  id: number;
  name: string;
  category: string;
  level?: string;
  icon?: string;
  color?: string;
}

const skills = ref<Skill[]>([]);
const loading = ref(true);
const showForm = ref(false);
const editingId = ref<number | null>(null);
const selectedCategory = ref('All');
const saving = ref(false);

// Form state
const form = ref({
  name: '',
  category: 'Frontend',
  level: 'Intermediate',
  icon: '',
  color: '#3b82f6',
});

// Categories
const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'];
const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

// Fetch skills
const fetchSkills = async () => {
  loading.value = true;
  try {
    const { data } = await useApi<any>('/api/skills');
    if (data.value) {
      skills.value = data.value.data.skills;
    }
  } finally {
    loading.value = false;
  }
};

await fetchSkills();

// Group skills by category
const groupedSkills = computed(() => {
  const grouped: Record<string, Skill[]> = {};
  
  skills.value.forEach(skill => {
    if (!grouped[skill.category]) {
      grouped[skill.category] = [];
    }
    grouped[skill.category].push(skill);
  });
  
  return grouped;
});

const filteredCategories = computed(() => {
  if (selectedCategory.value === 'All') {
    return Object.keys(groupedSkills.value).sort();
  }
  return [selectedCategory.value].filter(cat => groupedSkills.value[cat]);
});

// Create / Update
const handleSubmit = async () => {
  saving.value = true;
  try {
    if (editingId.value) {
      await useApi(`/api/skills/${editingId.value}`, {
        method: 'PATCH',
        body: form.value,
      });
      toast.success('Skill updated successfully');
    } else {
      await useApi('/api/skills', {
        method: 'POST',
        body: form.value,
      });
      toast.success('Skill created successfully');
    }
    closeForm();
    await fetchSkills();
  } catch (error) {
    toast.error('Failed to save skill');
    console.error(error);
  } finally {
    saving.value = false;
  }
};

// Delete
const deleteSkill = async (id: number) => {
  if (!confirm('Are you sure you want to delete this skill?')) return;
  
  try {
    await useApi(`/api/skills/${id}`, { method: 'DELETE' });
    await fetchSkills();
    toast.success('Skill deleted successfully');
  } catch (error) {
    toast.error('Failed to delete skill');
  }
};

// Helpers
const openCreate = () => {
  resetForm();
  editingId.value = null;
  showForm.value = true;
};

const openEdit = (skill: Skill) => {
  editingId.value = skill.id;
  form.value = {
    name: skill.name,
    category: skill.category,
    level: skill.level || 'Intermediate',
    icon: skill.icon || '',
    color: skill.color || '#3b82f6',
  };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: '',
    category: 'Frontend',
    level: 'Intermediate',
    icon: '',
    color: '#3b82f6',
  };
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Frontend': '#3b82f6',
    'Backend': '#10b981',
    'Database': '#f59e0b',
    'DevOps': '#ef4444',
    'Tools': '#8b5cf6',
    'Other': '#6b7280',
  };
  return colors[category] || '#6b7280';
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Skills</h2>
      <button 
        @click="openCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        + Add Skill
      </button>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        @click="selectedCategory = 'All'"
        class="px-3 py-1 rounded-full text-sm transition-colors"
        :class="selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'"
      >
        All
      </button>
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        class="px-3 py-1 rounded-full text-sm transition-colors"
        :class="selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'"
      >
        {{ category }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10 text-gray-400">Loading skills...</div>

    <!-- Empty State -->
    <div v-else-if="skills.length === 0" class="text-center py-10 bg-gray-800 rounded-lg">
      <p class="text-gray-400">No skills found.</p>
    </div>

    <!-- Skills List -->
    <div v-else class="space-y-8">
      <div v-for="category in filteredCategories" :key="category">
        <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: getCategoryColor(category) }"
          ></span>
          {{ category }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div 
            v-for="skill in groupedSkills[category]" 
            :key="skill.id" 
            class="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center justify-between group"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                :style="{ backgroundColor: skill.color || getCategoryColor(category) }"
              >
                {{ skill.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="font-medium text-white">{{ skill.name }}</h4>
                <p class="text-xs text-gray-400">{{ skill.level }}</p>
              </div>
            </div>
            
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click="openEdit(skill)" 
                class="p-1 text-blue-400 hover:text-blue-300"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="deleteSkill(skill.id)" 
                class="p-1 text-red-400 hover:text-red-300"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-lg w-full border border-gray-700">
        <h3 class="text-xl font-bold mb-4">{{ editingId ? 'Edit Skill' : 'Add Skill' }}</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Skill Name *</label>
            <input 
              v-model="form.name" 
              required 
              placeholder="e.g., React, Python, Docker"
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Category *</label>
              <select v-model="form.category" class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Level</label>
              <select v-model="form.level" class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white">
                <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Color</label>
            <div class="flex items-center gap-3">
              <input 
                v-model="form.color" 
                type="color"
                class="h-10 w-20 bg-gray-700 border-gray-600 rounded cursor-pointer" 
              />
              <span class="text-sm text-gray-400">{{ form.color }}</span>
            </div>
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
