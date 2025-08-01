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
  Collapse,
  Icon,
  Image,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ChevronDown, Search, Check, FileIcon} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { ClaimUpTo } from '../Common/Claimupto';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useTenant } from '../../../contexts/TenantContext';
import { getLenders } from '../../../api/services/onboarding/getLenders';
import type { LenderGroup } from '../../../api/services/onboarding/getLenders';
import { getLenderClaims, addLendersToClaims } from '../../../api/services/onboarding/MissingLenders';
import type { LenderClaim } from '../../../api/services/onboarding/MissingLenders';

const MissingAgreements: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [lenders, setLenders] = useState<LenderGroup[]>([]);
  const [existingClaims, setExistingClaims] = useState<LenderClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { config } = useTenant();

  // Fetch lenders and existing claims from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both lenders and existing claims in parallel
        const [lendersResponse, claimsResponse] = await Promise.all([
          getLenders(),
          getLenderClaims()
        ]);
        
        setLenders(lendersResponse.lender_groups);
        setExistingClaims(claimsResponse);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format lender display name with other brands
  const formatLenderName = (lender: LenderGroup): string => {
    return lender.on_display_name;
  };

  const toggleSelect = (lenderId: string) => {
    setSelected((prev) => (prev.includes(lenderId) ? prev.filter((x) => x !== lenderId) : [...prev, lenderId]));
  };

  const filtered = lenders.filter((l) => 
    formatLenderName(l).toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = async () => {
    if (selected.length === 0) {
      navigate('/dashboard');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Add selected lenders to claims
      await addLendersToClaims(selected);
      
      console.log('Successfully added lenders to claims');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error adding lenders to claims:', err);
      setError('Failed to add lenders. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box minH="100vh" bg="white">
        <Header />
        <Container maxW="3xl" py={10}>
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Spinner size="xl" color={config.accentColor} />
            <Text color="gray.600">Loading lenders...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box minH="100vh" bg="white">
        <Header />
        <Container maxW="3xl" py={10}>
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              {error}
            </Alert>
            <Button 
              onClick={() => window.location.reload()} 
              colorScheme="blue"
            >
              Try Again
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="white">
      <Header />

      <Container maxW="3xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            No agreements found automatically.
          </Text>
          <Text fontSize="sm" textAlign="center" maxW="lg" mx="auto">
            We could not find car finance agreements in your credit report, but don't worry! You can
            manually select your finance providers below.
          </Text>

          <Box bg={config.accentLightColor} borderRadius="md" p={3} fontSize="sm" fontWeight="medium" border="1px solid" borderColor={`${config.accentColor}40`}>
            <Flex align="center">
              <Icon as={ExclamationCircleIcon} w={4} h={4} mr={2} color={config.accentColor} />
              <Text fontFamily="Poppins">
                Over the <Text as="span" fontWeight="bold">next 24 hours</Text> we will receive more of your agreements going back to 2007.
              </Text>
            </Flex>
          </Box>

          <Box bg="#FAFAFA" p={3} fontSize="sm" fontWeight="bold" borderRadius="md">
            We have not received agreement details for these lenders:
          </Box>
          {existingClaims.length > 0 && (
            <>
              {existingClaims.map((claim) => (
                <Box 
                  key={claim.id} 
                  border="1.5px solid #E2E8F0" 
                  bg="white"
                  p={4} 
                  fontSize="sm" 
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.2s"
                  _hover={{ borderColor: config.accentColor, transform: "translateY(-1px)" }}
                >
                  <Flex align="center">
                    <Icon 
                      as={FileIcon} 
                      w={4} 
                      h={4} 
                      mr={3} 
                      color={config.accentColor} 
                    />
                    <Text fontFamily="Poppins" fontWeight="bold">
                      {claim.lender_name}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </>
          )}
          <Text fontSize="sm" textAlign="center" maxW="lg" mx="auto">
            Any lenders that we don't get over the next 24 hours. We will request the information
            directly from your lender. <strong >We need your ID for this on the next page.</strong>
          </Text>
          <Text fontSize="md" textAlign="center" fontWeight="bold">
            Any missing agreements?
          </Text>
          <Text fontSize="xs" textAlign="center">
            Add them on now and we'll request the documents from your lenders!
          </Text>

          {/* Select lenders */}
          <Box border="1.5px solid #E2E8F0" borderRadius="lg">
            <Flex
              onClick={() => setOpen(!open)}
              align="center"
              justify="space-between"
              p={3}
              cursor="pointer"
            >
              <Text fontWeight="bold" fontSize="sm">
                Select lenders
              </Text>
              <ChevronDown size={18} style={{ transform: open ? 'rotate(180deg)' : undefined }} />
            </Flex>
            <Collapse in={open} animateOpacity>

              <HStack px={3} py={2} spacing={2}>
                <Icon as={Search} w={4} h={4} color="gray.500" />
                <Input
                  placeholder="Search for lender…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  border="none"
                  _focus={{ outline: 'none' }}
                />
              </HStack>
              <Box maxH="260px" overflowY="auto" >
                {filtered.map((lender) => {
                  const isSel = selected.includes(lender.id);
                  return (
                    <Box
                      key={lender.id}
                      px={4}
                      py={3}
                      borderBottom="2px solid #E2E8F0"
                      cursor="pointer"
                      _hover={{ bg: '#F9FAFB' }}
                      bg={isSel ? config.accentLightColor : 'white'}
                      onClick={() => toggleSelect(lender.id)}
                    >
                      <Flex align="center" justify="space-between">
                        <Text fontSize="sm" fontWeight={isSel ? 'bold' : 'medium'}>
                          {formatLenderName(lender)}
                        </Text>
                        <Box
                          w="20px"
                          h="20px"
                          borderRadius="full"
                          border="2px solid" 
                          borderColor={isSel ? config.accentColor : '#E9ECF0'}
                          bg="white"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {isSel && <Check size={12} color={config.accentColor} strokeWidth={3} />}
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
              </Box>
            </Collapse>
          </Box>

          <Button
            bg={config.primaryColor}
            color="black"
            h="56px"
            borderRadius="full"
            _hover={{ bg: `${config.primaryColor}80` }}
            fontWeight="medium"
            onClick={handleContinue}
            isLoading={isSubmitting}
            loadingText="Adding lenders..."
            disabled={isSubmitting}
            rightIcon={!isSubmitting ? <Text as="span" ml={1}>→</Text> : undefined}
          >
            {isSubmitting ? 'Adding lenders...' : 'Continue'}
          </Button>

          <VStack spacing={3}>
            <ClaimUpTo />
            <Image src="/icons/trustpilot.svg" alt="Trustpilot" h="32px" objectFit="contain" />
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default MissingAgreements;
export { MissingAgreements }; 