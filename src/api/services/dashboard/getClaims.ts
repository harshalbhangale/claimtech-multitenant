// src/api/services/dashboard/getClaims.ts
import api from '../../index';

export interface Claim {
  id: string;
  status: string;
  lender: string;
  created_at: string;
  updated_at: string;
  agreements: any[];
  lender_name: string;
}

export const getClaims = async (): Promise<Claim[]> => {
  const response = await api.get('/api/v1/claims/', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};