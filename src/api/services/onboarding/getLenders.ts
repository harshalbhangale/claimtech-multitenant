import api from '../../index';

export interface LenderGroup {
  id: string;
  on_display_name: string;
  other_brands: string[];
  priority: number;
}

export interface LendersResponse {
  lender_groups: LenderGroup[];
}

export const getLenders = async (): Promise<LendersResponse> => {
  try {
    const response = await api.get<LendersResponse>('api/v1/onboarding/lenders');
    return response.data;
  } catch (error) {
    console.error('Error fetching lenders:', error);
    throw error;
  }
};
