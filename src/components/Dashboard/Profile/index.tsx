import React, { useState } from 'react';
import {
  Container,
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Image,
  useToast,
  Skeleton,
  Badge,
  Icon,
} from '@chakra-ui/react';

import { DocumentCheckIcon, ArrowRightOnRectangleIcon, ChevronRightIcon, CheckIcon, ArrowDownTrayIcon, PencilIcon, ExclamationTriangleIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useProfile } from '../../../hooks/queries/useProfile';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../../contexts/TenantContext';
import { Header } from '../Main/Header';
import { downloadIDDocument } from '../../../api/services/dashboard/downloadIDDocument';
import { useIDDocumentStatus } from '../../../hooks/queries/useIDDocumentStatus';

const Profile: React.FC = () => {
  const { data: profile, isLoading, error } = useProfile();
  const navigate = useNavigate();
  const toast = useToast();
  const { config } = useTenant();
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: hasIDDocument, isLoading: isCheckingID } = useIDDocumentStatus();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/auth/login');
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDownloadDocument = async () => {
    setIsDownloading(true);
    try {
      await downloadIDDocument();
      toast({
        title: "Document downloaded",
        description: "Your ID document has been downloaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download your ID document. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpdateDocument = () => {
    window.location.href = '/dashboard/documentupload';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith('44')) {
      return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
    }
    return phone;
  };

  const formatAddress = (address: any) => {
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.address_line_3,
      address.address_line_4,
      address.city,
      address.region,
      address.postcode,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg="white">
        <Header />
        <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
          <VStack spacing={6} align="stretch">
            <Skeleton height="40px" />
            <Skeleton height="200px" />
            <Skeleton height="200px" />
            <Skeleton height="200px" />
            <Skeleton height="200px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="white">
        <Header />
        <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
          <Box textAlign="center" py={10}>
            <Text color="red.500" fontSize="lg" fontWeight="medium">
              Failed to load profile. Please try again.
            </Text>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box minH="100vh" bg="white">
        <Header />
        <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
          <Box textAlign="center" py={10}>
            <Text color="gray.500" fontSize="lg">
              No profile data available.
            </Text>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
        <VStack spacing={6} align="stretch">
          {/* Page Title */}
          <Text 
            color="gray.700" 
            mb={2} 
            mt={10} 
            fontSize="lg" 
            fontWeight="bold"
            fontFamily="Poppins"
          >
            Account details
          </Text>

          {/* Quick Actions */}
          <VStack spacing={4} mb={4} align="stretch">
            {/* Open Claims */}
            <Box
              as="button"
              bg="white"
              p={5}
              borderRadius="xl"
              boxShadow="sm"
              border="1.5px solid"
              borderColor="gray.100"
              _hover={{ bg: 'gray.50', borderColor: 'gray.200' }}
              w="full"
              transition="all 0.2s"
              onClick={() => navigate('/dashboard')}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius="full"
                    bg={config.accentLightColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px solid"
                    borderColor={config.accentLightColor}
                  >
                    <Icon as={DocumentCheckIcon} w={6} h={6} color={config.accentColor} />
                  </Box>
                  <Text fontFamily="Poppins" fontSize="lg" fontWeight="medium">
                    Open Claims
                  </Text>
                </HStack>
                <Icon as={ChevronRightIcon} w={6} h={6} color="gray.400" />
              </HStack>
            </Box>

            {/* Logout */}
            <Box
              as="button"
              bg="white"
              p={5}
              borderRadius="xl"
              boxShadow="sm"
              border="1.5px solid"
              borderColor="gray.100"
              _hover={{ bg: 'gray.50', borderColor: 'gray.200' }}
              w="full"
              transition="all 0.2s"
              onClick={handleLogout}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius="full"
                    bg={config.accentLightColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px solid"
                    borderColor={config.accentLightColor}
                  >
                    <Icon as={ArrowRightOnRectangleIcon} w={6} h={6} color={config.accentColor} />
                  </Box>
                  <Text fontFamily="Poppins" fontSize="lg" fontWeight="medium">
                    Log out
                  </Text>
                </HStack>
                <Icon as={ChevronRightIcon} w={6} h={6} color="gray.400" />
              </HStack>
            </Box>
          </VStack>

          {/* Personal Information */}
          <Box 
            bg="white" 
            p={6} 
            borderRadius="xl" 
            mb={6} 
            border="1.5px solid"
            borderColor="gray.100"
            boxShadow="sm"
          >
            <Text fontWeight="bold" mb={6} fontFamily="Poppins" fontSize="lg">
              Personal Information
            </Text>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">Full Name:</Text>
                <Text fontFamily="Poppins" fontSize="md" fontWeight="medium">
                  {profile.first_name} {profile.last_name}
                </Text>
              </HStack>
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">Email:</Text>
                <Text fontFamily="Poppins" fontSize="md" fontWeight="medium">
                  {profile.email}
                </Text>
              </HStack>
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">Phone:</Text>
                <Text fontFamily="Poppins" fontSize="md" fontWeight="medium">
                  {formatPhoneNumber(profile.phone_number)}
                </Text>
              </HStack>
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">Date of Birth:</Text>
                <Text fontFamily="Poppins" fontSize="md" fontWeight="medium">
                  {formatDate(profile.date_of_birth)}
                </Text>
              </HStack>
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">Member Since:</Text>
                <Text fontFamily="Poppins" fontSize="md" fontWeight="medium">
                  {formatDate(profile.created_at)}
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Current Address */}
          <Box 
            bg="white" 
            p={6} 
            borderRadius="xl" 
            mb={6} 
            border="1.5px solid"
            borderColor="gray.100"
            boxShadow="sm"
          >
            <HStack justify="space-between" mb={6}>
              <Text fontWeight="bold" fontFamily="Poppins" fontSize="lg">
                Current Address
              </Text>
              <Badge colorScheme="green" variant="subtle" fontFamily="Poppins">
                Current
              </Badge>
            </HStack>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">Address:</Text>
                <Text fontFamily="Poppins" fontSize="md" fontWeight="medium" textAlign="right" maxW="60%">
                  {formatAddress(profile.address)}
                </Text>
              </HStack>
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">Postcode:</Text>
                <Text fontSize="md" fontWeight="medium" fontFamily="mono">
                  {profile.address.postcode}
                </Text>
              </HStack>
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">City:</Text>
                <Text fontFamily="Poppins" fontSize="md" fontWeight="medium">
                  {profile.address.city}
                </Text>
              </HStack>
              <HStack justify="space-between" py={2}>
                <Text fontFamily="Poppins" fontSize="md" color="gray.600">Region:</Text>
                <Text fontFamily="Poppins" fontSize="md" fontWeight="medium">
                  {profile.address.region}
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Previous Addresses - Only show if there are previous addresses */}
          {profile.previous_addresses && profile.previous_addresses.length > 0 && (
            <Box 
              bg="white" 
              p={6} 
              borderRadius="xl" 
              mb={6} 
              border="1.5px solid"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <HStack justify="space-between" mb={6}>
                <Text fontWeight="bold" fontFamily="Poppins" fontSize="lg">
                  Previous Addresses
                </Text>
                <Badge colorScheme="orange" variant="subtle" fontFamily="Poppins">
                  {profile.previous_addresses.length} addresses
                </Badge>
              </HStack>
              <VStack spacing={4} align="stretch">
                {profile.previous_addresses.map((address, index) => (
                  <Box 
                    key={index} 
                    p={4} 
                    bg="gray.50" 
                    borderRadius="lg" 
                    border="1px solid" 
                    borderColor="gray.200"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontFamily="Poppins" fontSize="md" fontWeight="medium" color="gray.700">
                        Address {index + 1}
                      </Text>
                      <Badge colorScheme="gray" variant="subtle" fontFamily="Poppins">
                        Previous
                      </Badge>
                    </HStack>
                    <Text fontFamily="Poppins" fontSize="md" color="gray.600" mb={2}>
                      {formatAddress(address)}
                    </Text>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.500" fontFamily="Poppins">
                        Postcode: {address.postcode}
                      </Text>
                      <Text fontSize="sm" color="gray.500" fontFamily="Poppins">
                        City: {address.city}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          {/* ID Document - Only show if document exists */}
          {!isCheckingID && hasIDDocument && (
            <Box 
              bg="white" 
              p={6} 
              borderRadius="xl" 
              mb={6}
              border="1.5px solid"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <HStack justify="space-between" mb={0}>
                <Text fontWeight="bold" fontFamily="Poppins" fontSize="lg">
                  ID Document
                </Text>
              </HStack>
              <VStack spacing={4} align="stretch" mt={6}>
                <HStack 
                  p={4} 
                  bg="green.50" 
                  borderRadius="lg" 
                  border="1px solid" 
                  borderColor="green.200"
                  justify="center"
                >
                  <Icon as={CheckIcon} w={5} h={5} color="green.500" />
                  <Text fontSize="sm" color="green.700" fontFamily="Poppins" fontWeight="medium">
                    ID document uploaded successfully
                  </Text>
                </HStack>
                <Text color="gray.600" fontFamily="Poppins" fontSize="md">
                  Your uploaded ID document for verification purposes.
                </Text>
                <Box textAlign="center">
                  <Image
                    src={profile.id_document}
                    alt="ID Document"
                    maxH="400px"
                    borderRadius="lg"
                    boxShadow="md"
                    mx="auto"
                  />
                </Box>

                <HStack spacing={3}>
                  <Button
                    flex={1}
                    variant="outline"
                    color={config.accentColor}
                    borderColor={config.accentColor}
                    borderRadius="full"
                    fontFamily="Poppins"
                    fontWeight="semibold"
                    leftIcon={<Icon as={ArrowDownTrayIcon} w={4} h={4} strokeWidth={2}/>}
                    onClick={handleDownloadDocument}
                    isLoading={isDownloading}
                    loadingText="Downloading..."
                    _hover={{ bg: config.accentLightColor }}
                  >
                    Download
                  </Button>
                  <Button
                    flex={1}
                    variant="solid"
                    bg={config.accentColor}
                    color="white"
                    borderRadius="full"
                    fontFamily="Poppins"
                    fontWeight="semibold"
                    leftIcon={<Icon as={PencilIcon} w={4} h={4} strokeWidth={2}/>}
                    onClick={handleUpdateDocument}
                    _hover={{ bg: `${config.accentColor}80` }}
                  >
                    Update
                  </Button>
                </HStack>
              </VStack>
            </Box>
          )}

          {/* ID Document Upload Section - Show when no document exists */}
          {!isCheckingID && !hasIDDocument && (
            <Box 
              bg="white" 
              p={6} 
              borderRadius="xl" 
              mb={6}
              border="1.5px solid"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <HStack justify="space-between" mb={0}>
                <Text fontWeight="bold" fontFamily="Poppins" fontSize="lg">
                  ID Document
                </Text>
              </HStack>
              <VStack spacing={4} align="stretch" mt={6}>
                <HStack 
                  p={4} 
                  bg="orange.50" 
                  borderRadius="lg" 
                  border="1px solid" 
                  borderColor="orange.200"
                  justify="center"
                >
                  <Icon as={ExclamationTriangleIcon} w={5} h={5} color="orange.500" />
                  <Text fontSize="sm" color="orange.700" fontFamily="Poppins" fontWeight="medium">
                    No ID uploaded - Upload required to access all features
                  </Text>
                </HStack>
                <Button
                  w="full"
                  variant="solid"
                  bg={config.accentColor}
                  color="white"
                  borderRadius="full"
                  fontFamily="Poppins"
                  fontWeight="semibold"
                  leftIcon={<Icon as={DocumentIcon} w={4} h={4} strokeWidth={2}/>}
                  onClick={handleUpdateDocument}
                  _hover={{ bg: `${config.accentColor}80` }}
                >
                  Upload ID Document
                </Button>
              </VStack>
            </Box>
          )}

          {/* Signature */}
          <Box 
            bg="white" 
            p={6} 
            borderRadius="xl" 
            mb={6} 
            border="1.5px solid"
            borderColor="gray.100"
            boxShadow="sm"
          >
            <Text fontWeight="bold" mb={6} fontFamily="Poppins" fontSize="lg">
              Digital Signature
            </Text>
            <VStack spacing={4} align="stretch">
              <Text color="gray.600" fontFamily="Poppins" fontSize="md">
                Your digital signature for legal agreements and documents.
              </Text>
              <Box textAlign="center">
                <Image
                  src={profile.signature}
                  alt="Digital Signature"
                  maxH="200px"
                  borderRadius="lg"
                  boxShadow="md"
                  mx="auto"
                  bg="white"
                  p={4}
                />
              </Box>

            </VStack>
          </Box>

          {/* Continue Button */}
          <Button
            w="full"
            bg={config.primaryColor}
            color="black"
            size="lg"
            height="56px"
            borderRadius="full"
            _hover={{ bg: `${config.primaryColor}80` }}
            fontFamily="Poppins"
            fontSize="lg"
            fontWeight="semibold"
            boxShadow="sm"
            onClick={() => navigate('/dashboard')}
          >
            Continue
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile;
