<script setup lang="ts">
const toast = useToast();

interface Profile {
  id: number;
  fullName: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  avatarUrl: string;
  resumeUrl: string;
  website: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    dev?: string;
  };
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  metaKeywords: string;
  themeColor: string;
  showResume: boolean;
  showContact: boolean;
}

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

const config = useRuntimeConfig();
const profile = ref<Profile | null>(null);
const loading = ref(true);
const saving = ref(false);
const activeTab = ref('basic'); // basic, social, seo, settings

// Form state
const form = reactive({
  fullName: '',
  title: '',
  tagline: '',
  bio: '',
  location: '',
  email: '',
  phone: '',
  avatarUrl: '',
  resumeUrl: '',
  website: '',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    youtube: '',
    dev: '',
  },
  seoTitle: '',
  seoDescription: '',
  seoImage: '',
  metaKeywords: '',
  themeColor: '#3b82f6',
  showResume: true,
  showContact: true,
});

// Fetch profile
const fetchProfile = async () => {
  loading.value = true;
  try {
    const { data } = await useApi<any>('/api/profile');
    if (data.value) {
      profile.value = data.value.data.profile;
      // Populate form
      Object.assign(form, data.value.data.profile);
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  } finally {
    loading.value = false;
  }
};

await fetchProfile();

// Save profile
const saveProfile = async () => {
  saving.value = true;
  try {
    await useApi('/api/profile', {
      method: 'PATCH',
      body: form,
    });
    
    toast.success('Profile saved successfully!');
    await fetchProfile();
  } catch (error) {
    console.error('Failed to save profile:', error);
    toast.error('Failed to save profile. Please try again.');
  } finally {
    saving.value = false;
  }
};

// Handle resume upload
const handleResumeUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  if (file.type !== 'application/pdf') {
    toast.error('Please upload a PDF file');
    return;
  }

  const formData = new FormData();
  formData.append('resume', file);

  try {
    const response = await fetch(`${config.public.apiBase}/api/profile/resume`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${useCookie('auth_token').value}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    
    const result = await response.json();
    form.resumeUrl = result.data.resumeUrl;
    toast.success('Resume uploaded successfully!');
  } catch (error) {
    console.error('Upload error:', error);
    toast.error('Failed to upload resume');
  }

  target.value = '';
};

const tabs = [
  { id: 'basic', name: 'Basic Info', icon: 'user' },
  { id: 'social', name: 'Social Links', icon: 'share' },
  { id: 'seo', name: 'SEO & Meta', icon: 'search' },
  { id: 'settings', name: 'Settings', icon: 'cog' },
];
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Profile</h2>
      <button 
        @click="saveProfile"
        :disabled="saving"
        class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <span v-if="saving">Saving...</span>
        <span v-else>Save Changes</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10 text-gray-400">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      Loading profile...
    </div>

    <div v-else class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <!-- Tabs -->
      <div class="flex border-b border-gray-700 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap"
          :class="activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Basic Info Tab -->
        <div v-if="activeTab === 'basic'" class="space-y-6">
          <!-- Avatar Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Profile Photo</label>
            <AdminAvatarUpload v-model="form.avatarUrl" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
              <input 
                v-model="form.fullName" 
                required
                class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Professional Title *</label>
              <input 
                v-model="form.title" 
                required
                placeholder="e.g., Senior Software Engineer"
                class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Tagline</label>
            <input 
              v-model="form.tagline" 
              placeholder="A short catchy phrase about yourself"
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Bio *</label>
            <textarea 
              v-model="form.bio" 
              required
              rows="6"
              placeholder="Write a compelling bio about yourself..."
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white resize-none"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Markdown supported</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <input 
                v-model="form.location" 
                placeholder="e.g., San Francisco, CA"
                class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Personal Website</label>
              <input 
                v-model="form.website" 
                placeholder="https://yourwebsite.com"
                class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Contact Email</label>
              <input 
                v-model="form.email" 
                type="email"
                class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Phone</label>
              <input 
                v-model="form.phone" 
                class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Resume/CV (PDF)</label>
            <div class="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                @change="handleResumeUpload"
              />
            </div>
            <p v-if="form.resumeUrl" class="text-sm text-green-400 mt-2">
              ✓ Resume uploaded: {{ form.resumeUrl.split('/').pop() }}
            </p>
          </div>
        </div>

        <!-- Social Links Tab -->
        <div v-if="activeTab === 'social'" class="space-y-4">
          <div v-for="(platform, key) in {
            github: { label: 'GitHub', placeholder: 'https://github.com/username' },
            linkedin: { label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
            twitter: { label: 'Twitter', placeholder: 'https://twitter.com/username' },
            instagram: { label: 'Instagram', placeholder: 'https://instagram.com/username' },
            youtube: { label: 'YouTube', placeholder: 'https://youtube.com/channel/...' },
            dev: { label: 'Dev.to', placeholder: 'https://dev.to/username' },
          }" :key="key">
            <label class="block text-sm font-medium text-gray-400 mb-1">{{ platform.label }}</label>
            <input 
              v-model="form.socialLinks[key as keyof typeof form.socialLinks]"
              :placeholder="platform.placeholder"
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
            />
          </div>
        </div>

        <!-- SEO Tab -->
        <div v-if="activeTab === 'seo'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">SEO Title</label>
            <input 
              v-model="form.seoTitle" 
              placeholder="Page title for search engines"
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
            />
            <p class="text-xs text-gray-500 mt-1">Leave empty to use default title</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">SEO Description</label>
            <textarea 
              v-model="form.seoDescription" 
              rows="3"
              placeholder="Meta description for search engines"
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white resize-none"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Meta Keywords</label>
            <input 
              v-model="form.metaKeywords" 
              placeholder="software engineer, full-stack, javascript"
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Social Image URL</label>
            <input 
              v-model="form.seoImage" 
              placeholder="https://..."
              class="w-full bg-gray-700 border-gray-600 rounded px-3 py-2 text-white" 
            />
            <p class="text-xs text-gray-500 mt-1">Used when sharing on social media (1200x630px recommended)</p>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Theme Color</label>
            <div class="flex items-center gap-3">
              <input 
                v-model="form.themeColor" 
                type="color"
                class="h-10 w-20 bg-gray-700 border-gray-600 rounded cursor-pointer" 
              />
              <span class="text-sm text-gray-400">{{ form.themeColor }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Primary color used throughout the site</p>
          </div>

          <div class="space-y-3">
            <label class="flex items-center gap-3 cursor-pointer">
              <input 
                v-model="form.showResume" 
                type="checkbox"
                class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-white">Show resume download button</span>
            </label>

            <label class="flex items-center gap-3 cursor-pointer">
              <input 
                v-model="form.showContact" 
                type="checkbox"
                class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-white">Show contact form</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
