import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => apiService.getBlogs(),
  });
}

export function useFeaturedBlogs() {
  return useQuery({
    queryKey: ['blogs', 'featured'],
    queryFn: () => apiService.getFeaturedBlogs(),
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ['blogs', slug],
    queryFn: () => apiService.getBlogBySlug(slug),
    enabled: !!slug,
  });
}
export function useAuthors() {
  return useQuery({
    queryKey: ['authors'],
    queryFn: () => apiService.getAuthors(),
  });
}
