<script setup lang="ts">
import { ref } from 'vue';

const toast = useToast();

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  imageUrls?: string[];
  year?: number;
  category?: string;
}

interface UploadedImage {
  url: string;
  publicId?: string;
  name?: string;
  isUploading?: boolean;
}

const projects = ref<Project[]>([]);
const loading = ref(true);
const showForm = ref(false);
const editingId = ref<number | null>(null);
const saving = ref(false);

// Form state
const form = ref({
  title: '',
  description: '',
  techStack: '', // Comma separated for input
  repoUrl: '',
  liveUrl: '',
  images: [] as UploadedImage[],
  year: new Date().getFullYear(),
  category: 'Web App',
});

// Fetch projects
const fetchProjects = async () => {
  loading.value = true;
  try {
    const { data } = await useApi<any>('/api/projects');
    if (data.value) {
      projects.value = data.value.data.projects;
    }
  } finally {
    loading.value = false;
  }
};

await fetchProjects();

// Create / Update
const handleSubmit = async () => {
  saving.value = true;
  const payload = {
    title: form.value.title,
    description: form.value.description,
    techStack: form.value.techStack.split(',').map(s => s.trim()).filter(Boolean),
    repoUrl: form.value.repoUrl,
    liveUrl: form.value.liveUrl,
    imageUrls: form.value.images.map(img => img.url),
    year: form.value.year,
    category: form.value.category,
  };

  try {
    if (editingId.value) {
      await useApi(`/api/projects/${editingId.value}`, {
        method: 'PATCH',
        body: payload,
      });
      toast.success('Project updated successfully');
    } else {
      await useApi('/api/projects', {
        method: 'POST',
        body: payload,
      });
      toast.success('Project created successfully');
    }
    closeForm();
    await fetchProjects();
  } catch (error) {
    toast.error('Failed to save project');
    console.error(error);
  } finally {
    saving.value = false;
  }
};

// Delete
const deleteProject = async (id: number) => {
  if (!confirm('Are you sure you want to delete this project?')) return;
  
  try {
    await useApi(`/api/projects/${id}`, { method: 'DELETE' });
    await fetchProjects();
    toast.success('Project deleted successfully');
  } catch (error) {
    toast.error('Failed to delete project');
  }
};

// Helpers
const openCreate = () => {
  resetForm();
  editingId.value = null;
  showForm.value = true;
};

const openEdit = (project: Project) => {
  editingId.value = project.id;
  form.value = {
    title: project.title,
    description: project.description,
    techStack: project.techStack.join(', '),
    repoUrl: project.repoUrl || '',
    liveUrl: project.liveUrl || '',
    images: (project.imageUrls || []).map(url => ({ url })),
    year: project.year || new Date().getFullYear(),
    category: project.category || '',
  };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    techStack: '',
    repoUrl: '',
    liveUrl: '',
    images: [],
    year: new Date().getFullYear(),
    category: 'Web App',
  };
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Projects</h2>
      <button 
        @click="openCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        + New Project
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10 text-gray-400">Loading projects...</div>

    <!-- Empty State -->
    <div v-else-if="projects.length === 0" class="text-center py-10 bg-gray-800 rounded-lg">
      <p class="text-gray-400">No projects found.</p>
    </div>

    <!-- Projects List -->
    <div v-else class="grid gap-4">
      <div 
        v-for="project in projects" 
        :key="project.id" 
        class="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-start"
      >
        <div class="flex gap-4">
          <!-- Project Image -->
          <div v-if="project.imageUrls && project.imageUrls.length > 0" class="flex-shrink-0">
            <img 
              :src="project.imageUrls[0]" 
              :alt="project.title"
              class="w-24 h-24 object-cover rounded-lg"
            />
          </div>
          <div v-else class="flex-shrink-0 w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div>
            <h3 class="font-bold text-lg text-white">{{ project.title }}</h3>
            <p class="text-sm text-gray-400 mt-1">{{ project.category }} • {{ project.year }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="tech in project.techStack" :key="tech" class="px-2 py-0.5 bg-gray-700 text-xs rounded text-gray-300">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex space-x-2">
          <button @click="openEdit(project)" class="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
          <button @click="deleteProject(project.id)" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">{{ editingId ? 'Edit Project' : 'New Project' }}</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <input v-model="form.title" required class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <input v-model="form.category" class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea v-model="form.description" rows="3" required class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Tech Stack (comma separated)</label>
            <input v-model="form.techStack" placeholder="Vue, Node.js, Tailwind" required class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Repo URL</label>
              <input v-model="form.repoUrl" class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Live URL</label>
              <input v-model="form.liveUrl" class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Year</label>
              <input v-model.number="form.year" type="number" class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" />
            </div>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Project Images</label>
            <AdminImageUpload 
              v-model="form.images" 
              :max-files="5"
              :max-file-size="5"
              folder="projects"
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
