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
import Trustpilot from '../Common/Trustpilot';

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
  const formatLenderName = (lenders: LenderGroup): string => {
    return lenders.on_display_name;
  };

  const toggleSelect = (lenderId: string) => {
    setSelected((prev) => (prev.includes(lenderId) ? prev.filter((x) => x !== lenderId) : [...prev, lenderId]));
  };

  const filtered = lenders.filter((l) => {
    const lenderName = formatLenderName(l).toLowerCase();
    const searchTerm = search.toLowerCase();
    
    // Check if lender matches search term
    const matchesSearch = lenderName.includes(searchTerm);
    
    // Check if lender is NOT already in existing claims
    const notAlreadyClaimed = !existingClaims.some(claim => 
      claim.lender_name.toLowerCase() === lenderName
    );
    
    return matchesSearch && notAlreadyClaimed;
  });

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

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          {/* If we have received any agreements, show them, otherwise show "No agreements found" */}
          {existingClaims.length > 0 ? (
            <>
              <VStack spacing={2} mt={8}>
                <Text fontSize="xl" fontWeight="bold" textAlign="center" >
                  We found some of your agreements!
                </Text>
                <Text fontSize="sm" textAlign="center" maxW="3xl" mt={0}>
                  We have received agreement details for the following lenders. Please review them below.
                </Text>
              </VStack>
              <Box bg={config.accentLightColor} borderRadius="md" p={3} fontSize="sm" fontWeight="medium" border="1px solid" borderColor={`${config.accentColor}40`}>
                <Flex align="center">
                  <Icon as={ExclamationCircleIcon} w={4} h={4} mr={2} color={config.accentColor} />
                  <Text fontFamily="Poppins">
                    We didn’t find any agreements on the initial search. We’ll receive more agreements over the <Text as="span" fontWeight="bold">next 24 hours</Text>. If we still don’t have a match, we may ask you to provide some information.
                  </Text>
                </Flex>
              </Box>
              <Box bg="#FAFAFA" p={3} fontSize="sm" fontWeight="bold" borderRadius="md">
                We have received agreement details for these lenders:
              </Box>
              <VStack spacing={2} align="stretch">
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
              </VStack>
              <Text fontSize="sm" maxW="3xl" mb={4} textAlign="left">
                If you have other lenders not listed here, you can add them below and we'll request the information directly from your lender. <strong>We need your ID for this on the next page.</strong>
              </Text>
              <Box mt={4} mb={2}>
                <Text fontSize="lg" fontWeight="bold" textAlign="center" m={0}>
                  Any missing agreements?
                </Text>
                <Text fontSize="sm" textAlign="center" mt={1} mb={0}>
                  Add them on now and we'll request the documents from your lenders!
                </Text>
              </Box>
            </>
          ) : (
            <>
              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                No agreements found automatically.
              </Text>
              <Text fontSize="sm" textAlign="center" maxW="lg" mx="auto">
                We could not find car finance agreements in your credit report, but don't worry! You can manually select your finance providers below.
              </Text>
              <Box bg={config.accentLightColor} borderRadius="md" p={3} fontSize="sm" fontWeight="medium" border="1px solid" borderColor={`${config.accentColor}40`}>
                <Flex align="center">
                  <Icon as={ExclamationCircleIcon} w={4} h={4} mr={2} color={config.accentColor} />
                  <Text fontFamily="Poppins">
                    Over the <Text as="span" fontWeight="bold">next 24 hours</Text> we will receive more of your agreements going back to 2007.
                  </Text>
                </Flex>
              </Box>
              <Text fontSize="sm" textAlign="center" maxW="lg" mx="auto">
                If we don't get your agreements in the next 24 hours, you can add them below and we'll request the information directly from your lender. <strong>We need your ID for this on the next page.</strong>
              </Text>
              <Box mt={4} mb={2}>
                <Text fontSize="lg" fontWeight="bold" textAlign="center" m={0}>
                  Any missing agreements?
                </Text>
                <Text fontSize="sm" textAlign="center" mt={1} mb={0}>
                  Add them on now and we'll request the documents from your lenders!
                </Text>
              </Box>
            </>
          )}

          {/* Select lenders */}
          <Box
            border="1.5px solid #E2E8F0"
            borderRadius="lg"
            boxShadow="xs"
            transition="box-shadow 0.25s cubic-bezier(.4,0,.2,1)"
            _hover={{ boxShadow: "md" }}
          >
            <Flex
              onClick={() => setOpen(!open)}
              align="center"
              justify="space-between"
              p={3}
              cursor="pointer"
              transition="background 0.2s"
              _hover={{ bg: "#F5F7FA" }}
              userSelect="none"
            >
              <Text fontWeight="bold" fontSize="sm">
                Select lenders
              </Text>
              <Box
                as="span"
                transition="transform 0.3s cubic-bezier(.4,0,.2,1)"
                style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <ChevronDown size={18} />
              </Box>
              
            </Flex>
            <Box px={3} pb={2}>
              <Text fontSize="xs" color="gray.600" fontWeight="medium">
                Lenders still missing? Add more now
              </Text>
            </Box>
            {/* Added instruction text below "Select lenders" */}
            <Collapse in={open} animateOpacity style={{ transition: "height 0.35s cubic-bezier(.4,0,.2,1)" }}>
              <HStack px={3} py={2} spacing={2}>
                <Icon as={Search} w={4} h={4} color="gray.500" />
                <Input
                  placeholder="Search for lender…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  border="none"
                  _focus={{ outline: 'none', bg: "#F5F7FA" }}
                  transition="background 0.2s"
                  bg="white"
                />
              </HStack>
              <Box maxH="260px" overflowY="auto" sx={{
                scrollbarWidth: "thin",
                scrollbarColor: `${config.accentLightColor} #F5F7FA`
              }}>
                {filtered.map((lender, idx) => {
                  const isSel = selected.includes(lender.id);
                  return (
                    <Box
                      key={lender.id}
                      px={4}
                      py={3}
                      borderBottom={idx === filtered.length - 1 ? "none" : "2px solid #E2E8F0"}
                      cursor="pointer"
                      _hover={{ bg: config.accentLightColor, transition: "background 0.18s" }}
                      bg={isSel ? config.accentLightColor : 'white'}
                      onClick={() => toggleSelect(lender.id)}
                      transition="background 0.18s, box-shadow 0.18s"
                      boxShadow={isSel ? "sm" : "none"}
                    >
                      <Flex align="center" justify="space-between">
                        <Text
                          fontSize="sm"
                          fontWeight={isSel ? 'bold' : 'medium'}
                          color={isSel ? config.accentColor : "inherit"}
                          transition="color 0.18s"
                        >
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
                          transition="border-color 0.18s"
                        >
                          <Box
                            opacity={isSel ? 1 : 0}
                            transform={isSel ? "scale(1)" : "scale(0.7)"}
                            transition="opacity 0.18s, transform 0.18s"
                          >
                            {isSel && <Check size={12} color={config.accentColor} strokeWidth={3} />}
                          </Box>
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
            _hover={{ bg: `${config.primaryColor}CC`}}
            onClick={handleContinue}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            rightIcon={!isSubmitting ? <Text as="span" ml={1}>→</Text> : undefined}
          >
            {isSubmitting ? 'Adding lenders...' : 'Continue'}
          </Button>

          <VStack spacing={3} transition="opacity 0.3s">
            <ClaimUpTo />
            <Trustpilot />
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default MissingAgreements;
export { MissingAgreements }; 