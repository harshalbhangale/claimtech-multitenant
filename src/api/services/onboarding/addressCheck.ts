import api from '../../index';
import { getCachedAddresses, saveAddressesToCache, cleanExpiredCache } from '../../../utils/addressStorage';
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
  // Preserve full Check.io structure so downstream can use raw fields-or-null
  checkio?: {
    reference: string | null;
    formatted: string[] | null;
    line1: string | null;
    line2: string | null;
    line3: string | null;
    line4: string | null;
    organisationName: string | null;
    subBuildingNumber: string | null;
    subBuildingName: string | null;
    buildingName: string | null;
    buildingNumber: string | null;
    thoroughfare: string | null;
    townOrCity: string | null;
    district: string | null;
    county: string | null;
    country: string | null;
    postcode: string | null;
    longitude: number | null;
    latitude: number | null;
  };
}

export interface FormattedAddress {
  id: number;
  label: string;
  lines: string;
  address_id: string;
} 

// Check.io API response interface
interface CheckIoAddress {
  reference?: string;
  formatted?: string[];
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  organisationName?: string;
  subBuildingNumber?: string;
  subBuildingName?: string;
  buildingName?: string;
  buildingNumber?: string;
  thoroughfare?: string;
  townOrCity?: string;
  district?: string;
  county?: string;
  country?: string;
  postcode?: string;
  longitude?: number;
  latitude?: number;
}

// Map Check.io address to RawAddress interface
const mapCheckIoToRawAddress = (checkIoAddress: CheckIoAddress): RawAddress => {
  return {
    address: Array.isArray(checkIoAddress.formatted) ? checkIoAddress.formatted.join(', ') : '',
    address1: checkIoAddress.line1 || '',
    address2: checkIoAddress.line2 || '',
    address3: checkIoAddress.line3 || '',
    address4: checkIoAddress.line4 || '',
    address5: '', // Not provided by Check.io
    city: checkIoAddress.townOrCity || '',
    region: checkIoAddress.county || '',
    country: checkIoAddress.country || '',
    postcode: checkIoAddress.postcode || '',
    address_id: checkIoAddress.reference || '',
    checkio: {
      reference: checkIoAddress.reference ?? null,
      formatted: checkIoAddress.formatted ?? null,
      line1: checkIoAddress.line1 ?? null,
      line2: checkIoAddress.line2 ?? null,
      line3: checkIoAddress.line3 ?? null,
      line4: checkIoAddress.line4 ?? null,
      organisationName: checkIoAddress.organisationName ?? null,
      subBuildingNumber: checkIoAddress.subBuildingNumber ?? null,
      subBuildingName: checkIoAddress.subBuildingName ?? null,
      buildingName: checkIoAddress.buildingName ?? null,
      buildingNumber: checkIoAddress.buildingNumber ?? null,
      thoroughfare: checkIoAddress.thoroughfare ?? null,
      townOrCity: checkIoAddress.townOrCity ?? null,
      district: checkIoAddress.district ?? null,
      county: checkIoAddress.county ?? null,
      country: checkIoAddress.country ?? null,
      postcode: checkIoAddress.postcode ?? null,
      longitude: (typeof checkIoAddress.longitude === 'number') ? checkIoAddress.longitude : null,
      latitude: (typeof checkIoAddress.latitude === 'number') ? checkIoAddress.latitude : null,
    },
  };
};

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
    const res = await api.post('/api/v1/onboarding/checkio/postcode-lookup/', {
      postcode: postcode
    });
    const checkIoAddresses = res.data.data.addresses || [];
    
    // Map Check.io addresses to RawAddress format
    const addresses = checkIoAddresses.map(mapCheckIoToRawAddress);
    
    // Save to cache for future use
    saveAddressesToCache(postcode, addresses);
    
    return addresses;
  } catch (err) {
    console.error('Failed to fetch addresses:', err);
    return [];
  }
};


