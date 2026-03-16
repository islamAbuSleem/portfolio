import { useAuthStore } from '~/stores/auth';

export const useApi = <T>(url: string, options: any = {}) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const defaults = {
    baseURL: config.public.apiBase,
    headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {},
    onResponseError({ response }: any) {
      if (response.status === 401) {
        authStore.logout();
      }
    },
  };

  return useFetch<T>(url, {
    ...defaults,
    ...options,
    headers: {
      ...defaults.headers,
      ...options.headers,
    },
  });
};
