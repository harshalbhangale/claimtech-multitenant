import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Box,
  VStack,
  Text,
  Input,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { CheckCircle } from 'lucide-react';
import { useTenant } from '../../../../contexts/TenantContext';

export interface PreviousNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementReason?: string;
  claimId?: string;
  requirementId?: string;
  onSubmit?: (payload: { requirementId: string; previousName: string }) => Promise<void> | void;
}

const PreviousNameModal: React.FC<PreviousNameModalProps> = ({
  isOpen,
  onClose,
  requirementReason,
  claimId: _claimId, // eslint-disable-line @typescript-eslint/no-unused-vars
  requirementId,
  onSubmit,
}) => {
  const { config } = useTenant();
  const toast = useToast();
  const [previousName, setPreviousName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!requirementId || !previousName.trim()) return;
    try {
      setSubmitting(true);
      await onSubmit?.({ requirementId, previousName: previousName.trim() });
      
      toast({
        title: "Success!",
        description: "Your previous name has been submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit previous name. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }} motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl" mx={4} overflow="hidden" boxShadow="0 10px 30px rgba(0, 0, 0, 0.1)">
        {/* Simple header */}
        <Box bg={config.accentLightColor} p={4} borderTopRadius="xl">
          <ModalHeader p={0} fontSize="lg" fontFamily="Poppins" fontWeight="bold" color={config.accentColor}>
            Previous Name
          </ModalHeader>
          <Text color="gray.600" mt={1} fontSize="sm">
            Enter your previous legal name to help find your agreements
          </Text>
        </Box>
        
        <ModalCloseButton 
          top={4} 
          right={4} 
          size="md"
          borderRadius="full"
          bg="white"
          _hover={{ bg: "gray.100" }}
        />
        
        <ModalBody p={4}>
          {requirementReason && (
            <Box 
              bg="blue.50" 
              border="1px solid" 
              borderColor="blue.200" 
              borderRadius="lg" 
              p={3} 
              mb={4}
            >
              <Text fontSize="sm" color="blue.700" fontFamily="Poppins">
                {requirementReason}
              </Text>
            </Box>
          )}

          <VStack spacing={4} align="stretch">
            {/* Simple name input */}
            <Box>
              <Text fontSize="md" fontWeight="medium" mb={2} color="gray.700" fontFamily="Poppins">
                Previous Legal Name
              </Text>
              <Input
                value={previousName}
                onChange={(e) => setPreviousName(e.target.value)}
                placeholder="e.g., John Smith"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="lg"
                size="md"
                height="48px"
                _focus={{ 
                  borderColor: config.accentColor, 
                  boxShadow: `0 0 0 1px ${config.accentColor}20`
                }}
                _hover={{ borderColor: config.accentColor }}
                fontFamily="Poppins"
                fontSize="md"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && previousName.trim()) {
                    handleSubmit();
                  }
                }}
              />
            </Box>

            {/* Info Box */}
            <Box
              bg={config.accentLightColor}
              p={3}
              borderRadius="lg"
              border="1px solid"
              borderColor={`${config.accentColor}30`}
            >
              <Text fontFamily="Poppins" fontSize="sm" color="gray.700" lineHeight="1.5">
                Please enter your full previous legal name exactly as it appeared on official documents like passports, driving licenses, or birth certificates.
              </Text>
            </Box>

            {/* Selected Name Preview */}
            {previousName.trim() && (
              <Box
                border="1px solid"
                borderColor="green.200"
                bg="green.50"
                borderRadius="lg"
                p={3}
              >
                <Text fontSize="sm" fontWeight="medium" color="green.700" mb={2} fontFamily="Poppins">
                  Name to Submit:
                </Text>
                <Box
                  bg="white"
                  borderRadius="md"
                  p={2}
                  border="1px solid"
                  borderColor="green.200"
                >
                  <Text fontSize="md" color="gray.800" fontFamily="Poppins" fontWeight="medium">
                    {previousName.trim()}
                  </Text>
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>
        
        {/* Simple footer */}
        <ModalFooter 
          borderTopWidth="1px" 
          borderColor="gray.200" 
          p={4}
          gap={3}
        >
          <Button 
            variant="outline" 
            onClick={onClose} 
            size="md"
            borderRadius="lg"
            fontFamily="Poppins"
          >
            Cancel
          </Button>
          <Button
            bg={config.primaryColor}
            color="black"
            _hover={{ bg: `${config.primaryColor}CC` }}
            onClick={handleSubmit}
            isLoading={submitting}
            loadingText="Submitting..."
            isDisabled={!previousName.trim()}
            fontFamily="Poppins"
            borderRadius="lg"
            size="md"
            rightIcon={!submitting ? <Icon as={CheckCircle} w={4} h={4} /> : undefined}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PreviousNameModal;
