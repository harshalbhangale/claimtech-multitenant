// src/utils/transformOnboardingData.ts
import type { RegisterUserData } from '../api/services/onboarding/registerUser';
import { 
  getContactDetails, 
  getUserDetails,
  getLenderSelection
} from './onboardingStorage';
import { getSelectedAddress } from './addressStorage';

export const transformOnboardingDataForRegistration = (): RegisterUserData | null => {
  try {
    // Get all onboarding data from localStorage
    const contactDetails = getContactDetails();
    const userDetails = getUserDetails();
    const selectedAddress = getSelectedAddress();
    const lenderSelection = getLenderSelection();

    console.log('Contact Details:', contactDetails);
    console.log('User Details:', userDetails);
    console.log('Selected Address:', selectedAddress);
    console.log('Lender Selection:', lenderSelection);

    if (!contactDetails || !userDetails || !selectedAddress) {
      console.error('Missing required onboarding data');
      return null;
    }

    // Format date of birth to YYYY-MM-DD
    const formatDob = (dob: { day: string; month: string; year: string }): string => {
      const day = dob.day.padStart(2, '0');
      const month = dob.month.padStart(2, '0');
      return `${dob.year}-${month}-${day}`;
    };

    // Format phone number (ensure it starts with country code)
    const formatPhone = (phone: string): string => {
      // Remove all non-digit characters
      const cleaned = phone.replace(/\D/g, '');
      
      // If it starts with 07, replace with 447
      if (cleaned.startsWith('07')) {
        return `44${cleaned.substring(1)}`;
      }
      
      // If it starts with +44, remove the +
      if (cleaned.startsWith('44')) {
        return cleaned;
      }
      
      // If it starts with 0, replace with 44
      if (cleaned.startsWith('0')) {
        return `44${cleaned.substring(1)}`;
      }
      
      return cleaned;
    };

    // Get all selected lender IDs (or empty array if none selected)
    const lenderIds = lenderSelection?.selectedLenders || [];
    console.log('Lender selection from storage:', lenderSelection);
    console.log('Extracted lender IDs:', lenderIds);
    
    // Validate lender IDs are in UUID format
    const validLenderIds = lenderIds.filter(id => 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    );
    
    if (validLenderIds.length !== lenderIds.length) {
      console.warn('Some lender IDs are not in valid UUID format:', {
        original: lenderIds,
        valid: validLenderIds
      });
    }

    const registrationData: RegisterUserData = {
      address: selectedAddress.raw,
      first_name: userDetails.firstName.trim(),
      last_name: userDetails.lastName.trim(),
      middle: '', // Optional field
      dob: formatDob(userDetails.dob),
      phone: formatPhone(contactDetails.mobile),
      email: contactDetails.email.trim(),
      lenders: validLenderIds
    };

    console.log('Transformed onboarding data:', registrationData);
    return registrationData;
  } catch (error) {
    console.error('Error transforming onboarding data:', error);
    return null;
  }
};