import api from '../../index';

export interface CreditReportResponse {
  status: 'complete' | 'authentication-required';
  providerId?: string;
  searchType?: string;
  authenticationType?: string; // e.g., 'kount'
  kount?: { challengeId: string; channel?: string };
  // Some environments return "kountChallenge" instead of "kount"
  kountChallenge?: { challengeId: string };
  creditReport?: any;
  extracted_hp_agreements?: any[];
  agreements_count?: number;
}

export const startPcpCreditReport = async (sessionId: string): Promise<CreditReportResponse> => {
  try {
    const res = await api.post<CreditReportResponse>(
      '/api/v1/onboarding/checkio/pcp-credit-report/',
      { sessionId },
      { timeout: 15000 }
    );
    return res.data;
  } catch (error: any) {
    console.error('Credit report API error:', error);
    // Sanitize error for frontend consumption
    const sanitizedError = new Error(
      error.response?.status === 400 ? 'Invalid credit report request' :
      error.response?.status === 401 ? 'Credit report authentication failed' :
      error.response?.status === 429 ? 'Credit report service temporarily unavailable' :
      error.code === 'ECONNABORTED' ? 'Credit report request timed out' :
      'Credit report service unavailable'
    );
    sanitizedError.name = 'CreditReportError';
    throw sanitizedError;
  }
};

export interface ChallengeResponse {
  data: {
    status: 'complete' | 'authentication-required';
    kount?: { challengeId: string; channel: string };
    creditReport?: any;
  };
  extracted_hp_agreements?: any[];
  agreements_count?: number;
}

export const submitKountChallenge = async (challengeId: string, verificationCode: string): Promise<any> => {
  try {
    const res = await api.post<ChallengeResponse>(
      '/api/v1/onboarding/checkio/challenge/',
      { challengeId, verificationCode },
      { timeout: 15000 }
    );
    return res.data;
  } catch (error: any) {
    console.error('Kount challenge submission error:', error);
    // Sanitize error for frontend consumption
    const sanitizedError = new Error(
      error.response?.status === 400 ? 'Invalid verification code' :
      error.response?.status === 401 ? 'Challenge verification failed' :
      error.response?.status === 429 ? 'Too many verification attempts' :
      error.code === 'ECONNABORTED' ? 'Verification request timed out' :
      'Verification service unavailable'
    );
    sanitizedError.name = 'ChallengeError';
    throw sanitizedError;
  }
};

export interface ResendChallengeResponse {
  data: { status: 'resent' };
}

export const resendKountChallenge = async (challengeId: string): Promise<any> => {
  try {
    const res = await api.post<ResendChallengeResponse>(
      '/api/v1/onboarding/checkio/resend-challenge/',
      { challengeId },
      { timeout: 40000 }
    );
    return res.data;
  } catch (error: any) {
    console.error('Kount challenge resend error:', error);
    // Sanitize error for frontend consumption
    const sanitizedError = new Error(
      error.response?.status === 400 ? 'Invalid challenge request' :
      error.response?.status === 401 ? 'Challenge resend unauthorized' :
      error.response?.status === 429 ? 'Too many resend attempts' :
      error.code === 'ECONNABORTED' ? 'Resend request timed out' :
      'Resend service unavailable'
    );
    sanitizedError.name = 'ResendError';
    throw sanitizedError;
  }
};


