import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSignature } from '../../api/services/dashboard/updateSignature';

interface UseUpdateSignatureParams {
  claimId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useUpdateSignature = ({ 
  claimId, 
  onSuccess, 
  onError 
}: UseUpdateSignatureParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requirementId, signatureFile }: { requirementId: string; signatureFile: File }) => 
      updateSignature(requirementId, signatureFile),
    
    onSuccess: () => {
      // Invalidate requirements to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['requirements', claimId] });
      
      // Also invalidate claims data
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      
      onSuccess?.();
    },
    
    onError: (error) => {
      onError?.(error);
    },
  });
};