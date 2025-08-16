import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  HStack,
  Flex,
  Button
} from '@chakra-ui/react';
// @ts-ignore - library lacks type definitions
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { useTenant } from '../../../contexts/TenantContext';

import WhatHappensAfterSigning from './WhatHappensAfterSigning';
import { Footer } from '../Common/Footer';
import { saveSignature, clearSignature } from '../../../utils/signatureStorage';
import { submitSignature, canvasToFile } from '../../../api/services/onboarding/submitSignature';
import { ensureCheckioScript } from '../../../utils/checkioFingerprint';
import { startPcpCreditReport } from '../../../api/services/onboarding/checkio';
import { storeChallengeData } from '../../../utils/checkioStorage';
import { getLenderSelection, getUserDetails } from '../../../utils/onboardingStorage';
import Trustpilot from '../Common/Trustpilot';
import { FileDown } from 'lucide-react';

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
  const [_claimAmount, setClaimAmount] = useState<string>('£6,427*');
  const [_firstName, setFirstName] = useState<string>('');

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

  // Load user details and calculate claim amount based on selected lenders
  useEffect(() => {
    // Load user's firstName
    const userDetails = getUserDetails();
    if (userDetails?.firstName) {
      setFirstName(userDetails.firstName);
    }

    // Calculate claim amount
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

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Main Card */}
          <Box border="1.5px solid #E2E8F0" borderRadius="2xl" p={{ base: 4, md: 6 }} w="full">
            {/* Trustpilot at top */}
            <VStack mb={2}>
              <Trustpilot size="xs" />
            </VStack>

            {/* Main heading */}
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold" color="gray.900" fontFamily="Poppins" textAlign="center" mb={2}>
              You're almost there!
            </Text>

            {/* Description */}
            <Text fontSize={{ base: 'sm', md: 'sm' }} color="gray.700" mb={6} fontFamily="Poppins" fontWeight="bold" textAlign="center" lineHeight="1.5">
              Please read the documents below before signing. They allow us to look into your claim and our solicitors to make the claim on your behalf. This is No-Win No-Fee, so you will only be charged if compensation is recovered.
            </Text>

            {/* Document Links */}
            <VStack spacing={{ base: 2, md: 3 }} align="stretch" mb={{ base: 4, md: 6 }}>
              <HStack
                as="a"
                href="https://claim.resolvemyclaim.co.uk/claim-requirements/pdf/preview/prowse_phillips_cfa"
                target="_blank"
                rel="noopener noreferrer"
                spacing={{ base: 2, md: 3 }}
                p={{ base: 2, md: 3 }}
                border="1px solid #E2E8F0"
                borderRadius="lg"
                _hover={{ bg: '#F9FAFB' }}
                cursor="pointer"
              >
                <FileDown  width={20} height={20} color={config.accentColor} />
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
                  Prowse Phillips - No win, no fee agreement
                </Text>
              </HStack>
              <HStack
                as="a"
                href="https://claim.resolvemyclaim.co.uk/claim-requirements/pdf/preview/solvo_solutions_form_of_authority"
                target="_blank"
                rel="noopener noreferrer"
                spacing={{ base: 2, md: 3 }}
                p={{ base: 2, md: 3 }}
                border="1px solid #E2E8F0"
                borderRadius="lg"
                _hover={{ bg: '#F9FAFB' }}
                cursor="pointer"
              >
                <FileDown  width={20} height={20} color={config.accentColor} />
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
                  Solvo Solutions - Form of Authority
                </Text>
              </HStack>
              <HStack
                as="a"
                href="https://claim.resolvemyclaim.co.uk/claim-requirements/pdf/preview/prowse_phillips_form_of_authority"
                target="_blank"
                rel="noopener noreferrer"
                spacing={{ base: 2, md: 3 }}
                p={{ base: 2, md: 3 }}
                border="1px solid #E2E8F0"
                borderRadius="lg"
                _hover={{ bg: '#F9FAFB' }}
                cursor="pointer"
              >
                <FileDown width={20} height={20} color={config.accentColor} />
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
                  Prowse Phillips - Form of Authority
                </Text>
              </HStack>
            </VStack>

            {/* Signature instruction */}
            <Box
              sx={{
                borderLeft: '1px solid #171331',
                display: 'flex',
                paddingLeft: '15px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                alignSelf: 'stretch',
              }}
              mb={2}
            >
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                fontFamily="Poppins"
                textAlign="left"
                fontWeight="bold"
              >
                Ensure your signature closely matches the one on your driving licence or passport for verification.
              </Text>
            </Box>
            
            <HStack spacing={1}  align="left" mb={1}>
              <Box as="span" fontSize="lg" display="flex" alignItems="center">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="15" viewBox="0 0 19 15" fill="none">
                  <path d="M9.48482 9.6959C9.29685 9.67508 8.52829 9.81133 8.19178 9.75897C7.88215 9.7108 7.5607 9.72744 6.96558 9.6959C4.74618 9.57828 4.24037 9.74825 3.87074 9.8006C3.46298 9.85836 3.12518 9.91603 2.76691 10.0106C2.43394 10.0986 2.26167 10.2314 2.15665 10.3257C2.10625 10.371 2.09325 10.4408 2.12416 10.5042C2.28912 10.8426 2.82746 10.736 3.25764 10.8098C3.91239 10.9221 4.83959 10.8836 5.60124 10.936C6.841 11.0212 7.55439 11.0098 8.17727 11.0621C9.09078 11.1389 9.51228 11.1359 9.89169 11.2091C10.4816 11.3229 10.8167 11.4084 11.0804 11.5349C11.1413 11.5641 11.175 11.6393 11.1756 11.7027C11.1769 11.835 11.0293 11.9345 10.8618 12.0184C10.6254 12.1368 10.3361 12.166 9.15811 12.4057C8.10414 12.6201 6.12761 13.0408 5.04648 13.2761C3.83738 13.5392 3.23304 13.6792 2.414 13.8053C1.61009 13.869 1.35778 13.9321 1.20041 13.9636C1.12629 13.9744 1.06385 13.9744 0.999512 13.9744" stroke="#171331" stroke-linecap="round"/>
                  <path d="M9.70081 6.40771C9.00712 7.10139 8.61719 8.04167 8.61719 9.0229V10.2644H9.85866C10.8399 10.2644 11.7802 9.87445 12.4739 9.18076L18.2819 3.37271C19.0473 2.60735 19.0473 1.36502 18.2819 0.599656C17.5165 -0.165706 16.2742 -0.165706 15.5089 0.599656L9.70081 6.40771Z" fill="#5B34C9"/>
                </svg>
              </Box>
              <Text fontSize={{ base: 'sm', md: 'md' }} color={config.accentColor} fontWeight="medium" fontFamily="Poppins">
                Add your signature below using your finger or mouse
              </Text>
            </HStack>

            {/* Signature Canvas */}
            <Box mb={{ base: 4, md: 6 }} position="relative">
              <Box 
                ref={canvasContainerRef}
                position="relative" 
                border="2px solid #E2E8F0"
                borderRadius="lg"
                bg="#F8F9FA"
                overflow="hidden"
                width="100%"
                minH={{ base: "150px", md: "200px" }}
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
                    <Text fontSize="xl" fontWeight="normal" color="gray.400" fontStyle="italic" fontFamily="Poppins">
                      Sign Here
                    </Text>
                  </Flex>
                )}
              </Box>
            </Box>

            {/* Action Buttons */}
            <HStack spacing={3} w="full" mb={{ base: 4, md: 6 }}>
              <Button
                flex="1"
                size={{ base: "md", md: "lg" }}
                variant="outline"
                color="gray.600"
                borderColor="gray.300"
                bg="gray.100"
                onClick={handleClear}
                fontWeight="medium"
                fontSize={{ base: "sm", md: "md" }}
                fontFamily="Poppins"
                borderRadius={{ base: "xl", md: "2xl" }}
                _hover={{ bg: 'gray.200' }}
                isDisabled={!hasSignature}
                h="64px"
              >
                Clear
              </Button>
              <Button
                flex="1"
                size={{ base: "md", md: "lg" }}
                bg={config.primaryColor}
                color="black"
                onClick={handleSubmit}
                fontWeight="bold"
                fontSize={{ base: "sm", md: "md" }}
                fontFamily="Poppins"
                borderRadius={{ base: "xl", md: "2xl" }}
                _hover={{ bg: `${config.primaryColor}CC` }}
                isLoading={isLoading}
                loadingText="Submitting..."
                isDisabled={!hasSignature}
                h="64px"
              >
                Submit
              </Button>
            </HStack>

          </Box>

          {/* What Happens After Signing */}
          <WhatHappensAfterSigning />
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};

export default SignatureStep;
export { SignatureStep };