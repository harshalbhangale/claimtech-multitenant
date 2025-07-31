// src/api/services/dashboard/agreementDetails.ts
import api from '../../index';

export interface AgreementDetailsRequest {
  agreement_number: string;
  vehicle_registration?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  loan_amount?: number;
  annual_percentage_rate?: number;
  flat_interest_rate?: number;
  monthly_payment?: number;
  interest_payable?: number;
  total_cost_of_credit?: number;
  balloon_payment?: number;
  contract_ongoing?: boolean;
  start_date: string;
  contract_length?: number;
  dealership_name?: string;
}

export interface AgreementDetailsResponse {
  id: string;
  agreement_number: string;
  vehicle_registration?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  loan_amount?: number;
  annual_percentage_rate?: number;
  flat_interest_rate?: number;
  monthly_payment?: number;
  interest_payable?: number;
  total_cost_of_credit?: number;
  balloon_payment?: number;
  contract_ongoing?: boolean;
  start_date: string;
  contract_length?: number;
  dealership_name?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Save agreement details for a specific claim
 */
export const saveAgreementDetails = async (
  claimId: string, 
  details: AgreementDetailsRequest
): Promise<AgreementDetailsResponse> => {
  try {
    console.log('Saving agreement details for claim:', claimId);
    
    const response = await api.post(`/api/v1/claims/${claimId}/agreements/`, details, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Agreement details saved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to save agreement details:', error);
    throw error;
  }
};
