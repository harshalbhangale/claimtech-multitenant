// src/api/services/submitAddresses.ts
import api from '../../index';
import type { BestMatchAddress } from './addressMatch';

export interface SubmitAddressRequest {
  addresses: {
    address: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    address5: string;
    city: string;
    region: string;
    country: string;
    postcode: string;
    address_id: string;
  }[];
}

export interface SubmitAddressResult {
  address_id: string;
  status: string; // "added" or other status
}

export interface SubmitAddressResponse {
  results: SubmitAddressResult[];
}

export const submitAddresses = async (addresses: BestMatchAddress[]): Promise<SubmitAddressResponse> => {
  try {
    console.log('Submitting addresses to API:', addresses);
    
    // Get access token from localStorage
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      console.error('No access token found');
      throw new Error('No access token found. Please login again.');
    }

    // Prepare request data
    const requestData: SubmitAddressRequest = {
      addresses: addresses.map(addr => ({
        address: addr.address || '',
        address1: addr.address1 || '',
        address2: addr.address2 || '',
        address3: addr.address3 || '',
        address4: addr.address4 || '',
        address5: addr.address5 || '',
        city: addr.city || '',
        region: addr.region || '',
        country: addr.country || '',
        postcode: addr.postcode || '',
        address_id: addr.address_id,
      }))
    };

    console.log('Request data:', requestData);

    const response = await api.post<SubmitAddressResponse>('/api/v1/onboarding/addresses/', requestData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });
    
    console.log('Address submission successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to submit addresses:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');
      throw new Error('Session expired. Please login again.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid address data. Please check your addresses.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to submit addresses');
  }
};