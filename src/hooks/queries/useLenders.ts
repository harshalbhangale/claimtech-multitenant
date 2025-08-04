import { useQuery } from '@tanstack/react-query';
import { getLenders } from '../../api/services/onboarding/getLenders';
import type { LendersResponse } from '../../api/services/onboarding/getLenders';

export const useLenders = () => {
  return useQuery<LendersResponse>({
    queryKey: ['lenders'],
    queryFn: getLenders,
    staleTime: 5 * 60 * 1000, // 5 minutes - reasonable cache time
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on focus
    refetchOnMount: true, // Allow refetch on mount for fresh data
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 