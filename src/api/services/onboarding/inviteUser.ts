import api from '../../index';

export interface InviteUserResponse {
  message: string;
  invite_response?: {
    Info?: {
      Data?: {
        id: number;
        magic_link: string;
        qr_code: {
          link: string;
          image_tag: string;
        };
        reference: string; // This is what we need!
      };
    };
    Message?: string;
    Status?: string;
  };
  // Add other fields as needed based on actual API response
}

export const inviteUser = async (): Promise<InviteUserResponse> => {
  try {
    console.log('Sending invite request to trigger OTP');
    
    // Get access token from localStorage
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      console.error('No access token found');
      throw new Error('No access token found. Please login again.');
    }
    
    const response = await api.post('/api/v1/onboarding/invite/', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Invite request successful - full response:', response.data);
    console.log('Checking for nested reference at invite_response.Info.Data.reference');
    
    // Log the structure to help debug
    if (response.data.invite_response) {
      console.log('Found invite_response:', response.data.invite_response);
      if (response.data.invite_response.Info) {
        console.log('Found Info:', response.data.invite_response.Info);
        if (response.data.invite_response.Info.Data) {
          console.log('Found Data:', response.data.invite_response.Info.Data);
          console.log('Reference:', response.data.invite_response.Info.Data.reference);
        }
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Failed to send invite request:', error);  
    
    // Check for authentication errors
    if (error.response?.status === 401) {
      throw new Error('Session expired. Please login again.');
    }
    
    throw error;
  }
};