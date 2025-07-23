// src/api/services/registerUser.ts
import api from '../index';
import type { RawAddress } from '../../types/address';

export interface RegisterUserData {
  address: RawAddress;
  first_name: string;
  last_name: string;
  middle?: string;
  dob: string; // Format: YYYY-MM-DD
  phone: string;
  email: string;
}

export interface RegisterUserResponse {
  user_id: string;
  access: string;
  refresh: string;
}

export const registerUser = async (userData: RegisterUserData): Promise<RegisterUserResponse> => {
  try {
    console.log('Registering user:', userData);
    
    const response = await api.post('/api/v1/onboarding/register/', userData);
    
    const { user_id, access, refresh } = response.data;
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_id', user_id);
    
    console.log('User registered successfully:', { user_id });
    console.log('Access Token:', access);
    console.log('Refresh Token:', refresh);

    
    return response.data;
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
};

