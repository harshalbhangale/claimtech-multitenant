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
  requirement_type?: 'document' | 'signature' | 'information' | 'other'; // Add type to distinguish requirement types
}

/**
 * Fetch all requirements for a specific claim
 * @param claimId - The ID of the claim
 * @returns Promise with requirements data
 */
export const fetchRequirements = async (claimId: string): Promise<Requirement[]> => {
  try {
    const response = await api.get(`/api/v1/claims/${claimId}/requirements/`);
    // Process requirements to detect signature requirements
    const requirements = response.data.map((req: Requirement) => ({
      ...req,
      requirement_type: detectRequirementType(req.requirement_reason)
    }));
    return requirements;
  } catch (error) {
    console.error('Error fetching requirements:', error);
    throw error;
  }
};

/**
 * Detect if a requirement is for signature or document upload
 * @param requirementReason - The requirement reason text
 * @returns 'signature' or 'document'
 */
const detectRequirementType = (requirementReason: string): 'document' | 'signature' => {
  const signatureKeywords = [
    'signature',
    'sign',
    'digital signature',
    'kindly send the signature',
    'kindly upload your digital signature',
    'please provide your signature',
    'Kindly provide your digital signature again.',
    'Kindly provide your signature again.',
    'Kindly provide your signature',
    'Kindly provide your digital signature',
    'Kindly send the signature',
    'Kindly upload your signature',
    'Kindly send the digital signature',
    'Kindly upload the digital signature',
  ];
  
  const lowerReason = requirementReason.toLowerCase();
  const isSignatureRequirement = signatureKeywords.some(keyword => 
    lowerReason.includes(keyword.toLowerCase())
  );
  
  console.log('Requirement detection:', {
    reason: requirementReason,
    lowerReason,
    isSignatureRequirement,
    type: isSignatureRequirement ? 'signature' : 'document'
  });
  
  return isSignatureRequirement ? 'signature' : 'document';
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