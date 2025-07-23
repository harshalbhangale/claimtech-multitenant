// src/api/services/submitSignature.ts
import api from '../index';


export interface SubmitSignatureData {
  signature: File; 
}

// Updated interface in submitSignature.ts
export interface SubmitSignatureResponse {
  message: string;
  signature_id?: string;
}
//   invite_response?: {
//     Info?: {
//       Data?: {
//         id: number;
//         magic_link: string;
//         qr_code: {
//           link: string;
//           image_tag: string;
//         };
//         reference: string; // This is what we need!
//       };
//     };
//     Message?: string;
//     Status?: string;
//   };
// }

export const submitSignature = async (signatureFile: File): Promise<SubmitSignatureResponse> => {
  try {
    console.log('Submitting signature:', signatureFile);
    const accessToken = localStorage.getItem('access_token');
    // Create FormData to send file
    const formData = new FormData();
    formData.append('signature', signatureFile);
    
    const response = await api.post('/api/v1/onboarding/upload-signature/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      },
      timeout: 40000,
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
    }, 'image/png',0.8); // adding compression to the image
  });
};