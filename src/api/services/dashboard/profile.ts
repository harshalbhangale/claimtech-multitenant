import api from '../../index';

export interface ProfileAddress {
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  address_line_4: string;
  address_line_5: string;
  city: string;
  postcode: string;
  country: string;
  region: string;
  provider_id: string;
  is_current: boolean;
}

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
  address: ProfileAddress;
  previous_addresses: ProfileAddress[];
  id_document: string;
  signature: string;
}

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get('api/v1/accounts/profile/');
  return response.data;
};
