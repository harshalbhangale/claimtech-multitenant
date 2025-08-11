import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRequirementStatus, type UpdateRequirementStatusData } from '../../api/services/dashboard/updateRequirementStatus';

interface UseUpdateRequirementStatusParams {
  claimId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useUpdateRequirementStatus = ({ 
  claimId, 
  onSuccess, 
  onError 
}: UseUpdateRequirementStatusParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRequirementStatusData) => 
      updateRequirementStatus(claimId, data),
    
    onMutate: async (variables) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['requirements', claimId] });

      // Snapshot the previous value
      const previousRequirements = queryClient.getQueryData(['requirements', claimId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['requirements', claimId], (old: any[]) => {
        if (!old) return old;
        
        return old.map(req => 
          req.id === variables.requirement_id 
            ? { ...req, status: variables.status }
            : req
        );
      });

      // Return a context object with the snapshotted value
      return { previousRequirements };
    },
    
    onError: (err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousRequirements) {
        queryClient.setQueryData(['requirements', claimId], context.previousRequirements);
      }
      onError?.(err);
    },
    
    onSuccess: (_data, _variables) => {
      // Invalidate and refetch requirements to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['requirements', claimId] });
      
      // Also invalidate claims data in case it affects claim status
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      
      onSuccess?.();
    },
  });
};