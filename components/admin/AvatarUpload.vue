<template>
  <div class="space-y-4">
    <!-- Current Avatar Display -->
    <div class="flex items-center gap-4">
      <div class="relative">
        <img 
          v-if="modelValue"
          :src="modelValue" 
          alt="Avatar"
          class="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
        />
        <div 
          v-else 
          class="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600"
        >
          <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <!-- Remove button -->
        <button
          v-if="modelValue"
          @click="removeAvatar"
          class="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
          title="Remove avatar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div>
        <button
          @click="triggerFileInput"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {{ modelValue ? 'Change Avatar' : 'Upload Avatar' }}
        </button>
        <p class="text-xs text-gray-500 mt-1">Recommended: 400x400px, JPG or PNG</p>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Cropper Modal -->
    <div v-if="showCropper" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <h3 class="text-lg font-bold mb-4">Crop Avatar</h3>
        
        <div class="aspect-square bg-gray-900 rounded-lg overflow-hidden mb-4">
          <cropper
            ref="cropperRef"
            class="cropper"
            :src="imageToCrop"
            :stencil-props="{
              aspectRatio: 1,
            }"
            :resize-image="{
              adjustStencil: false
            }"
            image-restriction="stencil"
          />
        </div>

        <div class="flex justify-end gap-3">
          <button 
            @click="closeCropper"
            class="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button 
            @click="cropImage"
            :disabled="isUploading"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="isUploading">Uploading...</span>
            <span v-else>Save Avatar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [url: string];
}>();

const config = useRuntimeConfig();
const fileInput = ref<HTMLInputElement>();
const cropperRef = ref<any>();
const showCropper = ref(false);
const imageToCrop = ref('');
const isUploading = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  // Read file and show cropper
  const reader = new FileReader();
  reader.onload = (e) => {
    imageToCrop.value = e.target?.result as string;
    showCropper.value = true;
  };
  reader.readAsDataURL(file);

  // Reset input
  target.value = '';
};

const closeCropper = () => {
  showCropper.value = false;
  imageToCrop.value = '';
};

const cropImage = async () => {
  if (!cropperRef.value) return;

  isUploading.value = true;

  try {
    // Get cropped canvas
    const { canvas } = cropperRef.value.getResult();
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b: Blob) => resolve(b), 'image/jpeg', 0.9);
    });

    // Create form data
    const formData = new FormData();
    formData.append('image', blob, 'avatar.jpg');
    formData.append('folder', 'avatars');

    // Upload to server
    const response = await fetch(`${config.public.apiBase}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${useCookie('auth_token').value}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    emit('update:modelValue', result.data.url);
    closeCropper();
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload avatar. Please try again.');
  } finally {
    isUploading.value = false;
  }
};

const removeAvatar = () => {
  if (confirm('Are you sure you want to remove your avatar?')) {
    emit('update:modelValue', '');
  }
};
</script>

<style scoped>
.cropper {
  height: 100%;
  width: 100%;
  background: #1f2937;
}

:deep(.cropper-circle-stencil) {
  border-radius: 50%;
}
</style>
