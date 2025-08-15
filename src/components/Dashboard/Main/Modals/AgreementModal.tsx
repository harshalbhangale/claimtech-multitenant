// src/components/Dashboard/Main/Modals/AgreementModal.tsx
import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  HStack,
  Icon,
} from '@chakra-ui/react';
import { DocumentIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTenant } from '../../../../contexts/TenantContext';
import { saveAgreementDetails } from '../../../../api/services/dashboard/agreementDetails';
import type { AgreementDetailsRequest, Agreement } from '../../../../api/services/dashboard/agreementDetails';
import { useAgreementsWithRealtime } from '../../../../hooks/queries/useClaims';

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
  const queryClient = useQueryClient();
  const [showAddAnother, setShowAddAnother] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the enhanced real-time hook for immediate updates
  const { refetchImmediately, addAgreementLocally } = useAgreementsWithRealtime(claimId);

  // Helper function to get lender name from claims data
  const getLenderName = (): string => {
    const claims = queryClient.getQueryData<any[]>(['claims']);
    const claim = claims?.find(c => c.id === claimId);
    return claim?.lender_name || '';
  };

  // React Query mutation for saving agreement details with immediate updates
  const saveAgreementMutation = useMutation({
    mutationFn: (data: AgreementDetailsRequest & { agreement_document?: File }) => 
      saveAgreementDetails(claimId, data),
    onSuccess: (newAgreementResponse, _variables) => {
      // Transform AgreementDetailsResponse to Agreement type
      const newAgreement: Agreement = {
        id: newAgreementResponse.id,
        claim_id: claimId,
        lender_name: getLenderName(),
        agreement_number: newAgreementResponse.agreement_number,
        vehicle_registration: newAgreementResponse.vehicle_registration || '',
        vehicle_make: newAgreementResponse.vehicle_make || '',
        vehicle_model: newAgreementResponse.vehicle_model || '',
        loan_amount: newAgreementResponse.loan_amount || 0,
        annual_percentage_rate: newAgreementResponse.annual_percentage_rate || 0,
        flat_interest_rate: newAgreementResponse.flat_interest_rate || 0,
        monthly_payment: newAgreementResponse.monthly_payment || 0,
        interest_payable: newAgreementResponse.interest_payable || 0,
        total_cost_of_credit: newAgreementResponse.total_cost_of_credit || 0,
        balloon_payment: newAgreementResponse.balloon_payment || 0,
        contract_ongoing: newAgreementResponse.contract_ongoing || false,
        start_date: newAgreementResponse.start_date || '',
        contract_length: newAgreementResponse.contract_length || 0,
        dealership_name: newAgreementResponse.dealership_name || '',
        status: newAgreementResponse.status || 'pending',
        created_at: newAgreementResponse.created_at,
        updated_at: newAgreementResponse.updated_at,
      };

      // Immediately add the new agreement to local state
      addAgreementLocally(newAgreement);

      // Invalidate and refetch claims data to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      

      
      // Show option to add another agreement
      setShowAddAnother(true);
    },
    onError: (error: any) => {
      console.error('Error saving agreement details:', error);

    },
    onSettled: () => {
      // Always refetch to ensure we have the latest data
      refetchImmediately();
    },
  });

  // Form state
  const [formData, setFormData] = useState<AgreementDetailsRequest>({
    agreement_number: '',
    vehicle_registration: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof AgreementDetailsRequest, value: any) => {
    setFormData((prev: AgreementDetailsRequest) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG or PDF file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData({
      agreement_number: '',
      vehicle_registration: '',
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowAddAnother(false);
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

    // Include file in the request if selected
    const requestData = {
      ...formData,
      agreement_document: selectedFile || undefined,
    };

    // Use React Query mutation
    saveAgreementMutation.mutate(requestData);
  };

  const handleAddAnother = () => {
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" motionPreset="slideInBottom">
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
          {!showAddAnother ? (
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

                {/* Agreement Document Upload - Optional */}
                <FormControl>
                  <FormLabel fontWeight="semibold" fontSize="md">
                    Finance Agreement Document (Optional)
                  </FormLabel>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: 'none' }}
                  />
                  
                  {!selectedFile ? (
                    <Button
                      variant="outline"
                      size="lg"
                      w="full"
                      h="56px"
                      borderColor="gray.300"
                      borderStyle="dashed"
                      bg="gray.50"
                      _hover={{ bg: "gray.100", borderColor: config.accentColor }}
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<Icon as={DocumentIcon} w={5} h={5} />}
                    >
                      Upload Agreement Document
                    </Button>
                  ) : (
                    <Box
                      p={4}
                      bg="green.50"
                      border="1px solid"
                      borderColor="green.200"
                      borderRadius="lg"
                    >
                      <HStack justify="space-between" align="center">
                        <HStack spacing={3}>
                          <Icon as={DocumentIcon} w={5} h={5} color="green.500" />
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" color="green.700">
                              {selectedFile.name}
                            </Text>
                            <Text fontSize="xs" color="green.600">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </Text>
                          </Box>
                        </HStack>
                        <Button
                          size="sm"
                          variant="ghost"
                          color="green.600"
                          _hover={{ bg: "green.100" }}
                          onClick={handleRemoveFile}
                        >
                          <Icon as={XMarkIcon} w={4} h={4} />
                        </Button>
                      </HStack>
                    </Box>
                  )}
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Accepted formats: JPG, PNG, PDF (max 10MB)
                  </Text>
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
                  isLoading={saveAgreementMutation.isPending}
                  loadingText="Saving..."
                  disabled={saveAgreementMutation.isPending}
                >
                  Save Agreement Details
                </Button>
              </VStack>
            </form>
          ) : (
            // Success state with option to add another
            <VStack spacing={6} align="stretch">
              <Box
                p={6}
                bg="green.50"
                border="1px solid"
                borderColor="green.200"
                borderRadius="lg"
                textAlign="center"
              >
                <Icon as={DocumentIcon} w={8} h={8} color="green.500" mx="auto" mb={3} />
                <Text fontSize="lg" fontWeight="bold" color="green.700" mb={2}>
                  Agreement Saved Successfully!
                </Text>
                <Text fontSize="sm" color="green.600">
                  Your agreement details have been saved. Would you like to add another agreement?
                </Text>
              </Box>

              <HStack spacing={4}>
                <Button
                  flex={1}
                  bg={config.primaryColor}
                  color="black"
                  size="lg"
                  height="56px"
                  borderRadius="full"
                  _hover={{ bg: `${config.primaryColor}80` }}
                  fontFamily="Poppins"
                  fontSize="xs"
                  fontWeight="semibold"
                  leftIcon={<Icon as={PlusIcon} w={5} h={5} />}
                  onClick={handleAddAnother}
                >
                  Another Agreement
                </Button>
                <Button
                  flex={1}
                  variant="outline"
                  size="lg"
                  height="56px"
                  borderRadius="full"
                  borderColor="gray.300"
                  _hover={{ bg: "gray.50" }}
                  fontFamily="Poppins"
                  fontSize="md"
                  fontWeight="semibold"
                  onClick={handleClose}
                >
                  Done
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};