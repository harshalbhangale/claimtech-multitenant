// src/api/services/submitSignature.ts
import api from '../index';

export interface SubmitSignatureData {
  signature: File; 
}

export interface SubmitSignatureResponse {
  message: string;
  signature_id?: string;
}

export const submitSignature = async (signatureFile: File): Promise<SubmitSignatureResponse> => {
  try {
    console.log('Submitting signature:', signatureFile);
    
    // Create FormData to send file
    const formData = new FormData();
    formData.append('signature', signatureFile);
    
    const response = await api.post('/api/v1/onboarding/invite/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Signature submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to submit signature:', error);
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
    }, 'image/png');
  });
};