import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadRequirementDocument } from '../../api/services/dashboard/additionalRequirement';

interface UploadDocumentParams {
  claimId: string;
  requirementId: string;
  file: File;
}

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, requirementId, file }: UploadDocumentParams) => 
      uploadRequirementDocument(claimId, requirementId, file),
    onSuccess: (_, { claimId }) => {
      // Invalidate requirements cache to show updated status
      queryClient.invalidateQueries({ 
        queryKey: ['requirements', claimId] 
      });
      
      // Optionally invalidate claims cache
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
    onError: (error) => {
      console.error('Failed to upload document:', error);
    },
  });
}; 