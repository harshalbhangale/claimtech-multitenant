// Storage utilities for signature step

export interface SignatureData {
  signatureDataUrl: string;
  timestamp: number;
  isAgreed: boolean;
}

const STORAGE_KEY = 'onboarding_signature';

/**
 * Save signature data to localStorage
 */
export const saveSignature = (signatureDataUrl: string): void => {
  try {
    const signatureData: SignatureData = {
      signatureDataUrl,
      timestamp: Date.now(),
      isAgreed: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signatureData));
  } catch (error) {
    console.error('Failed to save signature:', error);
  }
};

/**
 * Get saved signature data
 */
export const getSavedSignature = (): SignatureData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get saved signature:', error);
    return null;
  }
};

/**
 * Clear saved signature
 */
export const clearSignature = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear signature:', error);
  }
};

/**
 * Check if signature exists and is valid
 */
export const hasValidSignature = (): boolean => {
  const signature = getSavedSignature();
  return !!(signature && signature.signatureDataUrl && signature.isAgreed);
};
