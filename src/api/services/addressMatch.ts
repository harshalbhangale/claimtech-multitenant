import api from '../index';

export interface BestMatchAddress {
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

export interface AddressMatchResponse {
  best_matches: BestMatchAddress[];
}

// Helper function for retry logic
const fetchWithRetry = async (url: string, config: any, maxRetries: number = 2): Promise<any> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await api.get(url, config);
      return response;
    } catch (error: any) {
      console.log(`Attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry on authentication errors or client errors
      if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status < 500) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const fetchUserAddresses = async (): Promise<BestMatchAddress[]> => {
  try {
    console.log('Fetching user addresses from API');
    
    // Get access token from localStorage
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      console.error('No access token found');
      throw new Error('No access token found. Please login again.');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // Increase timeout to 30 seconds for this endpoint
    };

    const response = await fetchWithRetry('/api/v1/onboarding/addresses/', config);
    
    console.log('User addresses API response:', response.data);
    console.log('Response data type:', typeof response.data);
    console.log('Is response.data an array?', Array.isArray(response.data));
    
    // Handle different possible response formats
    let addresses: BestMatchAddress[] = [];
    
    if (Array.isArray(response.data)) {
      // If response.data is directly an array of addresses
      addresses = response.data;
      console.log('Using direct array response');
    } else if (response.data.best_matches && Array.isArray(response.data.best_matches)) {
      // If response.data has a best_matches property
      addresses = response.data.best_matches;
      console.log('Using best_matches property');
    } else if (response.data.addresses && Array.isArray(response.data.addresses)) {
      // If response.data has an addresses property
      addresses = response.data.addresses;
      console.log('Using addresses property');
    } else {
      console.warn('Unexpected response format:', response.data);
      addresses = [];
    }
    
    console.log('Final addresses array:', addresses);
    console.log('Number of addresses:', addresses.length);
    
    return addresses;
  } catch (error: any) {
    console.error('Failed to fetch user addresses:', error);
    
    // Check for specific error types
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The server is taking too long to respond. Please try again.');
    } else if (error.response?.status === 401) {
      throw new Error('Session expired. Please login again.');
    } else if (error.response?.status === 404) {
      // If endpoint doesn't exist or no addresses found, return empty array
      console.log('No addresses endpoint found or no addresses available');
      return [];
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch addresses');
  }
};