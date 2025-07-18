import type { RawAddress, FormattedAddress } from '../types/address';

const STORAGE_KEYS = {
  ADDRESSES: 'user_addresses',
  SELECTED_ADDRESS: 'selected_address',
  POSTCODE_CACHE: 'postcode_addresses_cache'
} as const;

export interface AddressCache {
  [postcode: string]: {
    addresses: RawAddress[];
    timestamp: number;
    expiry: number; // 24 hours in milliseconds
  };
}

export interface SelectedAddressData {
  address: FormattedAddress;
  raw: RawAddress;
  timestamp: number;
}

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Save addresses to localStorage with postcode as key
 */
export const saveAddressesToCache = (postcode: string, addresses: RawAddress[]): void => {
  try {
    const cache: AddressCache = getAddressCache();
    const now = Date.now();
    
    cache[postcode.toLowerCase()] = {
      addresses,
      timestamp: now,
      expiry: now + CACHE_DURATION
    };
    
    localStorage.setItem(STORAGE_KEYS.POSTCODE_CACHE, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to save addresses to cache:', error);
  }
};

/**
 * Get cached addresses for a postcode
 */
export const getCachedAddresses = (postcode: string): RawAddress[] | null => {
  try {
    const cache: AddressCache = getAddressCache();
    const cacheEntry = cache[postcode.toLowerCase()];
    
    if (!cacheEntry) return null;
    
    // Check if cache has expired
    if (Date.now() > cacheEntry.expiry) {
      // Remove expired entry
      delete cache[postcode.toLowerCase()];
      localStorage.setItem(STORAGE_KEYS.POSTCODE_CACHE, JSON.stringify(cache));
      return null;
    }
    
    return cacheEntry.addresses;
  } catch (error) {
    console.error('Failed to get cached addresses:', error);
    return null;
  }
};

/**
 * Get the address cache object
 */
export const getAddressCache = (): AddressCache => {
  try {
    const cacheStr = localStorage.getItem(STORAGE_KEYS.POSTCODE_CACHE);
    return cacheStr ? JSON.parse(cacheStr) : {};
  } catch (error) {
    console.error('Failed to parse address cache:', error);
    return {};
  }
};

/**
 * Save the selected address
 */
export const saveSelectedAddress = (formatted: FormattedAddress, raw: RawAddress): void => {
  try {
    const selectedData: SelectedAddressData = {
      address: formatted,
      raw,
      timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEYS.SELECTED_ADDRESS, JSON.stringify(selectedData));
  } catch (error) {
    console.error('Failed to save selected address:', error);
  }
};

/**
 * Get the selected address
 */
export const getSelectedAddress = (): SelectedAddressData | null => {
  try {
    const selectedStr = localStorage.getItem(STORAGE_KEYS.SELECTED_ADDRESS);
    return selectedStr ? JSON.parse(selectedStr) : null;
  } catch (error) {
    console.error('Failed to get selected address:', error);
    return null;
  }
};

/**
 * Clear selected address
 */
export const clearSelectedAddress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_ADDRESS);
  } catch (error) {
    console.error('Failed to clear selected address:', error);
  }
};

/**
 * Clear all address cache
 */
export const clearAddressCache = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.POSTCODE_CACHE);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_ADDRESS);
  } catch (error) {
    console.error('Failed to clear address cache:', error);
  }
};

/**
 * Clean expired entries from cache
 */
export const cleanExpiredCache = (): void => {
  try {
    const cache: AddressCache = getAddressCache();
    const now = Date.now();
    let hasExpired = false;
    
    Object.keys(cache).forEach(postcode => {
      if (now > cache[postcode].expiry) {
        delete cache[postcode];
        hasExpired = true;
      }
    });
    
    if (hasExpired) {
      localStorage.setItem(STORAGE_KEYS.POSTCODE_CACHE, JSON.stringify(cache));
    }
  } catch (error) {
    console.error('Failed to clean expired cache:', error);
  }
};
