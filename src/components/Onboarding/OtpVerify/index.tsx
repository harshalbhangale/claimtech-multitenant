import React, { useState ,useEffect, useRef } from 'react';
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
import { submitKountChallenge, resendKountChallenge } from '../../../api/services/onboarding/checkio';
import { getChallengeData, clearChallengeData } from '../../../utils/checkioStorage';

const OtpVerify: React.FC = () => {
  const { config } = useTenant();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpReference, setOtpReference] = useState<string | null>(null);
  const [challengeData, setChallengeData] = useState<any>(null);
  const [isKountChallenge, setIsKountChallenge] = useState(false);
  const [, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Resend cooldown state (seconds)
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const cooldownTimerRef = useRef<number | null>(null);
  const RESEND_COOLDOWN_MS = 60 * 1000;
  const RESEND_KEY = 'otp_resend_available_at';

  const clearCooldownTimer = () => {
    if (cooldownTimerRef.current) {
      window.clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  };

  const startCooldown = (durationMs = RESEND_COOLDOWN_MS) => {
    const availableAt = Date.now() + durationMs;
    sessionStorage.setItem(RESEND_KEY, String(availableAt));
    setResendCooldown(Math.ceil(durationMs / 1000));
    clearCooldownTimer();
    cooldownTimerRef.current = window.setInterval(() => {
      const remainingMs = availableAt - Date.now();
      if (remainingMs <= 0) {
        clearCooldownTimer();
        setResendCooldown(0);
        sessionStorage.removeItem(RESEND_KEY);
      } else {
        setResendCooldown(Math.ceil(remainingMs / 1000));
      }
    }, 1000);
  };

  // Load OTP reference and challenge data on component mount
  useEffect(() => {
    // Check for Kount challenge data first
    const storedChallengeData = getChallengeData();
    if (storedChallengeData) {
      console.log('Found Kount challenge data:', storedChallengeData);
      setChallengeData(storedChallengeData);
      setIsKountChallenge(true);
    } else {
      // Check for regular OTP reference
      const reference = getOtpReference();
      if (reference) {
        setOtpReference(reference);
        setIsKountChallenge(false);
      } else {
        // Allow user to proceed without OTP reference
        console.log('No OTP reference found, but allowing user to continue with manual OTP entry');
        setOtpReference(null);
        setIsKountChallenge(false);
      }
    }
    setIsLoading(false);
    // Initialize resend cooldown from sessionStorage
    const availableAtStr = sessionStorage.getItem(RESEND_KEY);
    const availableAt = availableAtStr ? parseInt(availableAtStr, 10) : 0;
    if (availableAt && availableAt > Date.now()) {
      const remaining = availableAt - Date.now();
      startCooldown(remaining);
    }
    return () => clearCooldownTimer();
  }, [navigate]);

  // Verify: allow any OTP to proceed; show success only when backend confirms
  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setSuccess(null);

    try {
      if (isKountChallenge && challengeData?.challengeId) {
        let success = false;
        try {
          const controller = new AbortController();
          const timeout = window.setTimeout(() => controller.abort(), 15000);
          const resp = await submitKountChallenge(challengeData.challengeId, code.trim());
          window.clearTimeout(timeout);
          success = resp?.data?.status === 'complete';
        } catch (e: any) {
          // Treat timeouts/network errors as non-fatal; allow proceed
          success = false;
        }

        if (success) {
          setSuccess('Verification successful! Redirecting...');
          clearChallengeData();
          setTimeout(() => navigate('/auth/missingagreements'), 1000);
        } else {
          clearChallengeData();
          navigate('/auth/missingagreements');
        }
        return;
      }

      if (otpReference) {
        let success = false;
        try {
          const resp = await verifyOtp(otpReference, code.trim());
          success = !!(resp && (resp.extracted_hp_agreements !== undefined || resp.agreements_count !== undefined));
        } catch {
          success = false;
        }

        if (success) {
          setSuccess('Verification successful! Redirecting...');
          clearOtpReference();
          setTimeout(() => navigate('/auth/missingagreements'), 1000);
        } else {
          navigate('/auth/missingagreements');
        }
        return;
      }

      // No challenge/reference: proceed
      navigate('/auth/missingagreements');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    // If kount challenge, call resend challenge endpoint
    if (isKountChallenge && challengeData?.challengeId) {
      try {
        setIsResending(true);
        setError(null);
        setSuccess(null);
        const res = await resendKountChallenge(challengeData.challengeId);
        if (res?.data?.status === 'resent') {
          setSuccess('Verification code resent successfully!');
          startCooldown();
        } else {
          setSuccess('If the code hasn\'t arrived yet, please try again shortly.');
        }
      } catch (e: any) {
        if (e?.response?.status === 402) {
          setError('Cannot resend at the moment (no credits).');
        } else if (e?.response?.status === 422) {
          setError('Too many attempts. Please wait before trying again.');
        } else {
          setError('Failed to resend verification code. Please try again.');
        }
      } finally {
        setIsResending(false);
      }
      return;
    }

    // Legacy path (non-kount): keep existing behavior
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
      startCooldown();
      
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
              {isKountChallenge 
                ? `Enter verification code sent to your ${challengeData?.channel || 'device'}`
                : 'Enter verification code'
              }
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
                Didn't get a code?
              </Text>
              <Text fontSize="sm" color="gray.700" mb={2}>
                {isKountChallenge
                  ? 'We can resend the SMS to your device.'
                  : 'Your code will be valid for 10 minutes. If it hasn\'t arrived you can request a new one.'}
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
                disabled={isResending || isVerifying || resendCooldown > 0}
                leftIcon={isResending ? <Spinner size="xs" /> : undefined}
              >
                {isResending ? 'Resending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification code'}
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