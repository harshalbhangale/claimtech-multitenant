import React, { useState ,useEffect} from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import SuccessMessage from '../Common/SuccessMessage';

import ErrorMessage from '../Common/ErrorMessage';
import { 
  verifyOtp, 
  resendOtp, 
  getOtpReference, 
  clearOtpReference,
  storeOtpReference 
} from '../../../api/services/onboarding/verifyOTP';

const OtpVerify: React.FC = () => {
  const { config } = useTenant();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpReference, setOtpReference] = useState<string | null>(null);
  const [, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load OTP reference from localStorage on component mount
  useEffect(() => {
    const reference = getOtpReference();
    if (reference) {
      setOtpReference(reference);
    } else {
      // Allow user to proceed without OTP reference
      console.log('No OTP reference found, but allowing user to continue with manual OTP entry');
      setOtpReference(null);
    }
    setIsLoading(false);
  }, [navigate]);

  // Fixed handleVerify function in OtpVerify component
  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setSuccess(null);

    try {
      // If we have an OTP reference, try to verify with the API
      if (otpReference) {
        const response = await verifyOtp(otpReference, code.trim());
        
        console.log('OTP Response:', response);
        
        // Check if response exists (successful verification)
        if (response && (response.extracted_hp_agreements !== undefined || response.agreements_count !== undefined)) {
          setSuccess('Verification successful! Redirecting...');
          
          // Store the verification results if needed
          console.log('Found agreements:', response.agreements_count);
          console.log('HP Agreements:', response.extracted_hp_agreements);
          
          // Clear the OTP reference after successful verification
          clearOtpReference();
          
          // Navigate to next step after verification
          setTimeout(() => {
            navigate('/auth/missingagreements');
          }, 1500);
        } else {
          setError('Verification failed. Please try again.');
        }
      } else {
        // No OTP reference - bypass verification and proceed directly
        console.log('No OTP reference found, bypassing verification and proceeding to missing lenders');
        setSuccess('Proceeding to next step...');
        
        // Navigate to missing lenders page after a brief delay
        setTimeout(() => {
          navigate('/auth/missingagreements');
        }, 1500);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      // If we don't have an OTP reference, bypass the error and proceed
      if (!otpReference) {
        console.log('No OTP reference - bypassing error and proceeding to missing lenders');
        setSuccess('Proceeding to next step...');
        
        setTimeout(() => {
          navigate('/auth/missingagreements');
        }, 1500);
        return;
      }
      
      // Handle different error responses for normal OTP verification
      if (error.response?.status === 400) {
        setError('Invalid or expired verification code. Please check and try again.');
      } else if (error.response?.status === 429) {
        setError('Too many attempts. Please wait before trying again.');
      } else {
        setError('Verification failed. Please check your code and try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!otpReference) {
      setError('No verification reference available. You can still enter any code to proceed.');
      return;
    }

    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await resendOtp(otpReference);
      
      // Update reference if a new one is provided
      if (response.reference && response.reference !== otpReference) {
        setOtpReference(response.reference);
        storeOtpReference(response.reference);
      }
      
      setSuccess('Verification code resent successfully!');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('OTP resend error:', error);
      
      if (error.response?.status === 429) {
        setError('Too many resend attempts. Please wait before trying again.');
      } else {
        setError('Failed to resend verification code. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };


  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
      setError(null); // Clear error when user types
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length >= 4) {
      handleVerify();
    }
  };



  return (
    <Box minH="100vh" bg="white">
      <Header />

      <Container maxW="3xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Box border="2px solid #E2E8F0" borderRadius="lg" p={6} w="full">
            <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold" mb={2}>
              Check your messages now!
            </Text>

            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Enter verification code
            </Text>
            <Input
              placeholder="Enter 6-digit code"
              value={code}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              size="lg"
              mb={6}
              bg="white"
              border="2px solid #EAECF0"
              _focus={{ 
                borderColor: config.accentColor, 
                boxShadow: `0 0 0 1px ${config.accentColor}` 
              }}
              borderRadius="md"
              textAlign="center"
              fontSize="xl"
              letterSpacing="wider"
              maxLength={6}
              disabled={isVerifying || isResending}
            />


            {error && <ErrorMessage message={error} />}

            {success && <SuccessMessage message={success} />}
            <Button
              w="full"
              bg={config.primaryColor}
              color="black"
              h="56px"
              borderRadius="full"
              _hover={{ bg: `${config.primaryColor}CC` }}
              _disabled={{ 
                opacity: 0.6, 
                cursor: 'not-allowed',
                _hover: { bg: config.primaryColor }
              }}
              fontWeight="medium"
              onClick={handleVerify}
              rightIcon={
                isVerifying ? (
                  <Spinner size="sm" />
                ) : (
                  <Text as="span" ml={1}>→</Text>
                )
              }
              disabled={isVerifying || code.length < 4}
              isLoading={isVerifying}
              loadingText="Verifying..."
            >
              {isVerifying ? 'Verifying...' : 'Verify now'}
            </Button>

            <Box mt={6}>
              <Text fontWeight="bold" fontSize="md" mb={1}>
                Didn't get a text?
              </Text>
              <Text fontSize="sm" color="gray.700" mb={2}>
                Your code will be valid for 10 minutes. If you don't get a text or it's expired you can request a new one.
              </Text>
              <Button
                variant="link"
                size="sm"
                onClick={handleResend}
                fontFamily="Poppins"
                textDecoration="underline"
                color={config.accentColor}
                fontWeight="medium"
                _hover={{ opacity: 0.8 }}
                _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
                disabled={isResending || isVerifying}
                leftIcon={isResending ? <Spinner size="xs" /> : undefined}
              >
                {isResending ? 'Resending...' : 'Resend verification code'}
              </Button>
            </Box>
          </Box>

          <SecureBar />
        </VStack>
      </Container>
    </Box>
  );
};

export default OtpVerify;
export { OtpVerify };