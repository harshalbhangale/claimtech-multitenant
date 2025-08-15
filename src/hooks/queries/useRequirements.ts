import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRequirements } from '../../api/services/dashboard/additionalRequirement';
import type { Requirement } from '../../api/services/dashboard/additionalRequirement';
import React from 'react';

export const useRequirements = (claimId: string) => {
  return useQuery<Requirement[]>({
    queryKey: ['requirements', claimId],
    queryFn: () => fetchRequirements(claimId),
    enabled: !!claimId, // Only fetch if claimId exists
    staleTime: 15 * 1000, // 15 seconds - requirements change frequently, check more often
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: false, // Disable individual polling - will be handled centrally
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Centralized polling hook for all requirements
export const useCentralizedRequirementsPolling = () => {
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Only start polling when the tab is visible and user is active
    const startPolling = () => {
      interval = setInterval(() => {
        // Get all active requirement queries and refetch them
        const activeQueries = queryClient.getQueryCache().getAll();
        const requirementQueries = activeQueries.filter(query => 
          query.queryKey[0] === 'requirements' && query.queryKey[1]
        );
        
        // Only refetch if there are active requirement queries
        if (requirementQueries.length > 0) {
          requirementQueries.forEach(query => {
            if (query.queryKey[1]) {
              queryClient.invalidateQueries({ queryKey: query.queryKey });
            }
          });
        }
      }, 30000); // 30 seconds for immediate staff updates
    };
    
    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    
    // Start polling when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling(); // Stop polling when tab is hidden
      } else {
        startPolling(); // Start polling when tab becomes visible
      }
    };
    
    // Start polling initially if tab is visible
    if (!document.hidden) {
      startPolling();
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryClient]);
  
  return null; // This hook doesn't return data, just manages polling
}; 