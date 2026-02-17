import { vi } from 'vitest'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useCookie: vi.fn((name: string, options?: any) => {
    const value = ref<string | null>(null)
    return {
      value,
      // Add any other cookie methods if needed
    }
  }),
  useState: vi.fn((key: string, init?: () => any) => {
    return ref(init ? init() : null)
  }),
  useRuntimeConfig: vi.fn(() => ({
    public: {
      apiBase: 'http://localhost:3001'
    }
  })),
  navigateTo: vi.fn(),
  useHead: vi.fn(),
  useFetch: vi.fn(),
  useColorMode: vi.fn(() => ({
    value: 'dark',
    preference: ref('dark')
  })),
}))

// Mock VueUse composables if needed
vi.mock('@vueuse/core', () => ({
  useDark: vi.fn(() => ref(true)),
  useToggle: vi.fn(() => vi.fn()),
}))
