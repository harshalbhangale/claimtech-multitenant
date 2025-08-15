// src/api/services/dashboard/updateSignature.ts
import api from '../../index';

export interface UpdateSignatureData {
  signature: File; 
}

// Updated interface for dashboard signature update
export interface UpdateSignatureResponse {
  message: string;
  signature_id?: string;
}

export const updateSignature = async (
  claimId: string,
  requirementId: string,
  signatureFile: File
): Promise<UpdateSignatureResponse> => {
  try {
    console.log('Updating signature:', signatureFile);
    const accessToken = localStorage.getItem('access_token');
    // Create FormData to send file
    const formData = new FormData();
    formData.append('requirement_id', requirementId);
    formData.append('signature_file', signatureFile);
    
    const response = await api.put(`/api/v1/claims/${claimId}/requirements/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      },
      timeout: 40000,
    });
    
    console.log('Signature updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update signature:', error);
    throw error;
  }
};

// Helper function to convert canvas to File
export const canvasToFile = (canvas: HTMLCanvasElement, filename: string = 'signature.png'): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], filename, { type: 'image/png' });
        resolve(file);
      } else {
        reject(new Error('Failed to create blob from canvas'));
      }
    }, 'image/png', 0.8); // adding compression to the image
  });
};