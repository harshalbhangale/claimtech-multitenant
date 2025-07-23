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

export const fetchUserAddresses = async (): Promise<BestMatchAddress[]> => {
  try {
    console.log('Fetching user addresses from API');
    const response = await api.get<AddressMatchResponse>('/onboarding/addresses/');
    return response.data.best_matches || [];
  } catch (error) {
    console.error('Failed to fetch user addresses:', error);
    return [];
  }
};
