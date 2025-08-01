// src/components/Dashboard/Main/AgreementModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Text,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useTenant } from '../../../../contexts/TenantContext';
import { saveAgreementDetails } from '../../../../api/services/dashboard/agreementDetails';
import type { AgreementDetailsRequest } from '../../../../api/services/dashboard/agreementDetails';

interface AgreementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string;
}

export const AgreementDetailsModal: React.FC<AgreementDetailsModalProps> = ({
  isOpen,
  onClose,
  claimId,
}) => {
  const { config } = useTenant();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AgreementDetailsRequest>({
    agreement_number: '',
    vehicle_registration: '',
    vehicle_make: '',
    vehicle_model: '',
    loan_amount: undefined,
    annual_percentage_rate: undefined,
    flat_interest_rate: undefined,
    monthly_payment: undefined,
    interest_payable: undefined,
    total_cost_of_credit: undefined,
    balloon_payment: undefined,
    contract_ongoing: false,
    start_date: '',
    contract_length: undefined,
    dealership_name: '',
  });

  const handleInputChange = (field: keyof AgreementDetailsRequest, value: any) => {
    setFormData((prev: AgreementDetailsRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreement_number.trim()) {
      toast({
        title: "Error",
        description: "Agreement number is required.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await saveAgreementDetails(claimId, formData);
      toast({
        title: "Success",
        description: "Agreement details have been saved successfully.",
        status: "success",
        duration: 3000,
      });
      onClose();
    } catch (error: any) {
      console.error('Error saving agreement details:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save agreement details. Please try again.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="2xl" mx={4}>
        <Box bg={config.accentLightColor} p={6} borderTopRadius="2xl">
          <ModalHeader p={0} fontSize="2xl" fontFamily="Poppins" fontWeight="bold">
            Agreement Details
          </ModalHeader>
          <Text color="gray.600" mt={1}>Please provide your finance agreement details</Text>
        </Box>
        <ModalCloseButton top={6} right={6} />
        
        <ModalBody p={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Agreement Number - Required */}
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" fontSize="md">Agreement Number</FormLabel>
                <Input 
                  placeholder="Enter agreement number"
                  size="lg"
                  bg="white"
                  borderColor="gray.300"
                  _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                  value={formData.agreement_number}
                  onChange={(e) => handleInputChange('agreement_number', e.target.value)}
                />
              </FormControl>

              {/* Vehicle Registration - Optional */}
              <FormControl>
                <FormLabel fontWeight="semibold" fontSize="md">Vehicle Registration</FormLabel>
                <Input 
                  placeholder="e.g., AB12 CDE" 
                  size="lg"
                  bg="white"
                  borderColor="gray.300"
                  _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                  value={formData.vehicle_registration || ''}
                  onChange={(e) => handleInputChange('vehicle_registration', e.target.value)}
                />
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                bg={config.primaryColor}
                color="black"
                size="lg"
                height="56px"
                borderRadius="full"
                _hover={{ bg: `${config.primaryColor}80` }}
                fontFamily="Poppins"
                fontSize="md"
                fontWeight="semibold"
                mt={4}
                isLoading={isSubmitting}
                loadingText="Saving..."
                disabled={isSubmitting}
              >
                Save Agreement Details
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};