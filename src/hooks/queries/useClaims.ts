import { useQuery } from '@tanstack/react-query';
import { getClaims } from '../../api/services/dashboard/getClaims';
import type { Claim } from '../../api/services/dashboard/getClaims';
import { fetchAgreements, type Agreement } from '../../api/services/dashboard/agreementDetails';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react'; // Added missing import for React

export const useClaims = () => {
  return useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: getClaims,
    staleTime: 60 * 1000, // 1 minute - claims don't change that frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - cache kept for 10 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 120000, // Poll every 2 minutes instead of 15 seconds for immediate staff updates
    refetchIntervalInBackground: false, // Only poll when tab is active
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

export const useAgreements = (claimId: string) => {
  return useQuery<Agreement[]>({
    queryKey: ['agreements', claimId],
    queryFn: () => fetchAgreements(claimId),
    enabled: !!claimId,
    staleTime: 60 * 1000, // 1 minute - agreements don't change that frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: false, // Disable individual polling - will be handled centrally
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Centralized polling hook for all agreements
export const useCentralizedAgreementsPolling = () => {
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Only start polling when the tab is visible and user is active
    const startPolling = () => {
      interval = setInterval(() => {
        // Get all active agreement queries and refetch them
        const activeQueries = queryClient.getQueryCache().getAll();
        const agreementQueries = activeQueries.filter(query => 
          query.queryKey[0] === 'agreements' && query.queryKey[1]
        );
        
        // Only refetch if there are active agreement queries
        if (agreementQueries.length > 0) {
          agreementQueries.forEach(query => {
            if (query.queryKey[1]) {
              queryClient.invalidateQueries({ queryKey: query.queryKey });
            }
          });
        }
      }, 120000); // 2 minutes instead of 15 seconds
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

// Enhanced hook for managing agreements with real-time updates
export const useAgreementsWithRealtime = (claimId: string) => {
  const queryClient = useQueryClient();
  
  const query = useAgreements(claimId);
  
  // Function to manually trigger an immediate refetch (only when needed)
  const refetchImmediately = () => {
    queryClient.invalidateQueries({ queryKey: ['agreements', claimId] });
  };
  
  // Function to manually update local data (useful for optimistic updates)
  const updateLocalData = (updater: (old: Agreement[] | undefined) => Agreement[] | undefined) => {
    queryClient.setQueryData(['agreements', claimId], updater);
  };
  
  // Function to add a new agreement to local data immediately
  const addAgreementLocally = (newAgreement: Agreement) => {
    updateLocalData((old) => {
      if (!old) return [newAgreement];
      return [newAgreement, ...old];
    });
  };
  
  // Function to remove an agreement from local data immediately
  const removeAgreementLocally = (agreementId: string) => {
    updateLocalData((old) => {
      if (!old) return old;
      return old.filter(agreement => agreement.id !== agreementId);
    });
  };
  
  // Function to update an agreement in local data immediately
  const updateAgreementLocally = (agreementId: string, updates: Partial<Agreement>) => {
    updateLocalData((old) => {
      if (!old) return old;
      return old.map(agreement => 
        agreement.id === agreementId ? { ...agreement, ...updates } : agreement
      );
    });
  };

  // Function to handle staff-side updates immediately
  const handleStaffUpdate = (updatedAgreement: Agreement) => {
    updateLocalData((old) => {
      if (!old) return [updatedAgreement];
      
      // Check if agreement exists and update it, otherwise add it
      const existingIndex = old.findIndex(agreement => agreement.id === updatedAgreement.id);
      if (existingIndex >= 0) {
        const updated = [...old];
        updated[existingIndex] = updatedAgreement;
        return updated;
      } else {
        return [updatedAgreement, ...old];
      }
    });
    
    // Also update the claims data if this affects claim status
    // This ensures immediate UI updates without waiting for polling
    queryClient.invalidateQueries({ queryKey: ['claims'] });
  };
  
  return {
    ...query,
    refetchImmediately,
    updateLocalData,
    addAgreementLocally,
    removeAgreementLocally,
    updateAgreementLocally,
    handleStaffUpdate, // New function for staff updates
  };
}; 

// Enhanced hook for managing claims with real-time updates
export const useClaimsWithRealtime = () => {
  const queryClient = useQueryClient();
  
  const query = useClaims();
  
  // Function to manually trigger an immediate refetch
  const refetchImmediately = () => {
    queryClient.invalidateQueries({ queryKey: ['claims'] });
  };
  
  // Function to manually update local data (useful for optimistic updates)
  const updateLocalData = (updater: (old: Claim[] | undefined) => Claim[] | undefined) => {
    queryClient.setQueryData(['claims'], updater);
  };
  
  // Function to update a claim in local data immediately
  const updateClaimLocally = (claimId: string, updates: Partial<Claim>) => {
    updateLocalData((old) => {
      if (!old) return old;
      return old.map(claim => 
        claim.id === claimId ? { ...claim, ...updates } : claim
      );
    });
  };
  
  // Function to handle staff-side claim updates immediately
  const handleStaffClaimUpdate = (updatedClaim: Claim) => {
    updateLocalData((old) => {
      if (!old) return [updatedClaim];
      
      // Check if claim exists and update it
      const existingIndex = old.findIndex(claim => claim.id === updatedClaim.id);
      if (existingIndex >= 0) {
        const updated = [...old];
        updated[existingIndex] = updatedClaim;
        return updated;
      } else {
        return [updatedClaim, ...old];
      }
    });
  };

  // Function to handle staff-side claim status updates immediately
  const handleStaffClaimStatusUpdate = (claimId: string, newStatus: string) => {
    updateLocalData((old) => {
      if (!old) return old;
      
      return old.map(claim => 
        claim.id === claimId ? { ...claim, status: newStatus } : claim
      );
    });
  };

  // Function to handle staff-side claim stage updates immediately
  const handleStaffClaimStageUpdate = (claimId: string, newStage: string) => {
    updateLocalData((old) => {
      if (!old) return old;
      
      return old.map(claim => 
        claim.id === claimId ? { ...claim, stage: newStage } : claim
      );
    });
  };

  // Function to handle multiple claim updates at once (efficient for batch staff updates)
  const handleStaffClaimBatchUpdate = (updates: Array<{ claimId: string; updates: Partial<Claim> }>) => {
    updateLocalData((old) => {
      if (!old) return old;
      
      const updated = [...old];
      updates.forEach(({ claimId, updates: claimUpdates }) => {
        const index = updated.findIndex(claim => claim.id === claimId);
        if (index >= 0) {
          updated[index] = { ...updated[index], ...claimUpdates };
        }
      });
      return updated;
    });
  };
  
  return {
    ...query,
    refetchImmediately,
    updateLocalData,
    updateClaimLocally,
    handleStaffClaimUpdate,
    handleStaffClaimStatusUpdate,
    handleStaffClaimStageUpdate,
    handleStaffClaimBatchUpdate,
  };
}; 