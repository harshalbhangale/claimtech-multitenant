import api from '../../index';

interface Requirement {
  id: string;
  claim: string;
  requirement_reason: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  rejected_reason: string | null;
  document: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all requirements for a specific claim
 * @param claimId - The ID of the claim
 * @returns Promise with requirements data
 */
export const fetchRequirements = async (claimId: string): Promise<Requirement[]> => {
  try {
    const response = await api.get(`/api/v1/claims/${claimId}/requirements/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching requirements:', error);
    throw error;
  }
};

/**
 * Upload a document for a specific requirement
 * @param claimId - The ID of the claim
 * @param requirementId - The ID of the requirement
 * @param file - The file to upload
 * @returns Promise with upload response
 */
export const uploadRequirementDocument = async (
  claimId: string,
  requirementId: string,
  file: File
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('requirement_id', requirementId);
    formData.append('document_file', file);
    
    const response = await api.put(`/api/v1/claims/${claimId}/requirements/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export type { Requirement };