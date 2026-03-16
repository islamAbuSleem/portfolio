<template>
  <div class="space-y-4">
    <!-- Drop Zone -->
    <div
      v-if="modelValue.length < maxFiles"
      class="border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer"
      :class="[
        isDragging 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-600 hover:border-gray-500 bg-gray-800'
      ]"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="maxFiles > 1"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <div class="text-center">
        <svg 
          class="mx-auto h-12 w-12 text-gray-400" 
          stroke="currentColor" 
          fill="none" 
          viewBox="0 0 48 48"
        >
          <path 
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
          />
        </svg>
        <p class="mt-2 text-sm text-gray-400">
          <span class="text-blue-400">Click to upload</span> or drag and drop
        </p>
        <p class="mt-1 text-xs text-gray-500">
          {{ acceptText }} up to {{ maxFileSize }}MB (max {{ maxFiles }} files)
        </p>
      </div>
    </div>

    <!-- Preview Grid -->
    <div v-if="modelValue.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="(file, index) in modelValue" 
        :key="file.url || index"
        class="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
      >
        <img 
          :src="file.url" 
          :alt="file.name || 'Uploaded image'"
          class="w-full h-full object-cover"
        />
        
        <!-- Overlay with actions -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            @click="removeFile(index)"
            class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            title="Remove image"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Upload progress overlay -->
        <div 
          v-if="file.isUploading" 
          class="absolute inset-0 bg-black/70 flex items-center justify-center"
        >
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-xs text-white mt-2">Uploading...</p>
          </div>
        </div>

        <!-- Featured badge -->
        <div 
          v-if="index === 0 && modelValue.length > 1" 
          class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded"
        >
          Featured
        </div>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="errors.length > 0" class="space-y-2">
      <div 
        v-for="(error, index) in errors" 
        :key="index"
        class="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UploadedFile {
  url: string;
  publicId?: string;
  name?: string;
  isUploading?: boolean;
}

interface Props {
  modelValue: UploadedFile[];
  maxFiles?: number;
  maxFileSize?: number; // in MB
  accept?: string;
  folder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 5,
  maxFileSize: 5,
  accept: 'image/*',
  folder: 'general',
});

const emit = defineEmits<{
  'update:modelValue': [files: UploadedFile[]];
}>();

const fileInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const errors = ref<string[]>([]);
const config = useRuntimeConfig();

const acceptText = computed(() => {
  if (props.accept === 'image/*') return 'PNG, JPG, WebP, GIF';
  return props.accept;
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const validateFile = (file: File): string | null => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return `${file.name}: Invalid file type. Only images are allowed.`;
  }

  // Check file size
  const maxSizeBytes = props.maxFileSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `${file.name}: File too large. Maximum size is ${props.maxFileSize}MB.`;
  }

  return null;
};

const uploadFile = async (file: File): Promise<UploadedFile | null> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', props.folder);

  try {
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
    return {
      url: result.data.url,
      publicId: result.data.publicId,
      name: file.name,
      isUploading: false,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

const processFiles = async (files: FileList) => {
  errors.value = [];
  
  // Check if adding these files would exceed max
  if (props.modelValue.length + files.length > props.maxFiles) {
    errors.value.push(`You can only upload up to ${props.maxFiles} images.`);
    return;
  }

  // Validate all files first
  const validFiles: File[] = [];
  for (const file of Array.from(files)) {
    const error = validateFile(file);
    if (error) {
      errors.value.push(error);
    } else {
      validFiles.push(file);
    }
  }

  // Upload valid files
  for (const file of validFiles) {
    // Add placeholder with uploading state
    const tempFile: UploadedFile = {
      url: URL.createObjectURL(file),
      name: file.name,
      isUploading: true,
    };
    
    const newFiles = [...props.modelValue, tempFile];
    emit('update:modelValue', newFiles);

    try {
      const uploadedFile = await uploadFile(file);
      if (uploadedFile) {
        // Replace placeholder with uploaded file
        const index = newFiles.length - 1;
        newFiles[index] = uploadedFile;
        emit('update:modelValue', [...newFiles]);
      }
    } catch (error) {
      // Remove placeholder on error
      errors.value.push(`Failed to upload ${file.name}. Please try again.`);
      emit('update:modelValue', newFiles.filter((_, i) => i !== newFiles.length - 1));
    }
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    processFiles(target.files);
    // Reset input
    target.value = '';
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFiles(event.dataTransfer.files);
  }
};

const removeFile = async (index: number) => {
  const file = props.modelValue[index];
  
  // If file has a publicId, delete from Cloudinary
  if (file.publicId) {
    try {
      await fetch(`${config.public.apiBase}/api/upload/image/${encodeURIComponent(file.publicId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${useCookie('auth_token').value}`,
        },
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }

  // Remove from local array
  const newFiles = props.modelValue.filter((_, i) => i !== index);
  emit('update:modelValue', newFiles);
};
</script>
