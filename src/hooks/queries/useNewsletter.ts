import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export function useSubscribeNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => {
      const payload = {
        email,
        requestId: crypto.randomUUID(),
      };
      return apiService.subscribeNewsletter(payload);
    },
    onSuccess: () => {
      // Potentially invalidate some count if it exists
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}
