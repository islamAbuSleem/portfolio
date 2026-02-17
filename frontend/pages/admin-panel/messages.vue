<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

const toast = useToast();

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const messages = ref<Message[]>([]);
const loading = ref(true);

const fetchMessages = async () => {
  loading.value = true;
  try {
    const { data } = await useApi<any>('/api/messages');
    if (data.value) {
      messages.value = data.value.data.messages;
    }
  } finally {
    loading.value = false;
  }
};

const markRead = async (id: number) => {
    try {
        await useApi(`/api/messages/${id}/read`, { method: 'PATCH' });
        // Optimistic update
        const msg = messages.value.find(m => m.id === id);
        if (msg) msg.isRead = true;
        toast.success('Message marked as read');
    } catch (e) {
        console.error('Failed to mark as read', e);
        toast.error('Failed to mark as read');
    }
}

const deleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
        await useApi(`/api/messages/${id}`, { method: 'DELETE' });
        // Remove from local array
        messages.value = messages.value.filter(m => m.id !== id);
        toast.success('Message deleted successfully');
    } catch (e) {
        console.error('Failed to delete message', e);
        toast.error('Failed to delete message');
    }
}

await fetchMessages();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Messages</h2>
      <button @click="fetchMessages" class="text-sm text-blue-400 hover:text-blue-300">Refresh</button>
    </div>

    <div v-if="loading" class="text-center py-10 text-gray-400">Loading messages...</div>

    <div v-else-if="messages.length === 0" class="text-center py-10 bg-gray-800 rounded-lg">
      <p class="text-gray-400">No messages found.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="bg-gray-800 p-5 rounded-lg border border-gray-700 relative"
        :class="{ 'border-l-4 border-l-blue-500': !msg.isRead }"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-bold text-white">{{ msg.name }}</h3>
            <a :href="`mailto:${msg.email}`" class="text-sm text-blue-400 hover:underline">{{ msg.email }}</a>
          </div>
          <span class="text-xs text-gray-500">{{ formatDate(msg.createdAt) }}</span>
        </div>
        
        <p class="text-gray-300 whitespace-pre-wrap mt-2 text-sm">{{ msg.message }}</p>

        <div class="mt-3 flex justify-end gap-4">
            <button 
                v-if="!msg.isRead"
                @click="markRead(msg.id)" 
                class="text-xs text-gray-400 hover:text-white uppercase tracking-wider font-semibold"
            >
                Mark as Read
            </button>
            <button 
                @click="deleteMessage(msg.id)" 
                class="text-xs text-red-400 hover:text-red-300 uppercase tracking-wider font-semibold"
            >
                Delete
            </button>
        </div>
      </div>
    </div>
  </div>
</template>
