import api from '../../index';

export const downloadIDDocument = async (): Promise<void> => {
  try {
    const response = await api.get('api/v1/onboarding/upload-id/');
    
    if (response.data && response.data.id_document_url) {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = response.data.id_document_url;
      link.download = 'id_document.pdf'; // Default filename
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      throw new Error('No document URL found in response');
    }
  } catch (error) {
    console.error('Error downloading ID document:', error);
    throw error;
  }
};
