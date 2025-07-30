// src/api/services/verifyOtp.ts
import api from '../../index';

export interface VerifyOtpData {
  reference: string;
  code: string;
}

export interface VerifyOtpResponse {
    extracted_hp_agreements: any[]; // Array of HP agreements found
    agreements_count: number; // Number of agreements found
  }

export interface ResendOtpData {
  reference: string;
}

export interface ResendOtpResponse {
  message: string;
  reference: string;
  code?: string; // Only for development/testing
}

/**
 * Verify OTP code with the reference received from signature submission
 */
export const verifyOtp = async (reference: string, code: string): Promise<VerifyOtpResponse> => {
  try {
    console.log('Verifying OTP:', { reference, code });
    
    const requestData: VerifyOtpData = {
      reference,
      code
    };

    const response = await api.post('/api/v1/onboarding/verify/', requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('OTP verified successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    throw error;
  }
};

/**
 * Resend OTP code using the existing reference
 */
export const resendOtp = async (reference: string): Promise<ResendOtpResponse> => {
  try {
    console.log('Resending OTP for reference:', reference);
    
    const requestData: ResendOtpData = {
      reference
    };

    const response = await api.post('/api/v1/onboarding/resend-otp/', requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('OTP resent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to resend OTP:', error);
    throw error;
  }
};

// Helper function to store OTP reference in localStorage
export const storeOtpReference = (reference: string): void => {
  try {
    localStorage.setItem('otp_reference', reference);
    console.log('OTP reference stored successfully');
  } catch (error) {
    console.error('Failed to store OTP reference:', error);
  }
};

// Helper function to get OTP reference from localStorage
export const getOtpReference = (): string | null => {
  try {
    const reference = localStorage.getItem('otp_reference');
    console.log('Retrieved OTP reference:', reference);
    return reference;
  } catch (error) {
    console.error('Failed to get OTP reference:', error);
    return null;
  }
};

// Helper function to clear OTP reference after successful verification
export const clearOtpReference = (): void => {
  try {
    localStorage.removeItem('otp_reference');
    console.log('OTP reference cleared successfully');
  } catch (error) {
    console.error('Failed to clear OTP reference:', error);
  }
};