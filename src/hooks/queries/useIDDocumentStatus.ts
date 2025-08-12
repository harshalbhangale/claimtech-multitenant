import { useQuery } from '@tanstack/react-query';
import api from '../../api/index';

interface IDDocumentResponse {
  id_document_url?: string;
}

const checkIDDocumentExists = async (): Promise<boolean> => {
  try {
    const response = await api.get<IDDocumentResponse>('api/v1/onboarding/upload-id/');
    return !!(response.data && response.data.id_document_url);
  } catch (error) {
    // If there's an error (like 404), assume document doesn't exist
    return false;
  }
};

export const useIDDocumentStatus = () => {
  return useQuery({
    queryKey: ['idDocumentStatus'],
    queryFn: checkIDDocumentExists,
    retry: false, // Don't retry on failure
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
