// src/api/services/dashboard/agreementDetails.ts
import api from '../../index';

// Type for API payload - backend expects null for missing fields
interface AgreementDetailsApiPayload {
  agreement_number: string;
  vehicle_registration: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  loan_amount: number | null;
  annual_percentage_rate: number | null;
  flat_interest_rate: number | null;
  monthly_payment: number | null;
  interest_payable: number | null;
  total_cost_of_credit: number | null;
  balloon_payment: number | null;
  contract_ongoing: boolean | null;
  start_date: string | null;
  contract_length: number | null;
  dealership_name: string | null;
}

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
  start_date?: string;
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
  start_date?: string;
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
    
    // Create complete payload with all fields, using null for missing ones (backend expects null)
    const apiPayload: AgreementDetailsApiPayload = {
      agreement_number: details.agreement_number,
      vehicle_registration: details.vehicle_registration || null,
      vehicle_make: details.vehicle_make || null,
      vehicle_model: details.vehicle_model || null,
      loan_amount: details.loan_amount || null,
      annual_percentage_rate: details.annual_percentage_rate || null,
      flat_interest_rate: details.flat_interest_rate || null,
      monthly_payment: details.monthly_payment || null,
      interest_payable: details.interest_payable || null,
      total_cost_of_credit: details.total_cost_of_credit || null,
      balloon_payment: details.balloon_payment || null,
      contract_ongoing: details.contract_ongoing || null,
      start_date: details.start_date || null,
      contract_length: details.contract_length || null,
      dealership_name: details.dealership_name || null,
    };
    
    console.log('API payload being sent:', apiPayload);
    
    const response = await api.post(`/api/v1/claims/${claimId}/agreements/`, apiPayload, {
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
