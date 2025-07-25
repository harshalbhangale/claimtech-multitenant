// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   VStack,
//   Text,
//   Box,
//   Flex,
//   Button,
//   Icon,
//   useToast,
//   Spinner,
//   Alert,
//   AlertIcon,
// } from '@chakra-ui/react';
// import { Check, X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { Header } from '../Common/Header';
// import { Footer } from '../Common/Footer';
// import { SecureBar } from '../Common/Securebar';
// import { useTenant } from '../../../contexts/TenantContext';
// import NextButton from '../Common/NextButton';
// import Trustpilot from '../Common/Trustpilot';
// import { fetchUserAddresses } from '../../../api/services/addressMatch';
// import type { BestMatchAddress } from '../../../api/services/addressMatch';
// import { inviteUser } from '../../../api/services/inviteUser';
// import { storeOtpReference } from '../../../api/services/verifyOTP';

// export const PreviousAddressesPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { config } = useTenant();
//   const toast = useToast();
//   const [addresses, setAddresses] = useState<BestMatchAddress[]>([]);
//   const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [authError, setAuthError] = useState<string | null>(null);
//   const [addressError, setAddressError] = useState<string | null>(null);
//   const [retryCount, setRetryCount] = useState(0);

//   // Check if user is authenticated
//   useEffect(() => {
//     const accessToken = localStorage.getItem('access_token');
//     if (!accessToken) {
//       setAuthError('No access token found. Please login again.');
//       toast({
//         title: 'Authentication Required',
//         description: 'Please login to continue.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//       // Redirect to registration/login page
//       setTimeout(() => {
//         navigate('/auth/contactdetails');
//       }, 3000);
//       return;
//     }
//   }, [navigate, toast]);

//   // Fetch addresses on component mount
//   useEffect(() => {
//     const loadAddresses = async () => {
//       try {
//         setLoading(true);
//         setAuthError(null);
//         setAddressError(null);
        
//         console.log('Fetching user addresses...');
//         const fetchedAddresses = await fetchUserAddresses();
//         console.log('Fetched addresses:', fetchedAddresses);
//         console.log('Number of addresses:', fetchedAddresses.length);
        
//         setAddresses(fetchedAddresses);
//       } catch (error: any) {
//         console.error('Error loading addresses:', error);
        
//         if (error.message?.includes('Session expired') || error.message?.includes('No access token')) {
//           setAuthError(error.message);
//           toast({
//             title: 'Session Expired',
//             description: 'Please login again to continue.',
//             status: 'error',
//             duration: 5000,
//             isClosable: true,
//           });
//           // Redirect to login/registration
//           setTimeout(() => {
//             navigate('/auth/contactdetails');
//           }, 3000);
//         } else if (error.message?.includes('timeout')) {
//           setAddressError('The request timed out. You can still continue to the next step.');
//           toast({
//             title: 'Address Loading Timeout',
//             description: 'Unable to load addresses due to slow connection. You can continue without reviewing addresses.',
//             status: 'warning',
//             duration: 7000,
//             isClosable: true,
//           });
//         } else {
//           setAddressError(error.message || 'Failed to load addresses');
//           toast({
//             title: 'Error Loading Addresses',
//             description: error.message || 'Failed to load addresses. You can still continue to the next step.',
//             status: 'error',
//             duration: 5000,
//             isClosable: true,
//           });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Only load addresses if we don't have an auth error
//     if (!authError) {
//       loadAddresses();
//     }
//   }, [toast, navigate, authError]);

//   // Retry function for address loading
//   const retryLoadAddresses = async () => {
//     setRetryCount(prev => prev + 1);
//     setAddressError(null);
//     setLoading(true);
    
//     try {
//       console.log(`Retrying address fetch (attempt ${retryCount + 1})...`);
//       const fetchedAddresses = await fetchUserAddresses();
//       console.log('Retry successful - fetched addresses:', fetchedAddresses);
//       setAddresses(fetchedAddresses);
//       setAddressError(null);
//     } catch (error: any) {
//       console.error('Retry failed:', error);
//       setAddressError(error.message || 'Failed to load addresses');
      
//       toast({
//         title: 'Retry Failed',
//         description: 'Still unable to load addresses. You can continue without reviewing them.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle address selection
//   const toggleAddressSelection = (addressId: string) => {
//     setSelectedAddresses(prev =>
//       prev.includes(addressId)
//         ? prev.filter(id => id !== addressId)
//         : [...prev, addressId]
//     );
//   };

//   // Remove address from list
//   const removeAddress = (addressId: string) => {
//     setAddresses(prev => prev.filter(addr => addr.address_id !== addressId));
//     setSelectedAddresses(prev => prev.filter(id => id !== addressId));
//   };

//   // Format address for display
//   const formatAddress = (address: BestMatchAddress): string => {
//     // Create an array of address parts in order
//     const addressParts = [];
    
//     // Add main address if it exists and is not empty
//     if (address.address && address.address.trim() && address.address !== '""') {
//       addressParts.push(address.address);
//     }
    
//     // Add numbered address parts (address1-address5) if they exist
//     const numberedParts = [
//       address.address1,
//       address.address2, 
//       address.address3,
//       address.address4,
//       address.address5
//     ].filter(part => part && part.trim() && part !== '""');
    
//     addressParts.push(...numberedParts);
    
//     // Add city if it exists
//     if (address.city && address.city.trim() && address.city !== '""') {
//       addressParts.push(address.city);
//     }
    
//     // Add region if it exists
//     if (address.region && address.region.trim() && address.region !== '""') {
//       addressParts.push(address.region);
//     }
    
//     // Add postcode if it exists
//     if (address.postcode && address.postcode.trim() && address.postcode !== '""') {
//       addressParts.push(address.postcode);
//     }
    
//     // Return formatted address or fallback
//     return addressParts.length > 0 
//       ? addressParts.join(', ') 
//       : `Address ID: ${address.address_id}`;
//   };

//   const handleNextStep = async () => {
//     setIsSubmitting(true);
    
//     try {
//       // Save selected addresses to localStorage if needed
//       if (selectedAddresses.length > 0) {
//         localStorage.setItem('selected_addresses', JSON.stringify(selectedAddresses));
//         console.log('Selected addresses saved:', selectedAddresses);
//       }
      
//       // Call invite API to send OTP
//       console.log('Calling invite API...');
//       const inviteResponse = await inviteUser();
//       console.log('Invite response:', inviteResponse);

//       // Store OTP reference for verification
//       if (inviteResponse.invite_response?.Info?.Data?.reference) {
//         const reference = inviteResponse.invite_response.Info.Data.reference;
//         storeOtpReference(reference);
//         console.log('OTP reference stored:', reference);
        
//         toast({
//           title: "Processing Complete",
//           description: "Please check your phone for the verification code.",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });

//         // Navigate to OTP verification page
//         navigate('/auth/otpverify');
//       } else {
//         console.error('No OTP reference found in invite response:', inviteResponse);
//         throw new Error('No OTP reference received from invite request');
//       }
      
//     } catch (error: any) {
//       console.error('Error sending invite:', error);
      
//       let errorMessage = 'Failed to proceed. Please try again.';
      
//       if (error.message?.includes('Session expired') || error.message?.includes('No access token')) {
//         errorMessage = 'Session expired. Please login again.';
//         // Redirect to login
//         setTimeout(() => {
//           navigate('/auth/contactdetails');
//         }, 2000);
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       toast({
//         title: "Error",
//         description: errorMessage,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Show authentication error if exists
//   if (authError) {
//     return (
//       <Box minH="100vh" bg="white" w="100%">
//         <Header />
//         <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 4, sm: 6, lg: 8 }}>
//           <VStack spacing={{ base: 4, md: 6 }} align="stretch">
//             <Alert status="error" borderRadius="lg">
//               <AlertIcon />
//               <Box>
//                 <Text fontWeight="bold">Authentication Required</Text>
//                 <Text fontSize="sm">{authError}</Text>
//               </Box>
//             </Alert>
//           </VStack>
//         </Container>
//       </Box>
//     );
//   }

//   // Debug log
//   console.log('Component render - addresses state:', addresses);
//   console.log('Component render - loading state:', loading);
//   console.log('Component render - authError state:', authError);

//   return (
//     <Box minH="100vh" bg="white" w="100%">
//       <Header />

//       <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 4, sm: 6, lg: 8 }}>
//         <VStack spacing={{ base: 4, md: 6 }} align="stretch">
//           {/* Form Section */}
//           <Box border="2px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
//             <Text
//               fontSize={{ base: "xl", md: "2xl" }}
//               fontWeight="bold"
//               mb={3}
//               color="gray.900"
//             >
//               Review your previous addresses
//             </Text>
//             <Text color="gray.600" mb={6} fontSize={{ base: "sm", md: "md" }}>
//               We found these addresses associated with your details. Please select the ones that match your previous addresses or remove any that don't belong to you.
//             </Text>

//             {loading ? (
//               <Flex justify="center" align="center" py={8}>
//                 <Spinner size="lg" color={config.accentColor} />
//                 <Text ml={4} color="gray.600">Loading your addresses...</Text>
//               </Flex>
//             ) : addressError ? (
//               <Box
//                 textAlign="center"
//                 py={8}
//                 px={4}
//                 bg="orange.50"
//                 borderRadius="lg"
//                 border="1px solid"
//                 borderColor="orange.200"
//               >
//                 <Text color="orange.800" fontSize="md" fontWeight="bold" mb={2}>
//                   Unable to Load Addresses
//                 </Text>
//                 <Text color="orange.700" fontSize="sm" mb={4}>
//                   {addressError}
//                 </Text>
//                 <VStack spacing={3}>
//                   <Button
//                     size="sm"
//                     colorScheme="orange"
//                     onClick={retryLoadAddresses}
//                     isLoading={loading}
//                     loadingText="Retrying..."
//                   >
//                     Try Again
//                   </Button>
//                   <Text color="gray.600" fontSize="xs">
//                     You can continue without reviewing addresses by clicking "Next step" below
//                   </Text>
//                 </VStack>
//               </Box>
//             ) : addresses.length === 0 ? (
//               <Box
//                 textAlign="center"
//                 py={8}
//                 px={4}
//                 bg="gray.50"
//                 borderRadius="lg"
//                 border="1px solid"
//                 borderColor="gray.200"
//               >
//                 <Text color="gray.600" fontSize="md" mb={4}>
//                   No additional addresses found for your account.
//                 </Text>
//                 <Text color="gray.500" fontSize="sm">
//                   You can continue to the next step to proceed with OTP verification.
//                 </Text>
//                 <Text color="gray.400" fontSize="xs" mt={2}>
//                   Debug: Found {addresses.length} addresses
//                 </Text>
//               </Box>
//             ) : (
//               <VStack spacing={3} align="stretch" mb={6}>
//                 {addresses.map((address) => {
//                   const isSelected = selectedAddresses.includes(address.address_id);
//                   const formattedAddress = formatAddress(address);
                  
//                   return (
//                     <Box
//                       key={address.address_id}
//                       p={4}
//                       borderRadius="lg"
//                       border="2px"
//                       borderColor={isSelected ? config.accentColor : 'gray.200'}
//                       bg={isSelected ? '#F3F0FF' : 'white'}
//                       transition="all 0.2s"
//                       _hover={{
//                         borderColor: isSelected ? config.accentColor : 'gray.300',
//                         bg: isSelected ? '#F3F0FF' : 'gray.50'
//                       }}
//                     >
//                       <Flex justify="space-between" align="flex-start" gap={4}>
//                         <Flex flex="1" align="flex-start" gap={3}>
//                           {/* Selection Checkbox */}
//                           <Box
//                             w="24px"
//                             h="24px"
//                             borderRadius="full"
//                             border="2px"
//                             borderColor={isSelected ? config.accentColor : 'gray.300'}
//                             bg="white"
//                             display="flex"
//                             alignItems="center"
//                             justifyContent="center"
//                             cursor="pointer"
//                             onClick={() => toggleAddressSelection(address.address_id)}
//                             flexShrink={0}
//                             mt={1}
//                           >
//                             <Icon 
//                               as={Check} 
//                               w={3} 
//                               h={3} 
//                               color={isSelected ? config.accentColor : 'transparent'}
//                               strokeWidth={3}
//                             />
//                           </Box>

//                           {/* Address Details */}
//                           <Box flex="1" cursor="pointer" onClick={() => toggleAddressSelection(address.address_id)}>
//                             <Text
//                               fontSize="md"
//                               fontWeight={isSelected ? "bold" : "medium"}
//                               color="gray.900"
//                               lineHeight="1.4"
//                             >
//                               {formattedAddress}
//                             </Text>
//                             <Text fontSize="sm" color="gray.500" mt={1}>
//                               Address ID: {address.address_id}
//                             </Text>
//                           </Box>
//                         </Flex>

//                         {/* Remove Button */}
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           colorScheme="red"
//                           onClick={() => removeAddress(address.address_id)}
//                           p={2}
//                           minW="auto"
//                           height="auto"
//                           borderRadius="full"
//                           _hover={{ bg: 'red.50' }}
//                         >
//                           <Icon as={X} w={4} h={4} />
//                         </Button>
//                       </Flex>
//                     </Box>
//                   );
//                 })}
//               </VStack>
//             )}

//             {/* Selection Summary */}
//             {addresses.length > 0 && (
//               <Box
//                 bg="blue.50"
//                 border="1px solid"
//                 borderColor="blue.200"
//                 borderRadius="lg"
//                 p={4}
//                 mb={6}
//               >
//                 <Text fontSize="sm" color="blue.800">
//                   <strong>{selectedAddresses.length}</strong> of <strong>{addresses.length}</strong> addresses selected
//                 </Text>
//               </Box>
//             )}

//             {/* Next Step Button */}
//             <NextButton 
//               onClick={handleNextStep} 
//               isLoading={isSubmitting}
//               label={isSubmitting ? "Sending verification code..." : "Next step"}
//             />

//             {/* Bottom Centered Content */}
//             <VStack spacing={4} align="center" mt={6}>
//               {/* Trustpilot Rating */}
//               <Trustpilot size="md" />
//             </VStack>
//           </Box>

//           {/* Bottom Features */}
//           <Box w="full" maxW={{ base: "full", md: "2xl" }}>
//             <SecureBar />
//           </Box>
//         </VStack>
//       </Container>

//       <Footer />
//     </Box>
//   );
// };

// export default PreviousAddressesPage;


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
import { X, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import NextButton from '../Common/NextButton';
import Trustpilot from '../Common/Trustpilot';
import { fetchUserAddresses } from '../../../api/services/addressMatch';
import type { BestMatchAddress } from '../../../api/services/addressMatch';
import { fetchAddressesByPostcode } from '../../../api/services/addressCheck';
import type { RawAddress, FormattedAddress } from '../../../types/address';
import { inviteUser } from '../../../api/services/inviteUser';
import { storeOtpReference } from '../../../api/services/verifyOTP';
import api from '../../../api/index';

export const PreviousAddressesPage: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Main addresses state
  const [addresses, setAddresses] = useState<BestMatchAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Modal states for adding addresses
  const [modalPostcode, setModalPostcode] = useState('');
  const [modalAddresses, setModalAddresses] = useState<FormattedAddress[]>([]);
  const [modalRawAddresses, setModalRawAddresses] = useState<RawAddress[]>([]);
  const [modalSelectedId, setModalSelectedId] = useState<number | null>(null);
  const [modalOpenDropdown, setModalOpenDropdown] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Utility: localStorage key
  const LOCAL_STORAGE_KEY = 'previous_addresses';

  // Check if user is authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setAuthError('No access token found. Please login again.');
      toast({
        title: 'Authentication Required',
        description: 'Please login to continue.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate('/auth/contactdetails');
      }, 3000);
      return;
    }
  }, [navigate, toast]);

  // Load addresses from localStorage or API on mount
  useEffect(() => {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {
        // fallback to API fetch
      }
    }
    // If not in localStorage, fetch from API
    const loadAddresses = async () => {
      try {
        setLoading(true);
        setAuthError(null);
        setAddressError(null);
        const fetchedAddresses = await fetchUserAddresses();
        setAddresses(fetchedAddresses);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fetchedAddresses));
      } catch (error: any) {
        setAddressError(error.message || 'Failed to load addresses');
        toast({
          title: 'Error Loading Addresses',
          description: error.message || 'Failed to load addresses. You can still continue to the next step.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    loadAddresses();
  }, [toast, navigate, authError]);

  // Whenever addresses change, update localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

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
  const removeAddress = (addressId: string) => {
    setAddresses(prev => {
      const updated = prev.filter(addr => addr.address_id !== addressId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    toast({
      title: "Address Removed",
      description: "Address has been removed from your list.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Modal functions for adding addresses
  const validPostcode = (pc: string): boolean => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(pc.replace(/\s/g, ''));
  };

  const handleModalFind = async () => {
    const pc = modalPostcode.trim();
    if (!validPostcode(pc)) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid UK postcode",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setModalLoading(true);
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
      toast({
        title: "Error",
        description: "Failed to find addresses for this postcode",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
        toast({
          title: "Address Already Added",
          description: "This address is already in your list.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setAddresses(prev => {
          const updated = [...prev, newAddress];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        toast({
          title: "Address Added",
          description: "Address has been added to your list.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
      }
    }
  };

  // Submit addresses to backend
  const submitAddresses = async (addressesToSubmit: BestMatchAddress[]) => {
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
    
    try {
      // Submit addresses to backend if any exist
      if (addresses.length > 0) {
        console.log('Submitting addresses to backend...');
        const addressResponse = await submitAddresses(addresses);
        console.log('Address submission successful:', addressResponse);
      }
      
      // Call invite API to send OTP
      console.log('Calling invite API...');
      const inviteResponse = await inviteUser();
      console.log('Invite response:', inviteResponse);

      // Store OTP reference for verification
      if (inviteResponse.invite_response?.Info?.Data?.reference) {
        const reference = inviteResponse.invite_response.Info.Data.reference;
        storeOtpReference(reference);
        console.log('OTP reference stored:', reference);
        
        toast({
          title: "Processing Complete",
          description: "Please check your phone for the verification code.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Navigate to OTP verification page
        navigate('/auth/otpverify');
      } else {
        console.error('No OTP reference found in invite response:', inviteResponse);
        throw new Error('No OTP reference received from invite request');
      }
      
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
              Review your previous addresses
            </Text>
            <Text color="gray.600" mb={4} fontSize={{ base: "sm", md: "md" }}>
              We found these addresses associated with your details. Remove any that don't belong to you or add additional previous addresses.
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
              <Box
                textAlign="center"
                py={8}
                px={4}
                bg="orange.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="orange.200"
              >
                <Text color="orange.800" fontSize="md" fontWeight="bold" mb={2}>
                  Unable to Load Addresses
                </Text>
                <Text color="orange.700" fontSize="sm" mb={4}>
                  {addressError}
                </Text>
                <Text color="gray.600" fontSize="xs">
                  You can continue without reviewing addresses by clicking "Next step" below
                </Text>
              </Box>
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
                <Text color="gray.600" fontSize="md" mb={4}>
                  No additional addresses found for your account.
                </Text>
                <Text color="gray.500" fontSize="sm">
                  You can add previous addresses using the button above or continue to the next step.
                </Text>
              </Box>
            ) : (
              <VStack spacing={3} align="stretch" mb={6}>
                {addresses.map((address) => {
                  const formattedAddress = formatAddress(address);
                  
                  return (
                    <Box
                      key={address.address_id}
                      p={4}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="gray.200"
                      bg="white"
                      transition="all 0.2s"
                      _hover={{
                        borderColor: 'gray.300',
                        bg: 'gray.50'
                      }}
                    >
                      <Flex justify="space-between" align="flex-start" gap={4}>
                        <Box flex="1">
                          <Text
                            fontSize="md"
                            fontWeight="medium"
                            color="gray.900"
                            lineHeight="1.4"
                          >
                            {formattedAddress}
                          </Text>
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            Address ID: {address.address_id}
                          </Text>
                        </Box>

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
                </Text>
              </Box>
            )}

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
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Previous Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Enter a postcode to search for addresses to add to your previous addresses list.
              </Text>

              {/* Postcode Input */}
              <HStack spacing={4}>
                <Input
                  placeholder="Postcode"
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
                  _hover={{ bg: config.accentColor }}
                  fontWeight="medium"
                  isLoading={modalLoading}
                  loadingText="Finding..."
                >
                  Find
                </Button>
              </HStack>

              {/* Address Dropdown */}
              {modalAddresses.length > 0 && (
                <Box
                  border="2px solid #E2E8F0"
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => setModalOpenDropdown(!modalOpenDropdown)}
                >
                  <Flex alignItems="center" justifyContent="space-between" p={4}>
                    <Text fontSize="md" color="black" fontWeight="medium" noOfLines={1}>
                      {modalSelectedId !== null ? modalAddresses.find((a) => a.id === modalSelectedId)?.label : 'Select Address'}
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
                    <Box borderTop="1px solid #E2E8F0" maxH="200px" overflowY="auto">
                      {modalAddresses.map((addr) => (
                        <Box
                          key={addr.id}
                          p={3}
                          _hover={{ bg: '#F7FAFC' }}
                          bg={modalSelectedId === addr.id ? '#F7FAFC' : 'transparent'}
                          onClick={() => {
                            setModalSelectedId(addr.id);
                            setModalOpenDropdown(false);
                          }}
                        >
                          <Text fontSize="sm" color="gray.900">
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
              _hover={{ bg: config.accentColor }}
              onClick={handleAddAddress}
              isDisabled={modalSelectedId === null}
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