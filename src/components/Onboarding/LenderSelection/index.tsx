import React, { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  Text,
  Button,
  Box,
  Flex,
  Link,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { useTenant } from '../../../contexts/TenantContext';
import { Footer } from '../Common/Footer';
import { SecureBar } from '../Common/Securebar';
import { ProgressBar } from '../Common/ProgressBar';
import { ClaimUpTo } from '../Common/Claimupto';
import Trustpilot from '../../Onboarding/Common/Trustpilot';
import NextButton from '../../Onboarding/Common/NextButton';
import { saveLenderSelection, getLenderSelection } from '../../../utils/onboardingStorage';
import { getLenders } from '../../../api/services/onboarding/getLenders';
import type { LenderGroup } from '../../../api/services/onboarding/getLenders';

const LenderSelection: React.FC = () => {
  const [selectedLenders, setSelectedLenders] = useState<string[]>([]);
  const [showMoreLenders, setShowMoreLenders] = useState(false);
  const [lenders, setLenders] = useState<LenderGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { config } = useTenant();

  // Load saved lender selection on component mount
  useEffect(() => {
    const savedLenderSelection = getLenderSelection();
    if (savedLenderSelection) {
      // Validate that saved lenders are valid IDs (UUID format)
      const validLenderIds = savedLenderSelection.selectedLenders.filter(id => 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      );
      
      if (validLenderIds.length !== savedLenderSelection.selectedLenders.length) {
        console.log('Cleaning up invalid lender data:', {
          original: savedLenderSelection.selectedLenders,
          valid: validLenderIds
        });
        // Save the cleaned data
        saveLenderSelection({
          selectedLenders: validLenderIds
        });
      }
      
      setSelectedLenders(validLenderIds);
    }
  }, []);

  // Fetch lenders from API
  useEffect(() => {
    const fetchLenders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLenders();
        setLenders(response.lender_groups);
      } catch (err) {
        console.error('Error fetching lenders:', err);
        setError('Failed to load lenders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLenders();
  }, []);

  // Separate lenders by priority
  const mainLenders = lenders.filter(lender => lender.priority === 10);
  const additionalLenders = lenders.filter(lender => lender.priority === 0);

  // Format lender display name with other brands
  const formatLenderName = (lender: LenderGroup): string => {
    return lender.on_display_name;
  };

  // Toggles lender selection state
  const toggleLender = (lenderId: string) => {
    console.log('Toggling lender:', lenderId);
    setSelectedLenders(prev => {
      const newSelection = prev.includes(lenderId)
        ? prev.filter(l => l !== lenderId)
        : [...prev, lenderId];
      console.log('Updated selection:', newSelection);
      return newSelection;
    });
  };

  const handleNextStep = () => {
    console.log('Saving lender selection:', selectedLenders);
    // Save selected lenders to localStorage
    saveLenderSelection({
      selectedLenders
    });
    
    navigate('/auth/userdetails');
  };
  
  const handleSkip = () => {
    // Save empty selection when skipping
    saveLenderSelection({
      selectedLenders: []
    });
    
    navigate('/auth/userdetails');
  };

  // Show loading state
  if (loading) {
    return (
      <Box minH="100vh" bg="white" w="100%">
        <Header />
        <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} flex="1" px={{ base: 4, sm: 6, lg: 8 }}>
          <VStack spacing={{ base: 4, md: 6 }} justify="center" minH="60vh">
            <Spinner size="xl" color={config.accentColor} />
            <Text color="gray.600">Loading lenders...</Text>
          </VStack>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box minH="100vh" bg="white" w="100%">
        <Header />
        <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} flex="1" px={{ base: 4, sm: 6, lg: 8 }}>
          <VStack spacing={{ base: 4, md: 6 }} justify="center" minH="60vh">
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
        <Footer />
      </Box>
    );
  }
  
  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      {/* Main Content */}
      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} flex="1" px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={{ base: 4, md: 6 }}>
          {/* Progress Steps */}
          <ProgressBar currentStep={1} totalSteps={4} />

          {/* Header Section with Skip Button */}
          <Box border="2px solid #E2E8F0" borderRadius="2xl" p={5} mb={4}>
          <Flex 
            justify="space-between" 
            align="flex-start" 
            w="full" 
            maxW={{ base: "full", md: "2xl" }}
          >
            <VStack spacing={3} align="flex-start" flex="1" pr={4}>
              <Text 
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold" 
                color="gray.900"
                lineHeight="1.2"
              >
                Check to see if you're owed up to £6427*?
              </Text>
              <Text 
                fontSize={{ base: "sm", md: "md" }} 
                color="gray.600" 
                lineHeight="1.4"
                mb={4}
              >
                Select your vehicle finance lenders below to start your free check
              </Text>
            </VStack>
            <Button
              size="sm"
              variant="outline"
              borderColor="#A3A3A3"
              borderRadius="full"
              px={4}
              py={5}
              onClick={handleSkip}
              bg="white"
              rightIcon={<Text as="span" ml={1}>→</Text>}
              _hover={{ bg: '#F8F9FA' }}
              fontSize="sm"
              fontWeight="bold"
              color="#171331"
              flexShrink={0}
            >
              Skip
            </Button>
          </Flex>

          {/* Lenders List */}
          <Box w="full" maxW={{ base: "full", md: "2xl" }}>
            <VStack spacing={2} w="full" mb={4}>
              {mainLenders.map((lender) => {
                const isSelected = selectedLenders.includes(lender.id);
                return (
                  <Box
                    key={lender.id}
                    w="full"
                    p={2}
                    borderRadius="lg"
                    border="1px"
                    borderColor={isSelected ? config.accentColor : config.inactiveColor}
                    bg={isSelected ? '#F3F0FF' : 'white'}
                    cursor="pointer"
                    onClick={() => toggleLender(lender.id)}
                    _hover={{ 
                      borderColor: isSelected ? config.accentColor : "#D1D5DB",
                      bg: isSelected ? "#F3F0FF" : "#F8F9FA"
                    }}
                    transition="all 0.2s"
                    _active={{ transform: "scale(0.98)" }}
                  >
                    <Flex justify="space-between" align="center">
                      <Text 
                        color="gray.900"
                        fontWeight={isSelected ? "bold" : "medium"}
                        fontSize="sm"
                        pr={2}
                      >
                        {formatLenderName(lender)}
                      </Text>
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
                        flexShrink={0}
                      >
                        <Icon 
                          as={Check} 
                          w={3} 
                          h={3} 
                          color={isSelected ? config.accentColor : "#E9ECF0"}
                          strokeWidth={3}
                        />
                      </Box>
                    </Flex>
                  </Box>
                );
              })}

              {/* Insert the View More button after main lenders */}
              {additionalLenders.length > 0 && (
                <Button
                  w="full"
                  variant="outline"
                  bg={config.accentLightColor || config.inactiveColor}
                  borderColor={config.accentColor}
                  color="black"
                  p={4}
                  px={5}
                  onClick={() => setShowMoreLenders(!showMoreLenders)}
                  _hover={{ bg: '#E9E5FF', color: '#5B34C8'}}
                  fontWeight="bold"
                  height="auto"
                  borderRadius="lg"
                  fontSize="md"
                  alignSelf="center"
                  mt={4}
                  mb={4}
                >
                  <Flex w="full" justify="space-between" align="center">
                    <Text>{showMoreLenders ? 'Hide lenders' : 'View more lenders'}</Text>
                    <ChevronDown 
                      size={20} 
                      style={{ transform: showMoreLenders ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    />
                  </Flex>
                </Button>
              )}

              {/* Additional lenders when expanded */}
              {showMoreLenders && additionalLenders.map((lender) => {
                const isSelected = selectedLenders.includes(lender.id);
                return (
                  <Box
                  key={lender.id}
                  w="full"
                  p={2}
                  borderRadius="lg"
                  border="1px"
                  borderColor={isSelected ? config.accentColor : config.inactiveColor}
                  bg={isSelected ? '#F3F0FF' : 'white'}
                  cursor="pointer"
                  onClick={() => toggleLender(lender.id)}
                  _hover={{ 
                    borderColor: isSelected ? config.accentColor : "#D1D5DB",
                    bg: isSelected ? "#F3F0FF" : "#F8F9FA"
                  }}
                  transition="all 0.2s"
                  _active={{ transform: "scale(0.98)" }}
                  >
                    <Flex justify="space-between" align="center">
                      <Text 
                        color="gray.900"
                        fontWeight={isSelected ? "bold" : "medium"}
                        fontSize="sm"
                        pr={2}
                      >
                        {formatLenderName(lender)}
                      </Text>
                      <Box
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        border="2px"
                        borderColor={isSelected ? config.accentColor : '#E9ECF0'}
                        bg="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        <Icon 
                          as={Check} 
                          w={3} 
                          h={3} 
                          color={isSelected ? config.accentColor : "#E9ECF0"}
                          strokeWidth={3}
                        />
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>

            {/* Next Step Button */}
            <NextButton onClick={handleNextStep} />
          </Box>

          {/* Bottom Centered Content */}
          <VStack spacing={4} align="center">
            {/* Trustpilot Rating */}
            <Trustpilot size="md" />
            <ClaimUpTo />

            {/* Sign In Link */}
            <Text 
              fontSize="sm" 
              color="gray.900" 
              textAlign="center"
            >
              Already have an account?{' '}
              <Link 
                color={config.accentColor} 
                fontWeight="medium" 
                onClick={() => navigate('/auth/login')}
                textDecoration="underline"
              >
                Sign in
              </Link>
            </Text>
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

export default LenderSelection;