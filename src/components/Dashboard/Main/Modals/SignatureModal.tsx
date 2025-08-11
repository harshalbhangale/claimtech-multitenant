import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  Flex,
  HStack,
  Button as ChakraButton,
} from '@chakra-ui/react';
// @ts-ignore - library lacks type definitions
import SignatureCanvas from 'react-signature-canvas';
import { useTenant } from '../../../../contexts/TenantContext';
import { submitSignature, canvasToFile as onboardingCanvasToFile } from '../../../../api/services/onboarding/submitSignature';
import { canvasToFile as dashboardCanvasToFile } from '../../../../api/services/dashboard/updateSignature';
import { useUpdateSignature } from '../../../../hooks/mutations/useUpdateSignature';
import { useUpdateRequirementStatus } from '../../../../hooks/mutations/useUpdateRequirementStatus';
import SuccessMessage from '../../../Onboarding/Common/SuccessMessage';
import ErrorMessage from '../../../Onboarding/Common/ErrorMessage';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementReason: string;
  onSuccess?: () => void;
  mode?: 'onboarding' | 'dashboard'; // Add mode prop
  claimId?: string; // Add claimId for dashboard mode
  requirementId?: string; // Add requirementId for dashboard mode
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  requirementReason,
  onSuccess,
  mode = 'onboarding', // Default to onboarding mode
  claimId,
  requirementId
}) => {
  const { config } = useTenant();
  const sigCanvasRef = useRef<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  const [hasSignature, setHasSignature] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 600, height: 200 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mutation hooks for dashboard mode
  const updateSignatureMutation = useUpdateSignature({
    claimId: claimId || '',
    onError: (error) => {
      console.error('Error updating signature:', error);
      let errorMessage = 'Failed to update signature. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  });

  const updateRequirementStatusMutation = useUpdateRequirementStatus({
    claimId: claimId || '',
    onSuccess: () => {
      setSuccess("Signature updated successfully!");
      // Close modal immediately and call success callback
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 500);
    },
    onError: (error) => {
      console.error('Error updating requirement status:', error);
      let errorMessage = 'Failed to update requirement status. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  });

  const isSubmitting = updateSignatureMutation.isPending || updateRequirementStatusMutation.isPending;

  // Calculate responsive canvas dimensions
  const updateCanvasDimensions = () => {
    if (canvasContainerRef.current) {
      const containerWidth = canvasContainerRef.current.offsetWidth;
      const aspectRatio = 3; 
      const height = Math.max(150, Math.min(200, containerWidth / aspectRatio));
      const width = containerWidth;
      
      setCanvasDimensions({ width, height });
    }
  };

  // Handle window resize and modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(updateCanvasDimensions, 100); // Small delay to ensure modal is rendered
    }
  }, [isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setHasSignature(false);
      setError(null);
      setSuccess(null);
      // Clear canvas when modal closes
      if (sigCanvasRef.current) {
        sigCanvasRef.current.clear();
      }
    }
  }, [isOpen]);

  // Handle when user starts drawing
  const handleSignatureBegin = () => {
    setHasSignature(true);
    setError(null);
  };

  // Track signature changes
  const handleSignatureChange = () => {
    if (sigCanvasRef.current) {
      const isEmpty = sigCanvasRef.current.isEmpty();
      setHasSignature(!isEmpty);
    }
  };
  
  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setHasSignature(false);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    if (!sigCanvasRef.current) return;
    
    if (sigCanvasRef.current.isEmpty()) {
      setError("Please provide a signature before submitting.");
      return;
    }

    // Validate required props for dashboard mode
    if (mode === 'dashboard' && (!claimId || !requirementId)) {
      setError("Missing required information for signature update.");
      return;
    }

    setError(null);
    setSuccess(null);
    
    try {
      // Get the trimmed canvas
      const trimmedCanvas = sigCanvasRef.current.getTrimmedCanvas();
      
      // Convert canvas to File using appropriate function
      const canvasToFileFunc = mode === 'dashboard' ? dashboardCanvasToFile : onboardingCanvasToFile;
      const signatureFile = await canvasToFileFunc(trimmedCanvas, 'signature.png');
      
      // Submit signature using appropriate method based on mode
      if (mode === 'dashboard') {
        // Step 1: Update the signature using mutation
        await updateSignatureMutation.mutateAsync({
          requirementId: requirementId!,
          signatureFile
        });
        
        // Step 2: Mark requirement as completed using mutation
        await updateRequirementStatusMutation.mutateAsync({
          requirement_id: requirementId!,
          status: 'completed',
          document_file: signatureFile
        });
      } else {
        // Onboarding mode - use original API
        await submitSignature(signatureFile);
        setSuccess("Signature submitted successfully!");
        
        // Keep delay for onboarding mode
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      }
      
    } catch (error: any) {
      console.error('Error submitting signature:', error);
      
      // Error handling is now done in mutation hooks for dashboard mode
      if (mode === 'onboarding') {
        let errorMessage = 'Failed to submit signature. Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      }
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" boxShadow="2xl">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.200" pb={4}>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" fontFamily="Poppins">
              Digital Signature Required
            </Text>
            <Text fontSize="sm" color="gray.600" fontWeight="normal" fontFamily="Poppins">
              {requirementReason}
            </Text>
          </VStack>
        </ModalHeader>
        
        <ModalCloseButton isDisabled={isSubmitting} />
        
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            <Text fontSize="sm" color="gray.700" fontFamily="Poppins">
              Please provide your digital signature below to complete this requirement.
            </Text>

            {/* Enhanced Signature Canvas */}
            <Box position="relative">
              <Text fontSize="md" fontWeight="semibold" mb={3} color="gray.800" fontFamily="Poppins">
                Digital Signature
              </Text>
              
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
                    isDisabled={!hasSignature || isSubmitting}
                    opacity={hasSignature ? 1 : 0.5}
                  >
                    Reset
                  </ChakraButton>
                </Box>
              </Box>
            </Box>

            {/* Message Components */}
            {error && <ErrorMessage message={error} size="sm" />}
            {success && <SuccessMessage message={success} size="sm" />}
          </VStack>
        </ModalBody>
        
        <ModalFooter borderTopWidth="1px" borderColor="gray.200" pt={4}>
          <HStack spacing={3}>
            <Button 
              variant="ghost" 
              onClick={onClose}
              isDisabled={isSubmitting}
              fontFamily="Poppins"
            >
              Cancel
            </Button>
            <Button
              color="black"
              bg={config.primaryColor}
              _hover={{ bg: `${config.primaryColor}CC` }}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText={mode === 'dashboard' ? "Updating signature..." : "Submitting signature..."}
              isDisabled={!hasSignature}
              borderRadius="full"
              px={8}
              py={2}
              fontSize="md"
              boxShadow="md"
              transition="all 0.2s"
            >
              {mode === 'dashboard' ? 'Update Signature' : 'Submit Signature'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignatureModal;