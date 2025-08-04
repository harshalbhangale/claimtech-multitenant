// src/api/services/onboarding/login.ts
import api from '../../index';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: string;
}

export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    console.log('Logging in user:', loginData.email);
    
    const response = await api.post('/api/v1/auth/login/', loginData);
    
    const { access, refresh, user_id } = response.data;
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_id', user_id);
    
    console.log('User logged in successfully:', { user_id });
    console.log('Access Token:', access);
    console.log('Refresh Token:', refresh);

    return response.data;
  } catch (error) {
    console.error('Failed to login user:', error);
    throw error;
  }
}; 