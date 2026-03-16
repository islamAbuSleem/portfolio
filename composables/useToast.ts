export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => []);

  const add = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration?: number) => add(message, 'success', duration);
  const error = (message: string, duration?: number) => add(message, 'error', duration);
  const info = (message: string, duration?: number) => add(message, 'info', duration);
  const warning = (message: string, duration?: number) => add(message, 'warning', duration);

  return {
    toasts,
    add,
    remove,
    success,
    error,
    info,
    warning,
  };
};
