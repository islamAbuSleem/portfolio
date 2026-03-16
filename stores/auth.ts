import { defineStore } from 'pinia';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  
  const user = useState<User | null>('auth_user', () => null);

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken: string) {
    token.value = newToken;
  }

  function setUser(newUser: User) {
    user.value = newUser;
  }

  function logout() {
    token.value = null;
    user.value = null;
    navigateTo('/admin-login');
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout,
  };
});
