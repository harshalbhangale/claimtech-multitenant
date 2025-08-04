import { useQuery } from '@tanstack/react-query';
import { getClaims } from '../../api/services/dashboard/getClaims';
import type { Claim } from '../../api/services/dashboard/getClaims';

export const useClaims = () => {
  return useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: getClaims,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache kept for 10 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}; 