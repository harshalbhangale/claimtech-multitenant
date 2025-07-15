import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  HStack,
  Image,
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

const AddressSearch: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState<{ id: number; label: string; lines: string }[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const generateMockAddresses = (pc: string) => {
    const streets = [
      'High St',
      'Church Rd',
      'New Cathedral St',
      'King St',
      'Queensway',
      'Station Rd',
      'Market St',
      'Victoria Rd',
      'Oxford St',
    ];
    const town = 'Manchester';
    const county = 'Lancs';
    return streets.slice(0, 9).map((street, idx) => {
      const num = idx + 1;
      const lines = `${num} ${street}\n${town}\n${county}\n${pc.toUpperCase()}`;
      return {
        id: idx,
        label: `${num}, ${street}, ${town}, ${county}, ${pc.toUpperCase()}`,
        lines,
      };
    });
  };

  const validPostcode = (pc: string) => /^[A-Za-z][0-9]{2}[A-Za-z]{2}$/i.test(pc.trim());

  const handleFind = () => {
    const pc = postcode.trim();
    if (!validPostcode(pc)) {
      alert('Please enter a valid UK postcode in the format X11XX');
      return;
    }
    setAddresses(generateMockAddresses(pc));
    setSelectedId(null);
  };

  const handleNext = () => {
    // Proceed only if an address is selected
    if (selectedId === null) return;
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
                _hover={{ bg: '#A8EF7D' }}
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
                    border="2px solid #38A169"
                    bg="#E9FFE9"
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
