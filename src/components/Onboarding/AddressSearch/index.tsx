import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { ProgressBar } from '../Common/ProgressBar';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import Trustpilot from '../../Onboarding/Common/Trustpilot';
import { fetchAddressesByPostcode } from '../../../api/services/addressCheck';
import { saveSelectedAddress, getSelectedAddress } from '../../../utils/addressStorage';
import type { RawAddress, FormattedAddress } from '../../../types/address';

const AddressSearch: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState<FormattedAddress[]>([]);
  const [rawAddresses, setRawAddresses] = useState<RawAddress[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Load previously selected address on component mount
  useEffect(() => {
    const savedAddress = getSelectedAddress();
    if (savedAddress) {
      // Pre-fill with saved data
      setPostcode(extractPostcodeFromAddress(savedAddress.address.label));
      setAddresses([savedAddress.address]);
      setRawAddresses([savedAddress.raw]);
      setSelectedId(savedAddress.address.id);
    }
  }, []);

  const extractPostcodeFromAddress = (addressLabel: string): string => {
    // Extract postcode from address label (last part after last comma)
    const parts = addressLabel.split(', ');
    return parts[parts.length - 1] || '';
  };

  const validPostcode = (pc: string): boolean => {
    // UK postcodes follow various formats, this regex covers most common formats
    // For example: SW1A 1AA, M1 1AA, B33 8TH, CR2 6XH, DN55 1PT
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(pc.replace(/\s/g, ''));
  };

  const handleFind = () => {
    const pc = postcode.trim();
    if (!validPostcode(pc)) {
      alert('Please enter a valid UK postcode ');
      return;
    }

    const getAddresses = async () => {
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

      setAddresses(formatted);
      setRawAddresses(rawResults);
      setSelectedId(null);
    };

    getAddresses();
  };

  const handleNext = () => {
    if (selectedId === null) return;

    const selectedAddress = addresses.find((a) => a.id === selectedId);
    const selectedRaw = rawAddresses.find((_, idx) => idx === selectedId);
    
    if (selectedAddress && selectedRaw) {
      // Save selected address to localStorage
      saveSelectedAddress(selectedAddress, selectedRaw);
      console.log('Selected Address saved:', selectedAddress);
    }
    
    navigate('/auth/contactdetails');
  };

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Progress Indicator */}
          <ProgressBar currentStep={3} totalSteps={4} />

          {/* Card */}
          <Box border="2px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            {/* Heading */}
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb={3} color="gray.900">
              Your address
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.900" mb={6}>
              We need your current address to search for your finance agreements. Start by entering your postcode below.
            </Text>

            {/* Postcode Input and Button */}
            <HStack spacing={4} mb={addresses.length ? 4 : 6} w="full">
              <Input
                placeholder="Postcode"
                size="lg"
                flex="3"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                height="56px"
              />
              <Button
                flex="1"
                bg={config.primaryColor}
                color="black"
                h="56px"
                borderRadius="full"
                _hover={{ bg : config.accentColor }}
                onClick={handleFind}
                fontWeight="medium"
                rightIcon={<Text as="span" ml={1}>→</Text>}
              >
                Find
              </Button>
            </HStack>

            {addresses.length > 0 && (
              <>
                <Box
                  border="2px solid #E2E8F0"
                  borderRadius="md"
                  mb={4}
                  cursor="pointer"
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  <Flex alignItems="center" justifyContent="space-between" p={4}>
                    <Text fontSize="md" color="black" fontWeight="medium" noOfLines={1}>
                      {selectedId !== null ? addresses.find((a) => a.id === selectedId)?.label : 'Select'}
                    </Text>
                    <ChevronDown
                      size={20}
                      color="#4A5568"
                      style={{
                        transform: openDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </Flex>
                  {openDropdown && (
                    <Box borderTop="1px solid #E2E8F0" maxH="240px" overflowY="auto">
                      {addresses.map((addr) => (
                        <Box
                          key={addr.id}
                          p={3}
                          _hover={{ bg: '#F7FAFC' }}
                          bg={selectedId === addr.id ? '#F7FAFC' : 'transparent'}
                          onClick={() => {
                            setSelectedId(addr.id);
                            setOpenDropdown(false);
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

                {selectedId !== null && (
                  <Box
                    border="2px solid"
                    borderColor={config.completedColor}
                    bg={config.primaryLightColor}
                    borderRadius="md"
                    p={4}
                    mb={6}
                  >
                    <Text whiteSpace="pre-line" fontSize="sm" color="gray.800">
                      {addresses.find((a) => a.id === selectedId)?.lines}
                    </Text>
                  </Box>
                )}
              </>
            )}

            {/* Next Step */}
            <Button
              w="full"
              bg={config.primaryColor}
              color="black"
              p={6}
              mb={6}
              onClick={handleNext}
              _hover={{ bg: '#A8EF7D' }}
              _active={{ transform: 'scale(0.98)' }}
              fontWeight="medium"
              height="auto"
              fontSize="md"
              borderRadius="full"
              rightIcon={<Text as="span" ml={1}>→</Text>}
              minH="56px"
              isDisabled={selectedId === null}
            >
              Next step
            </Button>

            {/* Trustpilot */}
            <Trustpilot size="md" />
          </Box>
          <Box w="full" maxW={{ base: 'full', md: '2xl' }}>
            <SecureBar />
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default AddressSearch;
export { AddressSearch };
