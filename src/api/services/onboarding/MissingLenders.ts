// src/api/services/CheckLenders.ts
import api from '../../index';

export interface LenderClaim {
  id: string;
  status: string;
  lender: string;
  created_at: string;
  updated_at: string;
  agreements: any[];
  lender_name: string;
}

export interface AddLendersRequest {
  lenders: string[];
}

export interface AddLendersResponse {
  id: string;
  status: string;
  lender: string;
  created_at: string;
  updated_at: string;
  agreements: any[];
  lender_name: string;
}

/**
 * Get user's existing lender claims from the database
 */
export const getLenderClaims = async (): Promise<LenderClaim[]> => {
  try {
    console.log('Fetching lender claims...');
    
    const response = await api.get('/api/v1/claims/', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Lender claims fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch lender claims:', error);
    throw error;
  }
};

/**
 * Add new lenders to user's claims
 */
export const addLendersToClaims = async (lenderIds: string[]): Promise<AddLendersResponse[]> => {
  try {
    console.log('Adding lenders to claims:', lenderIds);
    
    const requestData: AddLendersRequest = {
      lenders: lenderIds
    };

    const response = await api.post('/api/v1/claims/', requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Lenders added to claims successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to add lenders to claims:', error);
    throw error;
  }
}; 