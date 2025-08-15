import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Flex,
  Spinner,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { ChevronDown,Search } from 'lucide-react';
import { useTenant } from '../../../../contexts/TenantContext';
import { fetchAddressesByPostcode } from '../../../../api/services/onboarding/addressCheck';
import type { RawAddress, FormattedAddress } from '../../../../types/address';

export interface PreviousAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementReason?: string;
  claimId?: string;
  requirementId?: string;
  onSubmit?: (payload: { requirementId: string; address: unknown }) => Promise<void> | void;
}

const PreviousAddressModal: React.FC<PreviousAddressModalProps> = ({
  isOpen,
  onClose,
  requirementReason,
  claimId: _claimId, // eslint-disable-line @typescript-eslint/no-unused-vars
  requirementId,
  onSubmit,
}) => {
  const { config } = useTenant();
  const toast = useToast();
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState<FormattedAddress[]>([]);
  const [rawAddresses, setRawAddresses] = useState<RawAddress[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validPostcode = (pc: string): boolean => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(pc.replace(/\s/g, ''));
  };

  const handleFind = () => {
    const pc = postcode.trim();
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

    setLoading(true);
    const getAddresses = async () => {
      try {
        const rawResults = await fetchAddressesByPostcode(pc);
        const formatted = rawResults.map((item, idx) => {
          const allParts = [
            item.address1,
            item.address2,
            item.address3,
            item.address4,
            item.address5,
            item.city,
            item.region,
            item.postcode,
          ].filter(Boolean);

          const addressLines = [
            item.address1,
            item.address2,
            item.address3,
            item.address4,
            item.address5,
            item.city,
            item.region,
          ].filter(Boolean);
          
          const displayParts = [
            ...addressLines.slice(0, 3),
            item.postcode
          ].filter(Boolean);

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
        
        if (formatted.length === 0) {
          toast({
            title: "No Addresses Found",
            description: "No addresses found for this postcode. Please try a different one.",
            status: "info",
            duration: 4000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Addresses Found!",
            description: `Found ${formatted.length} address(es) for this postcode.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch addresses. Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    getAddresses();
  };

  const handleSubmit = async () => {
    if (!requirementId || selectedId === null) return;
    
    const selectedAddress = addresses.find((a) => a.id === selectedId);
    const selectedRaw = rawAddresses.find((_, idx) => idx === selectedId);
    
    if (!selectedAddress || !selectedRaw) return;

    try {
      setSubmitting(true);
      await onSubmit?.({ 
        requirementId, 
        address: { address: selectedAddress, raw: selectedRaw } 
      });
      
      toast({
        title: "Success!",
        description: "Your previous address has been submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit address. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFind();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }} motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl" mx={4} overflow="hidden" boxShadow="0 10px 30px rgba(0, 0, 0, 0.1)">
        {/* Simple header */}
        <Box bg={config.accentLightColor} p={4} borderTopRadius="xl">
          <ModalHeader p={0} fontSize="lg" fontFamily="Poppins" fontWeight="bold" color={config.accentColor}>
            Previous Address
          </ModalHeader>
          <Text color="gray.600" mt={1} fontSize="sm">
            Enter your postcode to find addresses
          </Text>
        </Box>
        
        <ModalCloseButton 
          top={4} 
          right={4} 
          size="md"
          borderRadius="full"
          bg="white"
          _hover={{ bg: "gray.100" }}
        />
        
        <ModalBody p={4}>
          {requirementReason && (
            <Box 
              bg="blue.50" 
              border="1px solid" 
              borderColor="blue.200" 
              borderRadius="lg" 
              p={3} 
              mb={4}
            >
              <Text fontSize="sm" color="blue.700" fontFamily="Poppins">
                {requirementReason}
              </Text>
            </Box>
          )}

          <VStack spacing={4} align="stretch">
            {/* Simple postcode input */}
            <Box>
              <Text fontSize="md" fontWeight="medium" mb={2} color="gray.700" fontFamily="Poppins">
                Postcode
              </Text>
              <HStack spacing={3} w="full">
                <Input
                  placeholder="e.g., SW1A 1AA"
                  size="md"
                  flex="1"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="lg"
                  _focus={{ 
                    borderColor: config.accentColor, 
                    boxShadow: `0 0 0 1px ${config.accentColor}20`
                  }}
                  height="48px"
                  fontFamily="Poppins"
                />
                <Button
                  bg={config.primaryColor}
                  color="black"
                  h="48px"
                  borderRadius="lg"
                  _hover={{ bg: `${config.primaryColor}CC` }}
                  onClick={handleFind}
                  fontWeight="medium"
                  rightIcon={
                    loading ? (
                      <Spinner size="sm" color="black" />
                    ) : (
                      <Icon as={Search} w={4} h={4} />
                    )
                  }
                  isDisabled={loading}
                  fontFamily="Poppins"
                  px={4}
                >
                  {loading ? 'Searching' : 'Find'}
                </Button>
              </HStack>
            </Box>

            {/* Simple address selection */}
            {addresses.length > 0 && (
              <Box>
                <Text fontSize="md" fontWeight="medium" mb={2} color="gray.700" fontFamily="Poppins">
                  Select Address ({addresses.length} found)
                </Text>
                <Box
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="white"
                >
                  <Box
                    cursor="pointer"
                    onClick={() => setOpenDropdown(!openDropdown)}
                    _hover={{ bg: "gray.50" }}
                    p={3}
                    borderBottom={openDropdown ? "1px solid" : "none"}
                    borderColor="gray.200"
                  >
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text fontSize="sm" color="gray.700" fontFamily="Poppins">
                        {selectedId !== null ? addresses.find((a) => a.id === selectedId)?.label : 'Choose an address'}
                      </Text>
                      <Icon 
                        as={ChevronDown} 
                        w={4} 
                        h={4} 
                        color="gray.500"
                        transition="transform 0.2s ease"
                        transform={openDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}
                      />
                    </Flex>
                  </Box>
                  
                  {openDropdown && (
                    <Box maxH="200px" overflowY="auto">
                      {addresses.map((addr, _index) => (
                        <Box
                          key={addr.id}
                          p={3}
                          _hover={{ bg: config.accentLightColor }}
                          bg={selectedId === addr.id ? `${config.accentLightColor}60` : 'transparent'}
                          borderLeft={selectedId === addr.id ? `3px solid ${config.accentColor}` : '3px solid transparent'}
                          onClick={() => {
                            setSelectedId(addr.id);
                            setOpenDropdown(false);
                          }}
                          cursor="pointer"
                        >
                          <Text fontSize="sm" color="gray.800" fontFamily="Poppins">
                            {addr.label}
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Simple selected address preview */}
            {selectedId !== null && (
              <Box
                border="1px solid"
                borderColor="green.200"
                bg="green.50"
                borderRadius="lg"
                p={3}
              >
                <Text fontSize="sm" fontWeight="medium" color="green.700" mb={2} fontFamily="Poppins">
                  Selected Address:
                </Text>
                <Text 
                  whiteSpace="pre-line" 
                  fontSize="sm" 
                  color="gray.800" 
                  fontFamily="Poppins"
                  bg="white"
                  p={2}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="green.200"
                >
                  {addresses.find((a) => a.id === selectedId)?.lines}
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>
        
        {/* Simple footer */}
        <ModalFooter 
          borderTopWidth="1px" 
          borderColor="gray.200" 
          p={4}
          gap={3}
        >
          <Button 
            variant="outline" 
            onClick={onClose} 
            size="md"
            borderRadius="lg"
            fontFamily="Poppins"
          >
            Cancel
          </Button>
          <Button
            bg={config.primaryColor}
            color="black"
            _hover={{ bg: `${config.primaryColor}CC` }}
            onClick={handleSubmit}
            isLoading={submitting}
            loadingText="Submitting..."
            isDisabled={selectedId === null}
            fontFamily="Poppins"
            borderRadius="lg"
            size="md"
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PreviousAddressModal;
