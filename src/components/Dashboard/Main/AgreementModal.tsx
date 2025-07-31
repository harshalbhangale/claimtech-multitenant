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
  SimpleGrid,
  Button,
  Switch,
  NumberInput,
  NumberInputField,
  Text,
  Divider,
  useToast,
  Box,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';
import { CalendarIcon, CurrencyPoundIcon } from '@heroicons/react/24/outline';
import { saveAgreementDetails } from '../../../api/services/dashboard/agreementDetails';
import type { AgreementDetailsRequest } from '../../../api/services/dashboard/agreementDetails';

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

    if (!formData.start_date) {
      toast({
        title: "Error",
        description: "Start date is required.",
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
                <FormLabel fontWeight="semibold">Agreement Number</FormLabel>
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

              <Divider />

              {/* Vehicle Details */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" color={config.accentColor} mb={4}>
                  Vehicle Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Registration</FormLabel>
                    <Input 
                      placeholder="e.g., AB12 CDE" 
                      size="lg"
                      value={formData.vehicle_registration}
                      onChange={(e) => handleInputChange('vehicle_registration', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Make</FormLabel>
                    <Input 
                      placeholder="e.g., BMW" 
                      size="lg"
                      value={formData.vehicle_make}
                      onChange={(e) => handleInputChange('vehicle_make', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Model</FormLabel>
                    <Input 
                      placeholder="e.g., 3 Series" 
                      size="lg"
                      value={formData.vehicle_model}
                      onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Dealership Name</FormLabel>
                    <Input 
                      placeholder="Enter dealership name" 
                      size="lg"
                      value={formData.dealership_name}
                      onChange={(e) => handleInputChange('dealership_name', e.target.value)}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Financial Details */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" color={config.accentColor} mb={4}>
                  Financial Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Loan Amount</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement color="gray.500">
                        <CurrencyPoundIcon width={16} />
                      </InputLeftElement>
                      <NumberInput 
                        min={0} 
                        w="full"
                        value={formData.loan_amount}
                        onChange={(_, value) => handleInputChange('loan_amount', value)}
                      >
                        <NumberInputField pl={8} placeholder="0.00" />
                      </NumberInput>
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Monthly Payment</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement color="gray.500">
                        <CurrencyPoundIcon width={16} />
                      </InputLeftElement>
                      <NumberInput 
                        min={0} 
                        w="full"
                        value={formData.monthly_payment}
                        onChange={(_, value) => handleInputChange('monthly_payment', value)}
                      >
                        <NumberInputField pl={8} placeholder="0.00" />
                      </NumberInput>
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">APR (%)</FormLabel>
                    <NumberInput 
                      min={0} 
                      max={100} 
                      size="lg"
                      value={formData.annual_percentage_rate}
                      onChange={(_, value) => handleInputChange('annual_percentage_rate', value)}
                    >
                      <NumberInputField placeholder="0.00" />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Interest Rate (%)</FormLabel>
                    <NumberInput 
                      min={0} 
                      max={100} 
                      size="lg"
                      value={formData.flat_interest_rate}
                      onChange={(_, value) => handleInputChange('flat_interest_rate', value)}
                    >
                      <NumberInputField placeholder="0.00" />
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Contract Details */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" color={config.accentColor} mb={4}>
                  Contract Details
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Start Date</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement color="gray.500">
                        <CalendarIcon width={16} />
                      </InputLeftElement>
                      <Input 
                        type="date" 
                        pl={8}
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Contract Length (months)</FormLabel>
                    <NumberInput 
                      min={1} 
                      size="lg"
                      value={formData.contract_length}
                      onChange={(_, value) => handleInputChange('contract_length', value)}
                    >
                      <NumberInputField placeholder="Enter months" />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Balloon Payment</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement color="gray.500">
                        <CurrencyPoundIcon width={16} />
                      </InputLeftElement>
                      <NumberInput 
                        min={0} 
                        w="full"
                        value={formData.balloon_payment}
                        onChange={(_, value) => handleInputChange('balloon_payment', value)}
                      >
                        <NumberInputField pl={8} placeholder="0.00" />
                      </NumberInput>
                    </InputGroup>
                  </FormControl>
                  <FormControl display="flex" alignItems="center" h="full">
                    <FormLabel fontWeight="semibold" mb={0}>Contract Ongoing?</FormLabel>
                    <Switch 
                      size="lg" 
                      colorScheme="green"
                      isChecked={formData.contract_ongoing}
                      onChange={(e) => handleInputChange('contract_ongoing', e.target.checked)}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

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