import api from '../index';
import { getCachedAddresses, saveAddressesToCache, cleanExpiredCache } from '../../utils/addressStorage';
import type { RawAddress } from '../../types/address';
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


