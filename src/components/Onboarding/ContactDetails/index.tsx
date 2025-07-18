import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Image,
  InputGroup,
  InputRightElement,
  Link,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { ProgressBar } from '../Common/ProgressBar';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import NextButton from '../../Onboarding/Common/NextButton';
import Trustpilot from '../Common/Trustpilot';
import { saveContactDetails, getContactDetails } from '../../../utils/onboardingStorage';
import { useAutoSave } from '../../../hooks/useAutoSave';

const ContactDetails: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ mobile: false, email: false });

  // Load saved contact details on component mount
  useEffect(() => {
    const savedContactDetails = getContactDetails();
    if (savedContactDetails) {
      setMobile(savedContactDetails.mobile);
      setEmail(savedContactDetails.email);
    }
  }, []);

  // Auto-save contact details as user types (with validation)
  useAutoSave(
    { mobile: mobile.trim(), email: email.trim() },
    (data) => {
      // Only save if both fields have some content
      if (data.mobile && data.email) {
        saveContactDetails(data);
      }
    },
    2000 // Save after 2 seconds of inactivity
  );

  // Validation functions
  const validateMobile = (value: string) => {
    if (!value.trim()) return 'Mobile number is required';
    if (!/^(07|\+447)[0-9]{9}$/.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid UK mobile number';
    }
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email address is required';
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const mobileError = touched.mobile ? validateMobile(mobile) : '';
  const emailError = touched.email ? validateEmail(email) : '';

  const handleNext = () => {
    // Mark all fields as touched to show validation errors
    setTouched({ mobile: true, email: true });
    
    // Only proceed if there are no validation errors
    if (!validateMobile(mobile) && !validateEmail(email)) {
      // Save contact details to localStorage
      saveContactDetails({
        mobile: mobile.trim(),
        email: email.trim()
      });
      
      navigate('/auth/signature');
    }
  };

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Progress */}
          <ProgressBar currentStep={4} totalSteps={4} />

          {/* Card */}
          <Box border="2px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            {/* Heading */}
            <Text fontSize={{ base: 'xl', md: 'xl' }} fontWeight="bold" mb={6} color="gray.900">
              Where should we send your compensation details?
            </Text>
            <VStack spacing={4} align="stretch" mb={4}>
              {/* Mobile Number Input */}
              <FormControl isInvalid={!!mobileError}>
                <InputGroup size="lg">
                  <Input
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, mobile: true }))}
                    bg="white"
                    border="2px solid"
                    borderColor={mobileError ? "red.300" : "#EAECF0"}
                    borderRadius="md"
                    height="56px"
                    pr="70px" // leave space for image
                    _focus={{ borderColor: mobileError ? "red.300" : config.accentColor, boxShadow: mobileError ? `0 0 0 2px #FED7D7` : `0 0 0 2px ${config.accentColor}` }}
                    fontSize="md"
                    fontFamily="Poppins"
                  />
                  <InputRightElement width="84px" pr={4}>
                    <Image
                      src="/icons/secured.png" // Make sure this file exists
                      alt="Website Secured"
                      height="48px"
                      objectFit="contain"
                    />
                  </InputRightElement>
                </InputGroup>
                {mobileError && <FormErrorMessage fontFamily="Poppins">{mobileError}</FormErrorMessage>}
              </FormControl>

              {/* Email Input */}
              <FormControl isInvalid={!!emailError}>
                <InputGroup size="lg">
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    bg="white"
                    border="2px solid"
                    borderColor={emailError ? "red.300" : "#EAECF0"}
                    borderRadius="md"
                    height="56px"
                    pr="70px"
                    _focus={{ borderColor: emailError ? "red.300" : config.accentColor, boxShadow: emailError ? `0 0 0 2px #FED7D7` : `0 0 0 1px ${config.accentColor}` }}
                    fontSize="md"
                    fontFamily="Poppins"
                  />
                  <InputRightElement width="84px" pr={4}>
                    <Image
                      src="/icons/secured.png"
                      alt="Website Secured"
                      height="36px"
                      objectFit="contain"
                    />
                  </InputRightElement>
                </InputGroup>
                {emailError && <FormErrorMessage fontFamily="Poppins">{emailError}</FormErrorMessage>}
              </FormControl>
            </VStack>
            {/* Next Step Button */}
            <NextButton onClick={handleNext} />

            {/* Trustpilot */}
            <Trustpilot size="md"/>

            {/* Disclaimer */}
            <Text fontSize="xs" color="black" textAlign="left" fontWeight="semibold" mt={6} fontFamily="Poppins">
              By clicking 'Next step' you agree to Solvo Solutions Ltd T/A Resolve My Claim's{' '}
              <Link href="/privacy" color={config.accentColor} textDecoration="underline">
                Privacy Policy
              </Link>{' '}
              and to be contacted by email, SMS and phone to complete your claims
            </Text>
          </Box>

          <Box w="full" maxW={{ base: 'full', md: '2xl' }}>
            <SecureBar />
          </Box>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};

export default ContactDetails;
export { ContactDetails }; 