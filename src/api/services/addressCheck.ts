import api from '../index';
import { getCachedAddresses, saveAddressesToCache, cleanExpiredCache } from '../../utils/addressStorage';
export interface RawAddress {
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
}

export interface FormattedAddress {
  id: number;
  label: string;
  lines: string;
  address_id: string;
} 

export const fetchAddressesByPostcode = async (postcode: string): Promise<RawAddress[]> => {
  // Clean expired cache entries first
  cleanExpiredCache();  
  // Check if we have cached addresses for this postcode
  const cachedAddresses = getCachedAddresses(postcode);
  if (cachedAddresses) {
    console.log('Using cached addresses for postcode:', postcode);
    return cachedAddresses;
  }
  try {
    console.log('Fetching addresses from API for postcode:', postcode);
    const res = await api.get(`/api/v1/onboarding/address-search?postcode=${postcode}`);
    const addresses = res.data.addresses || [];
    // Save to cache for future use
    saveAddressesToCache(postcode, addresses);
    
    return addresses;
  } catch (err) {
    console.error('Failed to fetch addresses:', err);
    return [];
  }
};


