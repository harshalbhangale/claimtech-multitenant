// src/api/services/registerUser.ts
import api from '../../index';
import type { RawAddress } from './addressCheck';

// Backend now expects Check.io-style address structure at `address`
export interface RegisterUserData {
  address: RawAddress; // will be transformed before sending
  first_name: string;
  last_name: string;
  middle?: string;
  dob: string; 
  phone: string;
  email: string;
  lenders: string[];
}

export interface RegisterUserResponse {
  user_id: string;
  access: string;
  refresh: string;
}

export const registerUser = async (userData: RegisterUserData): Promise<RegisterUserResponse> => {
  try {
    // Transform strictly from raw.checkio fields (or nulls) – no heuristics
    const toCheckioAddress = (raw: RawAddress) => {
      const c = (raw as any).checkio || {};
      const ns = (v: any) => (v === undefined ? null : v);
      const upperNoSpace = (v: any) => (typeof v === 'string' ? v.replace(/\s+/g, '').toUpperCase() : null);
      return {
        reference: ns(c.reference) ?? (raw.address_id ?? null),
        formatted: Array.isArray(c.formatted) ? c.formatted : null,
        line1: ns(c.line1),
        line2: ns(c.line2),
        line3: ns(c.line3),
        line4: ns(c.line4),
        organisationName: ns(c.organisationName),
        subBuildingNumber: ns(c.subBuildingNumber),
        subBuildingName: ns(c.subBuildingName),
        buildingName: ns(c.buildingName),
        buildingNumber: ns(c.buildingNumber),
        thoroughfare: ns(c.thoroughfare),
        townOrCity: ns(c.townOrCity) ?? (raw.city ?? null),
        district: ns(c.district) ?? (raw.city ?? null),
        county: ns(c.county) ?? (raw.region ?? null),
        country: ns(c.country) ?? (raw.country ?? null),
        postcode: upperNoSpace(c.postcode) ?? upperNoSpace(raw.postcode) ?? null,
        longitude: typeof c.longitude === 'number' ? c.longitude : null,
        latitude: typeof c.latitude === 'number' ? c.latitude : null,
      };
    };

    const payload = {
      ...userData,
      address: toCheckioAddress(userData.address),
    };

    console.log('Registering user (transformed):', payload);
    
    const response = await api.post('/api/v1/onboarding/register/', payload);
    
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

