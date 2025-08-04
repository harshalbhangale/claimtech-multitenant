// src/api/services/onboarding/magicLink.ts
import api from '../../index';

export interface SendMagicLinkRequest {
  email: string;
}

export interface SendMagicLinkResponse {
  magic_link: string;
}

export interface VerifyMagicLinkResponse {
  tokens: {
    refresh: string;
    access: string;
  };
  user_id: string;
}

// Send magic link to user's email
export const sendMagicLink = async (email: string): Promise<SendMagicLinkResponse> => {
  try {
    console.log('Sending magic link to:', email);
    
    const formData = new FormData();
    formData.append('email', email);
    
    const response = await api.post('/api/v1/accounts/magic-link/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Magic link sent successfully');
    return response.data;
  } catch (error) {
    console.error('Failed to send magic link:', error);
    throw error;
  }
};

// Verify magic link token and get user tokens
export const verifyMagicLink = async (token: string): Promise<VerifyMagicLinkResponse> => {
  try {
    console.log('Verifying magic link token');
    
    const response = await api.get(`/api/v1/accounts/magic-link/?token=${token}`);
    
    const { tokens, user_id } = response.data;
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user_id', user_id);
    
    console.log('Magic link verified successfully:', { user_id });
    console.log('Access Token:', tokens.access);
    console.log('Refresh Token:', tokens.refresh);

    return response.data;
  } catch (error) {
    console.error('Failed to verify magic link:', error);
    throw error;
  }
}; 