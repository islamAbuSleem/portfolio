<template>
  <div class="card max-w-2xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 dark:text-dark-300 font-medium mb-2">Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Your name"
            class="w-full px-4 py-3 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-500"
            @blur="validateField('name')"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="block text-gray-700 dark:text-dark-300 font-medium mb-2">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            class="w-full px-4 py-3 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-500"
            @blur="validateField('email')"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>
      </div>

      <div>
        <label class="block text-gray-700 dark:text-dark-300 font-medium mb-2">Subject</label>
        <input
          v-model="form.subject"
          type="text"
          placeholder="Project inquiry"
          class="w-full px-4 py-3 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-500"
          @blur="validateField('subject')"
        />
        <p v-if="errors.subject" class="text-red-500 text-sm mt-1">{{ errors.subject }}</p>
      </div>

      <div>
        <label class="block text-gray-700 dark:text-dark-300 font-medium mb-2">Message</label>
        <textarea
          v-model="form.message"
          placeholder="Tell me about your project..."
          rows="5"
          class="w-full px-4 py-3 bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-500 resize-none"
          @blur="validateField('message')"
        ></textarea>
        <p v-if="errors.message" class="text-red-500 text-sm mt-1">{{ errors.message }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="submitted" class="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
        <p class="text-green-800 dark:text-green-200 font-medium">✓ Message sent successfully! I'll get back to you soon.</p>
      </div>

      <!-- Error Message -->
      <div v-if="submitError" class="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ submitError }}</p>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        <span v-if="!isSubmitting">Send Message</span>
        <span v-else>Sending...</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface Errors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const form = reactive<FormData>({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const errors = reactive<Errors>({})
const submitted = ref(false)
const submitError = ref('')
const isSubmitting = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateField = (field: keyof FormData) => {
  if (!form[field]?.trim()) {
    errors[field as keyof Errors] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    return false
  }

  if (field === 'email' && !emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email'
    return false
  }

  delete errors[field as keyof Errors]
  return true
}

const validateForm = () => {
  const fieldsToValidate: (keyof FormData)[] = ['name', 'email', 'subject', 'message']
  return fieldsToValidate.every(field => validateField(field))
}

const handleSubmit = async () => {
  submitError.value = ''
  submitted.value = false

  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await fetch(`${config.public.apiBase}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    if (response.ok) {
      submitted.value = true
      // Reset form
      form.name = ''
      form.email = ''
      form.subject = ''
      form.message = ''

      // Hide success message after 5 seconds
      setTimeout(() => {
        submitted.value = false
      }, 5000)
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Failed to send message' }))
      submitError.value = errorData.message || 'Failed to send message. Please try again.'
    }
  } catch (error) {
    submitError.value = 'Error sending message. Please try again later.'
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
