import { useQuery } from '@tanstack/react-query';
import { fetchRequirements } from '../../api/services/dashboard/additionalRequirement';
import type { Requirement } from '../../api/services/dashboard/additionalRequirement';

export const useRequirements = (claimId: string) => {
  return useQuery<Requirement[]>({
    queryKey: ['requirements', claimId],
    queryFn: () => fetchRequirements(claimId),
    enabled: !!claimId, // Only fetch if claimId exists
    staleTime: 30 * 1000, // 30 seconds - requirements change frequently, check more often
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Poll every 60 seconds for real-time updates
    refetchIntervalInBackground: false, // Only poll when tab is active
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 