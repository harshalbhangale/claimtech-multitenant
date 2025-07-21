// src/utils/transformOnboardingData.ts
import type { RegisterUserData } from '../api/services/registerUser';
import { 
  getContactDetails, 
  getUserDetails
} from './onboardingStorage';
import { getSelectedAddress } from './addressStorage';

export const transformOnboardingDataForRegistration = (): RegisterUserData | null => {
  try {
    // Get all onboarding data from localStorage
    const contactDetails = getContactDetails();
    const userDetails = getUserDetails();
    const selectedAddress = getSelectedAddress();

    console.log('Contact Details:', contactDetails);
    console.log('User Details:', userDetails);
    console.log('Selected Address:', selectedAddress);

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

    const registrationData: RegisterUserData = {
      address: selectedAddress.raw,
      first_name: userDetails.firstName.trim(),
      last_name: userDetails.lastName.trim(),
      middle: '', // Optional field
      dob: formatDob(userDetails.dob),
      phone: formatPhone(contactDetails.mobile),
      email: contactDetails.email.trim()
    };

    console.log('Transformed onboarding data:', registrationData);
    return registrationData;
  } catch (error) {
    console.error('Error transforming onboarding data:', error);
    return null;
  }
};