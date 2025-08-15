import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  HStack,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { ProgressBar } from '../Common/ProgressBar';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import Trustpilot from '../../Onboarding/Common/Trustpilot';
import { fetchAddressesByPostcode } from '../../../api/services/onboarding/addressCheck';
import { saveSelectedAddress, getSelectedAddress } from '../../../utils/addressStorage';
import type { RawAddress, FormattedAddress } from '../../../types/address';
import NextButton from '../Common/NextButton';

const AddressSearch: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();

  const [postcode, setPostcode] = useState('');
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);

  const [addresses, setAddresses] = useState<FormattedAddress[]>([]);
  const [rawAddresses, setRawAddresses] = useState<RawAddress[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load previously selected address on mount
  useEffect(() => {
    const saved = getSelectedAddress();
    if (saved) {
      setPostcode(extractPostcodeFromAddress(saved.address.label));
      setAddresses([saved.address]);
      setRawAddresses([saved.raw]);
      setSelectedId(saved.address.id);
    }
  }, []);

  const extractPostcodeFromAddress = (addressLabel: string): string => {
    const parts = addressLabel.split(', ');
    return parts[parts.length - 1] || '';
    // assumes postcode is the last segment in label
  };

  // UK postcode validator (allows optional space, common formats)
  const validPostcode = (pc: string): boolean => {
    const norm = pc.trim().toUpperCase();
    const re = /^([A-Z]{1,2}[0-9][A-Z0-9]?)\s?[0-9][A-Z]{2}$/;
    return re.test(norm);
  };

  const handleFind = () => {
    const pc = postcode.trim();
    if (!validPostcode(pc)) {
      setPostcodeError('Please enter a valid UK postcode');
      if (postcodeRef.current) postcodeRef.current.focus();
      return;
    }
    setPostcodeError(null);

    setLoading(true);
    (async () => {
      try {
        const rawResults = await fetchAddressesByPostcode(pc);
        const formatted = rawResults.map((item, idx) => {
          const allParts = [
            item.address1, item.address2, item.address3, item.address4, item.address5,
            item.city, item.region, item.postcode,
          ].filter(Boolean);

          const addressLines = [
            item.address1, item.address2, item.address3, item.address4, item.address5,
            item.city, item.region,
          ].filter(Boolean);

          const displayParts = [...addressLines.slice(0, 3), item.postcode].filter(Boolean);

          return {
            id: idx,
            label: allParts.join(', '),
            lines: displayParts.join('\n'),
            address_id: item.address_id,
          };
        });

        setAddresses(formatted);
        setRawAddresses(rawResults);
        setSelectedId(null);
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleNext = () => {
    if (selectedId === null) return;
    const selectedAddress = addresses.find((a) => a.id === selectedId);
    const selectedRaw = rawAddresses.find((_, idx) => idx === selectedId);
    if (selectedAddress && selectedRaw) {
      saveSelectedAddress(selectedAddress, selectedRaw);
    }
    navigate('/auth/contactdetails');
  };

  // Enter key on postcode triggers find
  const handlePostcodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFind();
    }
  };

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Progress Indicator */}
          <ProgressBar currentStep={3} totalSteps={4} />

          {/* Card */}
          <Box border="2px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            {/* Heading */}
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb={3} color="gray.900">
              Your address
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.900">
              We need your <b style={{ color: '#4A5568' }}>current address</b> to ensure your <b style={{ color: '#4A5568' }}>finance agreements</b> are verified accurately
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.900" fontWeight="semibold" mt={2} mb={2}>
              Please enter your postcode and tap ‘find’
            </Text>

            {/* Postcode Input and Button */}
            <HStack spacing={4} mb={addresses.length ? 2 : 4} w="full">
              <Input
                ref={postcodeRef}
                placeholder="Postcode"
                size="lg"
                flex="3"
                value={postcode}
                onChange={(e) => {
                  setPostcode(e.target.value);
                  if (postcodeError) setPostcodeError(null);
                }}
                onKeyDown={handlePostcodeKeyDown}
                bg="white"
                border="1px solid"
                borderColor={postcodeError ? 'red.400' : 'gray.300'}
                borderRadius="md"
                _focus={{
                  borderColor: postcodeError ? 'red.500' : config.accentColor,
                  boxShadow: `0 0 0 1px ${postcodeError ? '#F56565' : config.accentColor}`,
                }}
                height="56px"
                aria-invalid={!!postcodeError}
              />
              <Button
                flex="1"
                bg={config.primaryColor}
                color="black"
                h="56px"
                borderRadius="full"
                _hover={{ bg: `${config.primaryColor}CC` }}
                onClick={handleFind}
                fontWeight="medium"
                rightIcon={
                  loading ? <Spinner size="sm" color="black" /> : <Text as="span" ml={1}>→</Text>
                }
                isDisabled={loading}
              >
                Find
              </Button>
            </HStack>

            {/* Inline postcode error */}
            {postcodeError && (
              <Text color="red.500" fontSize="sm" mt={1} mb={addresses.length ? 2 : 4}>
                {postcodeError}
              </Text>
            )}

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
                          _hover={{ bg: config.accentLightColor }}
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
            <NextButton onClick={handleNext} label="Next step" />

            {/* Trustpilot */}
            <VStack spacing={4} align="center">
              <Trustpilot size="md" />
            </VStack>
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
