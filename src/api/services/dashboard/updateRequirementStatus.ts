import api from '../../index';

export interface UpdateRequirementStatusData {
  requirement_id: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'completed';
  rejected_reason?: string;
  document_file?: File;
}

export interface UpdateRequirementStatusResponse {
  message: string;
  requirement_id?: string;
  status?: string;
}

/**
 * Update requirement status in staff portal
 * @param claimId - The ID of the claim
 * @param data - The requirement status update data
 * @returns Promise with status update response
 */
export const updateRequirementStatus = async (
  claimId: string,
  data: UpdateRequirementStatusData
): Promise<UpdateRequirementStatusResponse> => {
  try {
    console.log('Updating requirement status:', { claimId, data });
    
    // Use FormData when we have a document_file (signature), otherwise use JSON
    if (data.document_file) {
      // For signature requirements - send file as document_file
      const formData = new FormData();
      formData.append('requirement_id', data.requirement_id);
      formData.append('status', data.status);
      formData.append('document_file', data.document_file);
      
      // Only append rejected_reason if it exists and status is rejected
      if (data.rejected_reason && data.status === 'rejected') {
        formData.append('rejected_reason', data.rejected_reason);
      }
      
      const response = await api.put(`/api/v1/claims/${claimId}/requirements/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 40000,
      });
      
      console.log('Requirement status updated with file:', response.data);
      return response.data;
    } else {
      // For status-only updates (no file)
      const payload = {
        requirement_id: data.requirement_id,
        status: data.status,
        // Only include rejected_reason if it exists and status is rejected
        ...(data.rejected_reason && data.status === 'rejected' && {
          rejected_reason: data.rejected_reason
        })
      };
      
      const response = await api.put(`/api/v1/claims/${claimId}/requirements/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 40000,
      });
      
      console.log('Requirement status updated:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to update requirement status:', error);
    throw error;
  }
};