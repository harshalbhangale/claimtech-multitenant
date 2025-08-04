import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTenant } from '../../contexts/TenantContext';
import { verifyMagicLink } from '../../api/services/onboarding/magicLink';

const MagicLogin: React.FC = () => {
  const { config } = useTenant();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setError('No magic link token found. Please try logging in again.');
          setIsVerifying(false);
          return;
        }

        console.log('Verifying magic link token:', token);
        
        // Verify the magic link token
        await verifyMagicLink(token);
        
        console.log('Magic link verification successful, redirecting to dashboard');
        
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
        
      } catch (error: any) {
        console.error('Magic link verification failed:', error);
        
        let errorMessage = 'Failed to verify magic link. Please try again.';
        
        if (error.response?.status === 400) {
          errorMessage = 'Invalid or expired magic link. Please request a new one.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Magic link not found. Please request a new one.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        setError(errorMessage);
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md" textAlign="center">
        <VStack spacing={6}>
          {isVerifying ? (
            <>
              <Spinner size="xl" color={config.accentColor} />
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Verifying your magic link...
              </Text>
              <Text fontSize="sm" color="gray.500">
                Please wait while we log you in securely.
              </Text>
            </>
          ) : error ? (
            <>
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">Verification Failed</Text>
                  <Text fontSize="sm">{error}</Text>
                </Box>
              </Alert>
              <Text fontSize="sm" color="gray.500">
                You will be redirected to the login page in a few seconds.
              </Text>
            </>
          ) : (
            <>
              <Box
                w={12}
                h={12}
                borderRadius="full"
                bg="green.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
              >
                <Text fontSize="xl" color="green.500">✓</Text>
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="green.700">
                Login Successful!
              </Text>
              <Text fontSize="sm" color="gray.500">
                Redirecting you to the dashboard...
              </Text>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default MagicLogin;
