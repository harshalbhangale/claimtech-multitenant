import { clearAddressCache } from './addressStorage';

// Storage utilities for all onboarding steps

export interface ContactDetailsData {
  mobile: string;
  email: string;
  timestamp: number;
}

export interface LenderSelectionData {
  selectedLenders: string[];
  timestamp: number;
}

export interface UserDetailsData {
  firstName: string;
  lastName: string;
  dob: {
    day: string;
    month: string;
    year: string;
  };
  timestamp: number;
}

const STORAGE_KEYS = {
  CONTACT_DETAILS: 'onboarding_contact_details',
  LENDER_SELECTION: 'onboarding_lender_selection',
  USER_DETAILS: 'onboarding_user_details',
} as const;

// Contact Details Storage
export const saveContactDetails = (data: Omit<ContactDetailsData, 'timestamp'>): void => {
  try {
    const contactData: ContactDetailsData = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.CONTACT_DETAILS, JSON.stringify(contactData));
  } catch (error) {
    console.error('Failed to save contact details:', error);
  }
};

export const getContactDetails = (): ContactDetailsData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACT_DETAILS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get contact details:', error);
    return null;
  }
};

export const clearContactDetails = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONTACT_DETAILS);
  } catch (error) {
    console.error('Failed to clear contact details:', error);
  }
};

// Lender Selection Storage
export const saveLenderSelection = (data: Omit<LenderSelectionData, 'timestamp'>): void => {
  try {
    const lenderData: LenderSelectionData = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.LENDER_SELECTION, JSON.stringify(lenderData));
  } catch (error) {
    console.error('Failed to save lender selection:', error);
  }
};

export const getLenderSelection = (): LenderSelectionData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LENDER_SELECTION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get lender selection:', error);
    return null;
  }
};

export const clearLenderSelection = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.LENDER_SELECTION);
  } catch (error) {
    console.error('Failed to clear lender selection:', error);
  }
};

// User Details Storage
export const saveUserDetails = (data: Omit<UserDetailsData, 'timestamp'>): void => {
  try {
    const userData: UserDetailsData = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to save user details:', error);
  }
};

export const getUserDetails = (): UserDetailsData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DETAILS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get user details:', error);
    return null;
  }
};

export const clearUserDetails = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
  } catch (error) {
    console.error('Failed to clear user details:', error);
  }
};

// Clear all onboarding data
export const clearAllOnboardingData = (): void => {
  try {
    clearContactDetails();
    clearLenderSelection();
    clearUserDetails();
    // Also clear address data from the existing utility
    clearAddressCache();
  } catch (error) {
    console.error('Failed to clear all onboarding data:', error);
  }
};

// Get all onboarding data summary
export interface OnboardingDataSummary {
  contactDetails: ContactDetailsData | null;
  lenderSelection: LenderSelectionData | null;
  userDetails: UserDetailsData | null;
  hasCompleteData: boolean;
}

export const getOnboardingDataSummary = (): OnboardingDataSummary => {
  const contactDetails = getContactDetails();
  const lenderSelection = getLenderSelection();
  const userDetails = getUserDetails();
  
  return {
    contactDetails,
    lenderSelection,
    userDetails,
    hasCompleteData: !!(contactDetails && lenderSelection && userDetails)
  };
};
