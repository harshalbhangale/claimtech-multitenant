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
  // Normalized, more granular type derived from backend field (if present) or reason text
  requirement_type?:
    | 'signature'
    | 'previous_address'
    | 'previous_name'
    | 'id_document'
    | 'other';
}

/**
 * Fetch all requirements for a specific claim
 * @param claimId - The ID of the claim
 * @returns Promise with requirements data
 */
export const fetchRequirements = async (claimId: string): Promise<Requirement[]> => {
  try {
    const response = await api.get(`/api/v1/claims/${claimId}/requirements/`);
    // Process requirements to detect granular requirement types
    const requirements = response.data.map((req: any) => {
      // Prefer backend-provided type if available
      const backendType: string | undefined = req?.requirement_type;
      const normalized: Requirement['requirement_type'] = normalizeRequirementType(
        backendType,
        req?.requirement_reason || ''
      );
      return {
        ...req,
        requirement_type: normalized,
        backend_type: backendType,
      } as Requirement;
    });
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
const normalizeRequirementType = (
  backendType: string | undefined,
  requirementReason: string
): Requirement['requirement_type'] => {
  const lowerType = (backendType || '').toLowerCase();
  if (
    lowerType === 'signature' ||
    lowerType === 'previous_address' ||
    lowerType === 'previous_name' ||
    lowerType === 'name_change' ||
    lowerType === 'id_document'
  ) {
    // Normalize name_change to previous_name
    if (lowerType === 'name_change') {
      return 'previous_name' as Requirement['requirement_type'];
    }
    return lowerType as Requirement['requirement_type'];
  }

  // Fallback to reason-text detection when backend type is missing
  const reason = (requirementReason || '').toLowerCase();

  const keywordGroups: Array<{ type: Requirement['requirement_type']; keywords: string[] }> = [
    {
      type: 'signature',
      keywords: [
        'signature',
        'sign',
        'digital signature',
        'upload your signature',
        'send the signature',
      ],
    },
    {
      type: 'previous_address',
      keywords: [
        'previous address',
        'prior address',
        'old address',
        'address history',
      ],
    },
    {
      type: 'previous_name',
      keywords: [
        'previous name',
        'former name',
        'maiden name',
        'name change',
      ],
    },
    {
      type: 'id_document',
      keywords: [
        'id document',
        'identification',
        'passport',
        'driving licence',
        'driver’s license',
        "driver's license",
        'identity card',
      ],
    },
  ];

  for (const group of keywordGroups) {
    if (group.keywords.some((k) => reason.includes(k))) {
      return group.type;
    }
  }

  return 'other';
};

/**
 * Upload a document for a specific requirement
 * @param claimId - The ID of the claim
 * @param requirementId - The ID of the requirement
 * @param file - The file to upload
 * @param fileFieldName - The field name for the file in the upload form
 * @returns Promise with upload response
 */
export const uploadRequirementDocument = async (
  claimId: string,
  requirementId: string,
  file: File,
  fileFieldName: 'document_file' | 'id_document' = 'document_file'
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('requirement_id', requirementId);
    formData.append(fileFieldName, file);
    
    // For FormData uploads, we need to remove the Content-Type header
    // so the browser can set it automatically with the correct boundary
    const response = await api.put(`/api/v1/claims/${claimId}/requirements/`, formData, {
      headers: {
        'Content-Type': undefined, // Remove the default Content-Type header
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export type { Requirement };