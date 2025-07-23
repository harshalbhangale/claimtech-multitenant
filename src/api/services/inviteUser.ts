import api from '../index';

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
    
    const response = await api.post('/onboarding/invite/', {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Invite request successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send invite request:', error);
    throw error;
  }
}; 