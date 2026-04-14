import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export function useAboutContent() {
  return useQuery({
    queryKey: ['about-content'],
    queryFn: () => apiService.getAboutContent(),
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: () => apiService.getTeamMembers(),
  });
}

export function usePageMetrics() {
  return useQuery({
    queryKey: ['page-metrics'],
    queryFn: () => apiService.getPageMetrics(),
  });
}
