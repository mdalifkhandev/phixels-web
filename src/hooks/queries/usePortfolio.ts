import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: () => apiService.getPortfolios(),
  });
}

export function usePortfolioItem(id: string) {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => apiService.getPortfolioById(id),
    enabled: !!id,
  });
}
