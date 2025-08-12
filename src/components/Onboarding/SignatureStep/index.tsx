import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  HStack,
  Flex,
  Button as ChakraButton,
} from '@chakra-ui/react';
// @ts-ignore - library lacks type definitions
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import Button from '../Common/CustomButton';

import { saveSignature, clearSignature } from '../../../utils/signatureStorage';
import { submitSignature, canvasToFile } from '../../../api/services/onboarding/submitSignature';
import { ensureCheckioScript } from '../../../utils/checkioFingerprint';
import { startPcpCreditReport } from '../../../api/services/onboarding/checkio';
import { storeChallengeData } from '../../../utils/checkioStorage';
import { getLenderSelection } from '../../../utils/onboardingStorage';
import Trustpilot from '../Common/Trustpilot';

const SignatureStep: React.FC = () => {
  const sigCanvasRef = useRef<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { config } = useTenant();
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 200 });
  const [, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [claimAmount, setClaimAmount] = useState<string>('£6,427*');

  // Calculate responsive canvas dimensions
  const updateCanvasDimensions = () => {
    if (canvasContainerRef.current) {
      const containerWidth = canvasContainerRef.current.offsetWidth;
      const aspectRatio = 4; 
      const height = Math.max(150, Math.min(200, containerWidth / aspectRatio));
      const width = containerWidth;
      
      setCanvasDimensions({ width, height });
    }
  };

  // Handle window resize
  useEffect(() => {
    updateCanvasDimensions();
    
    const handleResize = () => {
      updateCanvasDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate claim amount based on selected lenders
  useEffect(() => {
    const lenderSelection = getLenderSelection();
    const selectedLenderCount = lenderSelection?.selectedLenders?.length || 0;
    
    if (selectedLenderCount > 0) {
      const calculatedAmount = selectedLenderCount * 2976;
      setClaimAmount(`£${calculatedAmount.toLocaleString()}*`);
    } else {
      setClaimAmount('£6,427*'); // Default fallback
    }
  }, []);

  // Clear signature on component mount (fresh start on page refresh)
  useEffect(() => {
    // Clear any saved signature on page refresh
    clearSignature();
    
    // Ensure canvas is clear
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
    setHasSignature(false);

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle when user starts drawing (immediately hide placeholder)
  const handleSignatureBegin = () => {
    setHasSignature(true);
  };

  // Track signature changes with debouncing
  const handleSignatureChange = () => {
    if (sigCanvasRef.current) {
      const isEmpty = sigCanvasRef.current.isEmpty();
      setHasSignature(!isEmpty);
      
      // Auto-save signature if not empty with debouncing
      if (!isEmpty) {
        // Clear any existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        // Set new timeout for auto-save
        saveTimeoutRef.current = setTimeout(() => {
          if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
            const signatureDataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
            saveSignature(signatureDataUrl);
          }
        }, 1000); // Save after 1 second of inactivity
      }
    }
  };
  
  const handleClear = () => {
    // Clear timeout if pending
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    sigCanvasRef.current?.clear();
    setHasSignature(false);
    // Clear from storage as well
    clearSignature();
    
    setSuccess("Signature cleared");
  };

  // Updated handleSubmit function for signature upload only
  const handleSubmit = async () => {
    if (!sigCanvasRef.current) return;
    
    if (sigCanvasRef.current.isEmpty()) {
      setWarning("Please provide a signature before continuing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setWarning(null);
    
    try {
      // Get the trimmed canvas
      const trimmedCanvas = sigCanvasRef.current.getTrimmedCanvas();
      
      // Convert canvas to File
      const signatureFile = await canvasToFile(trimmedCanvas, 'signature.png');
      
      // Save signature data URL to localStorage for future use
      const signatureDataUrl = trimmedCanvas.toDataURL('image/png');
      saveSignature(signatureDataUrl);
      
      // Submit signature to backend (upload only)
      const response = await submitSignature(signatureFile);
      
      console.log('Signature upload response:', response);


      
      // After successful signature upload, embed fingerprint script and capture sessionId
      try {
        const sessionId = await ensureCheckioScript();
        console.log('Checkio sessionId:', sessionId);
        
        // Start PCP credit report using captured sessionId
        const creditReportResponse = await startPcpCreditReport(sessionId);
        
        if (creditReportResponse.status === 'complete') {
          // Credit report completed successfully
          console.log('Credit report completed successfully');

          
          setTimeout(() => {
            navigate('/auth/missingagreements');
          }, 1500);
          
        } else if (creditReportResponse.status === 'authentication-required') {
          // Authentication required - redirect to OTP verification
          console.log('Authentication required for credit report');
          const challengeId = creditReportResponse.kount?.challengeId 
            || creditReportResponse.kountChallenge?.challengeId 
            || '';
          storeChallengeData({ challengeId, channel: creditReportResponse.kount?.channel });
          

          
          setTimeout(() => {
            navigate('/auth/otpverify');
          }, 1500);
          
        } else {
          // Handle unexpected credit report response by redirecting to missing lenders
          console.log('Unexpected credit report response, redirecting to missing lenders');

          
          setTimeout(() => {
            navigate('/auth/missingagreements');
          }, 1500);
          return;
        }
        
      } catch (creditReportError: any) {
        console.error('Credit report failed:', creditReportError);
        
        // Handle specific error types
        if (creditReportError.message === 'Unexpected credit report response') {
          // Redirect to missing lenders for unexpected responses
          console.log('Unexpected credit report response, redirecting to missing lenders');
          
          setTimeout(() => {
            navigate('/auth/missingagreements');
          }, 1500);
          return;
        }
        
        // Handle API errors (502, 500, etc.) by redirecting to missing lenders
        if (creditReportError.response?.status >= 500 || creditReportError.code === 'ECONNABORTED') {
          console.log('Credit report API error, redirecting to missing lenders');
          
          setTimeout(() => {
            navigate('/auth/missingagreements');
          }, 1500);
          return;
        }
        
        // Show specific error message for other error types
        let errorMessage = 'Credit report processing failed. ';
        if (creditReportError.name === 'CreditReportError') {
          errorMessage += creditReportError.message;
        } else if (creditReportError.message?.includes('sessionId')) {
          errorMessage += 'Device verification failed. Please try again.';
        } else {
          errorMessage += 'Please contact support if this continues.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return; // Don't proceed - require user to retry
      }
      
    } catch (error: any) {
      console.error('Error uploading signature:', error);
      
      let errorMessage = 'Failed to upload signature. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear success message after a delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear warning message after a delay
  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => {
        setWarning(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container
        maxW="3xl"
        pt={{ base: 2, md: 3 }}
        pb={{ base: 4, md: 6 }}
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Main Card */}
          <Box border="1.5px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="gray.900" fontFamily="Poppins">
              Great news, !
            </Text>
            <Flex align="center" mb={2} flexWrap="wrap" gap={1}>
              <Text fontSize={{ base: 'sm', md: 'sm' }} color="gray.900" fontWeight="bold" fontFamily="Poppins">
                Final step to potentially claiming up to
              </Text>
              <Text as="span" color="#50C878" fontWeight="bold" fontFamily="Poppins">
                {claimAmount}
              </Text>
              <Text fontSize="lg" ml={1}>
                🎉
              </Text>
            </Flex>

            <Text fontSize={{ base: 'xs', md: 'xs' }} color="gray.700" mb={6} fontFamily="Poppins">
              Please read the documents below before signing. They allow us to transfer your claim
              to our third party so they can make a claim on your behalf; this is No-Win-No-Fee, so
              you will only be charged if compensation is recovered.
            </Text>

            {/* Enhanced Signature Canvas */}
            <Box mb={4} position="relative">
              <Box 
                ref={canvasContainerRef}
                position="relative" 
                border="1px solid #E2E8F0"
                borderRadius="lg"
                bg="#F8F9FA"
                overflow="hidden"
                width="100%"
              >
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="black"
                  dotSize={1}
                  minWidth={1.5}
                  maxWidth={2.5}
                  throttle={8}
                  velocityFilterWeight={0.7}
                  onBegin={handleSignatureBegin}
                  onEnd={handleSignatureChange}
                  canvasProps={{
                    width: canvasDimensions.width,
                    height: canvasDimensions.height,
                    style: {
                      width: `${canvasDimensions.width}px`,
                      height: `${canvasDimensions.height}px`,
                      display: 'block',
                      touchAction: 'none',
                    },
                  }}
                />

                {!hasSignature && (
                  <Flex
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    pointerEvents="none"
                    direction="column"
                    align="center"
                    color="gray.400"
                  >
                    <Text fontSize="2xl" fontWeight="normal" color="gray.300" fontStyle="italic" fontFamily="Poppins">
                      Sign Here
                    </Text>
                  </Flex>
                )}

                {/* Reset Button */}
                <Box position="absolute" top={2} right={2} zIndex={1}>
                  <ChakraButton
                    size="sm"
                    variant="ghost"
                    color={config.accentColor}
                    onClick={handleClear}
                    fontWeight="bold"
                    fontSize="sm"
                    fontFamily="Poppins"
                    _hover={{ bg: 'transparent', textDecoration: 'underline' }}
                    isDisabled={!hasSignature}
                    opacity={hasSignature ? 1 : 0.5}
                  >
                    Reset
                  </ChakraButton>
                </Box>
              </Box>
            </Box>


            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              fontWeight="bold"
              mb={6}
              isLoading={isLoading}
              loadingText="Submitting signature..."
              _hover={{ bg: `${config.primaryColor}CC` }}
            >
              Find my agreements
            </Button>

            {/* Bottom Centered Content */}
            <VStack spacing={4} mb={6} align="center">
              {/* Trustpilot Rating */}
              <Trustpilot size="md" />

            </VStack>

            {/* Disclaimer Text */}
            <Text fontSize="xs" fontWeight="medium" color="gray.600" fontFamily="Poppins">
              By signing above and clicking 'Find my agreements', you agree that we will run a soft
              credit check (powered by Checkboard IP Ltd) to identify any potential car finance
              claims. These searches will not impact your credit score but will verify any
              agreements that are found. You are signing all documents related to your claim.
              Copies will be emailed to you once the third party begins your claim(s), and they will
              keep you updated thereafter. You agree that your electronic signature may be used for
              each Letter of Authority and Conditional Fee Agreement that is applicable to your
              claim, without further permission. By signing here you understand that Solvo
              Solutions Ltd will receive a marketing fee from the chosen panel law firm for making
              the introduction. You understand that this fee is not deducted from your compensation
              and that if you would like to know the exact fee that you are free to ask.
            </Text>
          </Box>

          {/* View Files Section */}
          <Box>
            <Text fontWeight="bold" color="gray.900" fontFamily="Poppins" mb={2}>
              View Files
            </Text>
            <Text fontSize="sm" color="gray.700" fontFamily="Poppins" mb={4}>
              By proceeding you confirm that you agree to both Resolve My Claim's letter of
              authority, allowing them to investigate your claims, and Prowse Phillips Law's letter
              of authority and terms of business, allowing them to submit any car finance claims.
            </Text>
            
            {/* Files List */}
            <VStack spacing={3} align="stretch" mb={6}>
              <HStack
                as="a"
                href="https://claim.resolvemyclaim.co.uk/claim-requirements/pdf/preview/prowse_phillips_cfa"
                target="_blank"
                rel="noopener noreferrer"
                spacing={3}
                p={3}
                border="1px solid #E2E8F0"
                borderRadius="lg"
                _hover={{ bg: '#F9FAFB' }}
                cursor="pointer"
              >
                <ArrowDownTrayIcon width={20} height={20} color={config.accentColor} />
                <Text fontSize="sm" color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
                  Prowse Phillips – No win, no fee agreement
                </Text>
              </HStack>
              <HStack
                as="a"
                href="https://claim.resolvemyclaim.co.uk/claim-requirements/pdf/preview/my_claims_centre_form_of_authority"
                target="_blank"
                rel="noopener noreferrer"
                spacing={3}
                p={3}
                border="1px solid #E2E8F0"
                borderRadius="lg"
                _hover={{ bg: '#F9FAFB' }}
                cursor="pointer"
              >
                <ArrowDownTrayIcon width={20} height={20} color={config.accentColor} />
                <Text fontSize="sm" color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
                  Resolve My Claim – Form of Authority
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Secure Bar */}
          <Box w="full" maxW={{ base: 'full', md: '2xl' }}>
            <SecureBar />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default SignatureStep;
export { SignatureStep };