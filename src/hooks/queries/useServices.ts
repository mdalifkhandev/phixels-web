import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => apiService.getServices(),
  });
}

export function useServiceMenu() {
  return useQuery({
    queryKey: ['services', 'menu'],
    queryFn: () => apiService.getServiceMenu(),
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: ['services', 'categories'],
    queryFn: () => apiService.getServiceCategories(),
  });
}
