// src/api/services/onboarding/documentupload.ts
import api from '../../index';

export interface UploadIdResponse {
  id_document_url: string;
  document_id: string;
}

export const uploadIdDocument = async (file: File): Promise<UploadIdResponse> => {
  const formData = new FormData();
  formData.append('id_document', file);

  const response = await api.post('/api/v1/onboarding/upload-id/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};