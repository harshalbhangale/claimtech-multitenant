import type { RawAddress } from '../../types/address';

export const fetchAddressesByPostcode = async (postcode: string): Promise<RawAddress[]> => {
  try {
    const res = await fetch(`/api/v1/onboarding/address-search?postcode=${postcode}`);
    if (!res.ok) throw new Error('Failed to fetch addresses');
    const data = await res.json();
    return data.addresses || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};