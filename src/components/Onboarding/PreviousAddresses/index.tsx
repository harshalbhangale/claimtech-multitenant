import React, { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  Text,
  Box,
  Flex,
  Button,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  HStack,
} from '@chakra-ui/react';
import { Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import NextButton from '../Common/NextButton';
import Trustpilot from '../Common/Trustpilot';
import SuccessMessage from '../Common/SuccessMessage';
import WarningMessage from '../Common/WarningMessage';
import ErrorMessage from '../Common/ErrorMessage';
import { fetchUserAddresses } from '../../../api/services/onboarding/addressMatch';
import type { BestMatchAddress } from '../../../api/services/onboarding/addressMatch';
import { fetchAddressesByPostcode } from '../../../api/services/onboarding/addressCheck';
import type { RawAddress, FormattedAddress } from '../../../types/address';
import { inviteUser } from '../../../api/services/onboarding/inviteUser';
import { storeOtpReference } from '../../../api/services/onboarding/verifyOTP';
import api from '../../../api/index';


interface AddressState {
  addresses: BestMatchAddress[];
  removedAddressIds: string[];
  addedAddresses: BestMatchAddress[];
  lastFetchTime: number;
}

export const PreviousAddressesPage: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Main addresses state
  const [addresses, setAddresses] = useState<BestMatchAddress[]>([]);
  const [removedAddressIds, setRemovedAddressIds] = useState<string[]>([]);
  const [addedAddresses, setAddedAddresses] = useState<BestMatchAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setInitialLoadComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Modal states for adding addresses
  const [modalPostcode, setModalPostcode] = useState('');
  const [modalAddresses, setModalAddresses] = useState<FormattedAddress[]>([]);
  const [modalRawAddresses, setModalRawAddresses] = useState<RawAddress[]>([]);
  const [modalSelectedId, setModalSelectedId] = useState<number | null>(null);
  const [modalOpenDropdown, setModalOpenDropdown] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const LOCAL_STORAGE_KEY = 'previous_addresses_state';

  // Save state to localStorage
  const saveStateToStorage = (state: Partial<AddressState>) => {
    try {
      const currentState = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedState: AddressState = currentState ? JSON.parse(currentState) : {
        addresses: [],
        removedAddressIds: [],
        addedAddresses: [],
        lastFetchTime: 0
      };

      const newState = { ...parsedState, ...state, lastFetchTime: Date.now() };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      console.log('State saved to localStorage:', newState);
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  };

  // Load state from localStorage
  const loadStateFromStorage = (): AddressState | null => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        const parsedState: AddressState = JSON.parse(storedState);
        console.log('State loaded from localStorage:', parsedState);
        return parsedState;
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
    return null;
  };

  // Check if user is authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setAuthError('No access token found. Please login again.');
      setError('Please login to continue.');
      setTimeout(() => {
        navigate('/auth/contactdetails');
      }, 3000);
      return;
    }
  }, [navigate]);

  // Load saved state on component mount
  useEffect(() => {
    const savedState = loadStateFromStorage();
    if (savedState) {
      console.log('Restoring state from localStorage');
      setAddresses(savedState.addresses);
      setRemovedAddressIds(savedState.removedAddressIds);
      setAddedAddresses(savedState.addedAddresses);
      
      // Check if we need to fetch fresh data (e.g., if more than 1 hour old)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      if (savedState.lastFetchTime > oneHourAgo) {
        console.log('Using cached data (less than 1 hour old)');
        setLoading(false);
        setInitialLoadComplete(true);
        return;
      }
    }
    
    // Fetch fresh data if no saved state or it's old
    loadAddresses();
  }, []);

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

  // Clear error message after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch addresses from API
  const loadAddresses = async () => {
    if (!authError) {
      try {
        setLoading(true);
        setAuthError(null);
        setAddressError(null);
        
        console.log('Fetching user addresses from API...');
        const fetchedAddresses = await fetchUserAddresses();
        console.log('Fetched addresses:', fetchedAddresses);
        console.log('Number of addresses:', fetchedAddresses.length);
        
        // Apply any previous removals and additions
        const savedState = loadStateFromStorage();
        let finalAddresses = fetchedAddresses;
        let currentRemovedIds: string[] = [];
        let currentAddedAddresses: BestMatchAddress[] = [];
        
        if (savedState) {
          // Remove previously removed addresses
          finalAddresses = fetchedAddresses.filter(addr => 
            !savedState.removedAddressIds.includes(addr.address_id)
          );
          
          // Add previously added addresses (that aren't already in the fetched list)
          const existingIds = fetchedAddresses.map(addr => addr.address_id);
          const uniqueAddedAddresses = savedState.addedAddresses.filter(addr => 
            !existingIds.includes(addr.address_id)
          );
          
          finalAddresses = [...finalAddresses, ...uniqueAddedAddresses];
          currentRemovedIds = savedState.removedAddressIds;
          currentAddedAddresses = savedState.addedAddresses;
        }
        
        setAddresses(finalAddresses);
        setRemovedAddressIds(currentRemovedIds);
        setAddedAddresses(currentAddedAddresses);
        
        // Save to localStorage
        saveStateToStorage({
          addresses: finalAddresses,
          removedAddressIds: currentRemovedIds,
          addedAddresses: currentAddedAddresses
        });
        
      } catch (error: any) {
        console.error('Error loading addresses:', error);
        
        if (error.message?.includes('Session expired') || error.message?.includes('No access token')) {
          setAuthError(error.message);
          setError('Session expired. Please login again.');
          setTimeout(() => {
            navigate('/auth/contactdetails');
          }, 3000);
        } else {
          setAddressError(error.message || 'Failed to load addresses');
          setError('Failed to load addresses. You can still continue to the next step.');
        }
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    }
  };

  // Format address for display
  const formatAddress = (address: BestMatchAddress): string => {
    const addressParts = [];
    
    if (address.address && address.address.trim() && address.address !== '""') {
      addressParts.push(address.address);
    }
    
    const numberedParts = [
      address.address1,
      address.address2, 
      address.address3,
      address.address4,
      address.address5
    ].filter(part => part && part.trim() && part !== '""');
    
    addressParts.push(...numberedParts);
    
    if (address.city && address.city.trim() && address.city !== '""') {
      addressParts.push(address.city);
    }
    
    if (address.region && address.region.trim() && address.region !== '""') {
      addressParts.push(address.region);
    }
    
    if (address.postcode && address.postcode.trim() && address.postcode !== '""') {
      addressParts.push(address.postcode);
    }
    
    return addressParts.length > 0 
      ? addressParts.join(', ') 
      : `Address ID: ${address.address_id}`;
  };

  // Remove address from list
  // const removeAddress = (addressId: string) => {
  //   console.log('Removing address:', addressId);
    
  //   // Update addresses state
  //   const updatedAddresses = addresses.filter(addr => addr.address_id !== addressId);
  //   setAddresses(updatedAddresses);
    
  //   // Update removed IDs state
  //   const updatedRemovedIds = [...removedAddressIds, addressId];
  //   setRemovedAddressIds(updatedRemovedIds);
    
  //   // Update added addresses state (remove from added if it was added)
  //   const updatedAddedAddresses = addedAddresses.filter(addr => addr.address_id !== addressId);
  //   setAddedAddresses(updatedAddedAddresses);
    
  //   // Save to localStorage
  //   saveStateToStorage({
  //     addresses: updatedAddresses,
  //     removedAddressIds: updatedRemovedIds,
  //     addedAddresses: updatedAddedAddresses
  //   });
    
  //   toast({
  //     title: "Address Removed",
  //     description: "Address has been removed from your list.",
  //     status: "info",
  //     duration: 2000,
  //     isClosable: true,
  //   });
  // };

  // Modal functions for adding addresses
  const validPostcode = (pc: string): boolean => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(pc.replace(/\s/g, ''));
  };

  const handleModalFind = async () => {
    const pc = modalPostcode.trim();
    if (!validPostcode(pc)) {
      setError('Please enter a valid UK postcode');
      return;
    }

    try {
      setModalLoading(true);
      setError(null);
      setSuccess(null);
      setWarning(null);
      
      const rawResults = await fetchAddressesByPostcode(pc);
      const formatted = rawResults.map((item, idx) => {
        const parts = [
          item.address1,
          item.address2,
          item.address3,
          item.address4,
          item.address5,
          item.city,
          item.region,
          item.postcode,
        ].filter(Boolean);

        return {
          id: idx,
          label: parts.join(', '),
          lines: parts.join('\n'),
          address_id: item.address_id,
        };
      });

      setModalAddresses(formatted);
      setModalRawAddresses(rawResults);
      setModalSelectedId(null);
    } catch (error) {
      setError('Failed to find addresses for this postcode');
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (modalSelectedId === null) return;

    const selectedAddress = modalAddresses.find((a) => a.id === modalSelectedId);
    const selectedRaw = modalRawAddresses.find((_, idx) => idx === modalSelectedId);
    
    if (selectedAddress && selectedRaw) {
      // Convert to BestMatchAddress format
      const newAddress: BestMatchAddress = {
        address: selectedRaw.address1 || '',
        address1: selectedRaw.address1 || '',
        address2: selectedRaw.address2 || '',
        address3: selectedRaw.address3 || '',
        address4: selectedRaw.address4 || '',
        address5: selectedRaw.address5 || '',
        city: selectedRaw.city || '',
        region: selectedRaw.region || '',
        country: selectedRaw.country || '',
        postcode: selectedRaw.postcode || '',
        address_id: selectedRaw.address_id,
      };

      // Check if address already exists
      const addressExists = addresses.some(addr => addr.address_id === newAddress.address_id);
      
      if (addressExists) {
        setWarning('This address is already in your list.');
      } else {
        console.log('Adding new address:', newAddress);
        
        // Update addresses state
        const updatedAddresses = [...addresses, newAddress];
        setAddresses(updatedAddresses);
        
        // Update added addresses state
        const updatedAddedAddresses = [...addedAddresses, newAddress];
        setAddedAddresses(updatedAddedAddresses);
        
        // Remove from removed IDs if it was previously removed
        const updatedRemovedIds = removedAddressIds.filter(id => id !== newAddress.address_id);
        setRemovedAddressIds(updatedRemovedIds);
        
        // Save to localStorage
        saveStateToStorage({
          addresses: updatedAddresses,
          removedAddressIds: updatedRemovedIds,
          addedAddresses: updatedAddedAddresses
        });
        
        setSuccess('New address has been added to your list.');
      }

      // Reset modal state
      setModalPostcode('');
      setModalAddresses([]);
      setModalRawAddresses([]);
      setModalSelectedId(null);
      setModalOpenDropdown(false);
      onClose();
    }
  };

  // Submit addresses to backend
  const submitAddresses = async (addressesToSubmit: BestMatchAddress[]) => {
    if (addressesToSubmit.length === 0) {
      console.log('No addresses to submit');
      return { results: [] };
    }

    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('No access token found. Please login again.');
      }

      const requestData = {
        addresses: addressesToSubmit.map(addr => ({
          address: addr.address || '',
          address1: addr.address1 || '',
          address2: addr.address2 || '',
          address3: addr.address3 || '',
          address4: addr.address4 || '',
          address5: addr.address5 || '',
          city: addr.city || '',
          region: addr.region || '',
          country: addr.country || '',
          postcode: addr.postcode || '',
          address_id: addr.address_id,
        }))
      };

      console.log('Submitting addresses:', requestData);

      const response = await api.post('/api/v1/onboarding/addresses/', requestData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      console.log('Address submission response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error submitting addresses:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to submit addresses');
    }
  };

  const handleNextStep = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setWarning(null);
    
    try {
      // Submit addresses to backend
      console.log('Submitting addresses to backend...');
      const addressResponse = await submitAddresses(addresses);
      console.log('Address submission successful:', addressResponse);
      
      // Call invite API to send OTP
      console.log('Calling invite API...');
      try {
        const inviteResponse = await inviteUser();
        console.log('Invite response:', inviteResponse);

        // Store OTP reference for verification
        if (inviteResponse.invite_response?.Info?.Data?.reference) {
          const reference = inviteResponse.invite_response.Info.Data.reference;
          storeOtpReference(reference);
          console.log('OTP reference stored:', reference);
        }
        
      } catch (inviteError: any) {
        console.log('Invite API error:', inviteError);
        
        // Handle 409 Conflict error - bypass and continue to OTP verification
        if (inviteError.response?.status === 409) {
          console.log('409 Conflict detected - bypassing invite API and proceeding to OTP verification');
          setSuccess('Moving to OTP verification step.');
        } else {
          // Re-throw other errors that aren't 409
          throw inviteError;
        }
      }
      
      // Clear the saved state since we're moving to the next step
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      setSuccess('Sending OTP ! Please check your phone for the verification code.');

      // Navigate to OTP verification page after a brief delay
      setTimeout(() => {
        navigate('/auth/otpverify');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error in next step:', error);
      
      let errorMessage = 'Failed to proceed. Please try again.';
      
      if (error.message?.includes('Session expired') || error.message?.includes('No access token')) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => {
          navigate('/auth/contactdetails');
        }, 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show authentication error if exists
  if (authError) {
    return (
      <Box minH="100vh" bg="white" w="100%">
        <Header />
        <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 4, sm: 6, lg: 8 }}>
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Authentication Required</Text>
                <Text fontSize="sm">{authError}</Text>
              </Box>
            </Alert>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Form Section */}
          <Box border="2px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mb={3}
              color="gray.900"
            >
              We’re finding your linked addresses. 
            </Text>
            <Text color="gray.600" mb={4} fontSize={{ base: "sm", md: "md" }}>
              Please add any addresses that are missing, the more correct addresses we have the more likley we are to find ALL your agreements.
            </Text>

            {/* Add Address Button */}
            <Button
              onClick={onOpen}
              size="sm"
              variant="outline"
              borderColor={config.accentColor}
              color={config.accentColor}
              _hover={{ bg: config.accentLightColor }}
              leftIcon={<Icon as={Plus} w={4} h={4} />}
              mb={6}
            >
              Add Previous Address
            </Button>

            {loading ? (
              <Flex justify="center" align="center" py={8}>
                <Spinner size="lg" color={config.accentColor} />
                <Text ml={4} color="gray.600">Loading your addresses...</Text>
              </Flex>
            ) : addressError ? (
              <ErrorMessage message={addressError} />
            ) : addresses.length === 0 ? (
              <Box
                textAlign="center"
                py={8}
                px={4}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                mb={4}
              >
                <Text color="gray.600" fontSize="md" mb={4}>
                  No addresses in your list.
                </Text>
                <Text color="gray.500" fontSize="sm">
                  You can add previous addresses using the button above or continue to the next step.
                </Text>
              </Box>
            ) : (
              <VStack spacing={3} align="stretch" mb={6}>
                {addresses.map((address) => {
                  const formattedAddress = formatAddress(address);
                  const isAddedAddress = addedAddresses.some(added => added.address_id === address.address_id);
                  
                  return (
                    <Box
                      key={address.address_id}
                      p={4}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={isAddedAddress ? config.accentColor : "gray.200"}
                      bg={isAddedAddress ? config.accentLightColor : "white"}
                      transition="all 0.2s"
                      _hover={{
                        borderColor: isAddedAddress ? config.accentColor : 'gray.300',
                        bg: isAddedAddress ? config.accentLightColor : 'gray.50'
                      }}
                    >
                      <Flex justify="space-between" align="flex-start" gap={4}>
                        <Box flex="1">
                          <Flex align="center" gap={2} mb={1}>
                            <Text
                              fontSize="md"
                              fontWeight="medium"
                              color="gray.900"
                              lineHeight="1.4"
                            >
                              {formattedAddress}
                            </Text>
                            {isAddedAddress && (
                              <Text
                                fontSize="xs"
                                color={config.accentColor}
                                fontWeight="bold"
                                bg="white"
                                px={2}
                                py={1}
                                borderRadius="md"
                              >
                                ADDED
                              </Text>
                            )}
                          </Flex>
                        </Box>

                        {/* Remove Button */}
                        {/* <Button
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
                        </Button> */}
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            )}

            {/* Summary */}
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
                  <strong>{addresses.length}</strong> address{addresses.length !== 1 ? 'es' : ''} will be submitted
                  {addedAddresses.length > 0 && (
                    <Text as="span" ml={2} color="purple.700">
                      ({addedAddresses.length} manually added)
                    </Text>
                  )}
                </Text>
              </Box>
            )}

            {/* Success Message for OTP */}
            {success && <SuccessMessage message={success} />}

            {/* Next Step Button */}
            <NextButton 
              onClick={handleNextStep} 
              isLoading={isSubmitting}
              label={isSubmitting ? "Processing..." : "Next step"}
            />

            {/* Bottom Centered Content */}
            <VStack spacing={4} align="center" mt={6}>
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

      {/* Add Address Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Previous Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Enter a postcode to search for addresses to add to your previous addresses list.
              </Text>

              {/* Message Components */}
              {error && <ErrorMessage message={error} />}
              {success && <SuccessMessage message={success} />}
              {warning && <WarningMessage message={warning} />}

              {/* Postcode Input */}
              <HStack spacing={4}>
                <Input
                  placeholder="Postcode"
                  size="lg"
                  flex="3"
                  height="56px"
                  value={modalPostcode}
                  onChange={(e) => setModalPostcode(e.target.value)}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                />
                <Button
                  onClick={handleModalFind}
                  bg={config.primaryColor}
                  color="black"
                  _hover={{ bg: `${config.primaryColor}CC` }}
                  fontWeight="medium"
                  isLoading={modalLoading}
                  loadingText="Finding..."
                  h="48px"
                  borderRadius="full"
                  rightIcon={<Text as="span" ml={1}>→</Text>}
                >
                  Find
                </Button>
              </HStack>

              {/* Address Dropdown */}
              {modalAddresses.length > 0 && (
                <Box
                  border="2px solid #E2E8F0"
                  borderRadius="md"
                  mb={4}
                  cursor="pointer"
                  onClick={() => setModalOpenDropdown(!modalOpenDropdown)}
                >
                  <Flex alignItems="center" justifyContent="space-between" p={4}>
                    <Text fontSize="md" color="black" fontWeight="medium" noOfLines={1}>
                      {modalSelectedId !== null ? modalAddresses.find((a) => a.id === modalSelectedId)?.label : 'Select'}
                    </Text>
                    <ChevronDown
                      size={20}
                      color="#4A5568"
                      style={{
                        transform: modalOpenDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </Flex>
                  {modalOpenDropdown && (
                    <Box borderTop="1px solid #E2E8F0" maxH="240px" overflowY="auto">
                      {modalAddresses.map((addr) => (
                        <Box
                          key={addr.id}
                          p={3}
                          _hover={{ bg: config.accentLightColor }}
                          bg={modalSelectedId === addr.id ? '#F7FAFC' : 'transparent'}
                          onClick={() => {
                            setModalSelectedId(addr.id);
                            setModalOpenDropdown(false);
                          }}
                        >
                          <Text fontSize="md" color="gray.900">
                            {addr.label}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Selected Address Preview */}
              {modalSelectedId !== null && (
                <Box
                  border="2px solid"
                  borderColor={config.completedColor}
                  bg={config.primaryLightColor}
                  borderRadius="md"
                  p={4}
                  mb={6}
                >
                  <Text whiteSpace="pre-line" fontSize="sm" color="gray.800">
                    {modalAddresses.find((a) => a.id === modalSelectedId)?.lines}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg={config.primaryColor}
              color="black"
              _hover={{ bg: `${config.primaryColor}CC` }}
              onClick={handleAddAddress}
              isDisabled={modalSelectedId === null}
              borderRadius="xl"
            >
              Add Address
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PreviousAddressesPage;