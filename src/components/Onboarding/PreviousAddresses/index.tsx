import React, { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  Text,
  Box,
  Flex,
  Button,
  Icon,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { SecureBar } from '../Common/Securebar';
import { ProgressBar } from '../Common/ProgressBar';
import { useTenant } from '../../../contexts/TenantContext';
import NextButton from '../Common/NextButton';
import Trustpilot from '../Common/Trustpilot';
import { fetchUserAddresses } from '../../../api/services/addressMatch';
import type { BestMatchAddress } from '../../../api/services/addressMatch';
import { inviteUser } from '../../../api/services/inviteUser';
import { storeOtpReference } from '../../../api/services/verifyOTP';

export const PreviousAddressesPage: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const toast = useToast();
  const [addresses, setAddresses] = useState<BestMatchAddress[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch addresses on component mount
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoading(true);
        const fetchedAddresses = await fetchUserAddresses();
        setAddresses(fetchedAddresses);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load addresses. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [toast]);

  // Toggle address selection
  const toggleAddressSelection = (addressId: string) => {
    setSelectedAddresses(prev =>
      prev.includes(addressId)
        ? prev.filter(id => id !== addressId)
        : [...prev, addressId]
    );
  };

  // Remove address from list
  const removeAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.address_id !== addressId));
    setSelectedAddresses(prev => prev.filter(id => id !== addressId));
  };

  // Format address for display
  const formatAddress = (address: BestMatchAddress): string => {
    const parts = [
      address.address,
      address.address1,
      address.address2,
      address.address3,
      address.address4,
      address.address5,
      address.city,
      address.region,
      address.postcode
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  };

  const handleNextStep = async () => {
    setIsSubmitting(true);
    
    try {
      // Save selected addresses to localStorage if needed
      // localStorage.setItem('selected_addresses', JSON.stringify(selectedAddresses));
      
      // Call invite API to send OTP
      const inviteResponse = await inviteUser();
      console.log('Invite response:', inviteResponse);

      // Store OTP reference for verification
      if (inviteResponse.invite_response?.Info?.Data?.reference) {
        storeOtpReference(inviteResponse.invite_response.Info.Data.reference);
        console.log('OTP reference stored:', inviteResponse.invite_response.Info.Data.reference);
        toast({
          title: "Processing complete",
          description: "Please check your phone for the verification code.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Navigate to OTP verification page
        navigate('/auth/otpverify');
      } else {
        throw new Error('No OTP reference received from invite request');
      }
      
    } catch (error: any) {
      console.error('Error sending invite:', error);
      
      let errorMessage = 'Failed to proceed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Progress Steps */}
          <ProgressBar currentStep={3} totalSteps={4} />

          {/* Form Section */}
          <Box border="2px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mb={3}
              color="gray.900"
            >
              Review your previous addresses
            </Text>
            <Text color="gray.600" mb={6} fontSize={{ base: "sm", md: "md" }}>
              We found these addresses associated with your details. Please select the ones that match your previous addresses or remove any that don't belong to you.
            </Text>

            {loading ? (
              <Flex justify="center" align="center" py={8}>
                <Spinner size="lg" color={config.accentColor} />
                <Text ml={4} color="gray.600">Loading your addresses...</Text>
              </Flex>
            ) : addresses.length === 0 ? (
              <Box
                textAlign="center"
                py={8}
                px={4}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text color="gray.600" fontSize="md">
                  No additional addresses found for your account.
                </Text>
              </Box>
            ) : (
              <VStack spacing={3} align="stretch" mb={6}>
                {addresses.map((address) => {
                  const isSelected = selectedAddresses.includes(address.address_id);
                  const formattedAddress = formatAddress(address);
                  
                  return (
                    <Box
                      key={address.address_id}
                      p={4}
                      borderRadius="lg"
                      border="2px"
                      borderColor={isSelected ? config.accentColor : 'gray.200'}
                      bg={isSelected ? '#F3F0FF' : 'white'}
                      transition="all 0.2s"
                      _hover={{
                        borderColor: isSelected ? config.accentColor : 'gray.300',
                        bg: isSelected ? '#F3F0FF' : 'gray.50'
                      }}
                    >
                      <Flex justify="space-between" align="flex-start" gap={4}>
                        <Flex flex="1" align="flex-start" gap={3}>
                          {/* Selection Checkbox */}
                          <Box
                            w="24px"
                            h="24px"
                            borderRadius="full"
                            border="2px"
                            borderColor={isSelected ? config.accentColor : 'gray.300'}
                            bg="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={() => toggleAddressSelection(address.address_id)}
                            flexShrink={0}
                            mt={1}
                          >
                            <Icon 
                              as={Check} 
                              w={3} 
                              h={3} 
                              color={isSelected ? config.accentColor : 'transparent'}
                              strokeWidth={3}
                            />
                          </Box>

                          {/* Address Details */}
                          <Box flex="1" cursor="pointer" onClick={() => toggleAddressSelection(address.address_id)}>
                            <Text
                              fontSize="md"
                              fontWeight={isSelected ? "bold" : "medium"}
                              color="gray.900"
                              lineHeight="1.4"
                            >
                              {formattedAddress}
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                              Address ID: {address.address_id}
                            </Text>
                          </Box>
                        </Flex>

                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeAddress(address.address_id)}
                          p={2}
                          minW="auto"
                          height="auto"
                          borderRadius="full"
                          _hover={{ bg: 'red.50' }}
                        >
                          <Icon as={X} w={4} h={4} />
                        </Button>
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            )}

            {/* Selection Summary */}
            {addresses.length > 0 && (
              <Box
                bg="blue.50"
                border="1px solid"
                borderColor="blue.200"
                borderRadius="lg"
                p={4}
                mb={6}
              >
                <Text fontSize="sm" color="blue.800">
                  <strong>{selectedAddresses.length}</strong> of <strong>{addresses.length}</strong> addresses selected
                </Text>
              </Box>
            )}

            {/* Next Step Button */}
            <NextButton 
              onClick={handleNextStep} 
              isLoading={isSubmitting}
              label={isSubmitting ? "Sending verification code..." : "Next step"}
            />

            {/* Bottom Centered Content */}
            <VStack spacing={4} align="center" mt={6}>
              {/* Trustpilot Rating */}
              <Trustpilot size="md" />
            </VStack>
          </Box>

          {/* Bottom Features */}
          <Box w="full" maxW={{ base: "full", md: "2xl" }}>
            <SecureBar />
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default PreviousAddressesPage;
