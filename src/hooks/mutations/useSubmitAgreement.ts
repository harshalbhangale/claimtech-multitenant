import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveAgreementDetails } from '../../api/services/dashboard/agreementDetails';
import type { AgreementDetailsRequest } from '../../api/services/dashboard/agreementDetails';

interface SubmitAgreementParams {
  claimId: string;
  data: AgreementDetailsRequest;
}

export const useSubmitAgreement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, data }: SubmitAgreementParams) => 
      saveAgreementDetails(claimId, data),
    onSuccess: (_, { claimId }) => {
      // Invalidate claims cache to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      
      // Optionally invalidate specific claim if you have a query for it
      queryClient.invalidateQueries({ queryKey: ['claim', claimId] });
    },
    onError: (error) => {
      console.error('Failed to submit agreement:', error);
    },
  });
}; 