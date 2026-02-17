import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with null token and user', () => {
    const store = useAuthStore()
    
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('sets token correctly', () => {
    const store = useAuthStore()
    const testToken = 'test-jwt-token'
    
    store.setToken(testToken)
    
    expect(store.token).toBe(testToken)
    expect(store.isAuthenticated).toBe(true)
  })

  it('sets user correctly', () => {
    const store = useAuthStore()
    const testUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin'
    }
    
    store.setUser(testUser)
    
    expect(store.user).toEqual(testUser)
  })

  it('clears auth data on logout', () => {
    const store = useAuthStore()
    
    // Set initial data
    store.setToken('test-token')
    store.setUser({ id: 1, email: 'test@example.com', name: 'Test', role: 'admin' })
    
    // Verify data is set
    expect(store.isAuthenticated).toBe(true)
    
    // Logout
    store.logout()
    
    // Verify data is cleared
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
