// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   VStack,
//   Text,
//   Button,
//   Box,
//   Flex,
//   Link,
//   Icon,
// } from '@chakra-ui/react';
// import { ChevronDown, Check } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { Header } from '../Common/Header';
// import { useTenant } from '../../../contexts/TenantContext';
// import { Footer } from '../Common/Footer';
// import { SecureBar } from '../Common/Securebar';
// import { ProgressBar } from '../Common/ProgressBar';
// import { ClaimUpTo } from '../Common/Claimupto';
// import Trustpilot from '../../Onboarding/Common/Trustpilot';
// import NextButton from '../../Onboarding/Common/NextButton';
// import { saveLenderSelection, getLenderSelection } from '../../../utils/onboardingStorage';

// const LenderSelection: React.FC = () => {
//   const [selectedLenders, setSelectedLenders] = useState<string[]>([]);
//   const [showMoreLenders, setShowMoreLenders] = useState(false);
//   const navigate = useNavigate();
//   const { config } = useTenant();

//   // Load saved lender selection on component mount
//   useEffect(() => {
//     const savedLenderSelection = getLenderSelection();
//     if (savedLenderSelection) {
//       setSelectedLenders(savedLenderSelection.selectedLenders);
//     }
//   }, []);
  
//   const mainLenders = [
//     'Barclays Finance',
//     'Black Horse',
//     'BMW Finance',
//     'Close Brothers Motor Finance',
//     'Mercedes-Benz Financial Services',
//     'Motonovo Finance',
//     'Santander Consumer Finance',
//     'Volkswagen Finance'
//   ];

//   const extraLenders = [
//     'Ford Credit',
//     'Toyota Financial Services',
//     'Nissan Finance',
//     'Vauxhall Finance',
//   ];

//   // Toggles lender selection state
//   const toggleLender = (lender: string) => {
//     setSelectedLenders(prev =>
//       prev.includes(lender)
//         ? prev.filter(l => l !== lender)
//         : [...prev, lender]
//     );
//   };

//   // const handleLenderSelect = (lender: string) => {
//   //   setSelectedLenders(prev => 
//   //     prev.includes(lender) 
//   //       ? prev.filter(l => l !== lender)
//   //       : [...prev, lender]
//   //   );
//   // };

//   const handleNextStep = () => {
//     // Save selected lenders to localStorage
//     saveLenderSelection({
//       selectedLenders
//     });
    
//     navigate('/auth/userdetails');
//   };
  
//   const handleSkip = () => {
//     // Save empty selection when skipping
//     saveLenderSelection({
//       selectedLenders: []
//     });
    
//     navigate('/auth/userdetails');
//   };
  
//   return (
//     <Box minH="100vh" bg="white" w="100%">
//       <Header />

//       {/* Main Content */}
//       <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} flex="1" px={{ base: 4, sm: 6, lg: 8 }}>
//         <VStack spacing={{ base: 4, md: 6 }}>
//           {/* Progress Steps */}
//           <ProgressBar currentStep={1} totalSteps={4} />

//           {/* Header Section with Skip Button */}
//           <Box border="2px solid #E2E8F0" borderRadius="2xl" p={5} mb={4}>
//           <Flex 
//             justify="space-between" 
//             align="flex-start" 
//             w="full" 
//             maxW={{ base: "full", md: "2xl" }}
//           >
//             <VStack spacing={3} align="flex-start" flex="1" pr={4}>
//               <Text 
//                 fontSize={{ base: "xl", md: "2xl" }}
//                 fontWeight="bold" 
//                 color="gray.900"
//                 lineHeight="1.2"
//               >
//                 Check to see if you're owed up to £6427*?
//               </Text>
//               <Text 
//                 fontSize={{ base: "sm", md: "md" }} 
//                 color="gray.600" 
//                 lineHeight="1.4"
//                 mb={4}
//               >
//                 Select your vehicle finance lenders below to start your free check
//               </Text>
//             </VStack>
//             <Button
//               size="sm"
//               variant="outline"
//               borderColor="#A3A3A3"
//               borderRadius="full"
//               px={4}
//               py={5}
//               onClick={handleSkip}
//               bg="white"
//               rightIcon={<Text as="span" ml={1}>→</Text>}
//               _hover={{ bg: '#F8F9FA' }}
//               fontSize="sm"
//               fontWeight="bold"
//               color="#171331"
//               flexShrink={0}
//             >
//               Skip
//             </Button>
//           </Flex>

//           {/* Lenders List */}
//           <Box w="full" maxW={{ base: "full", md: "2xl" }}>
//             <VStack spacing={3} w="full" mb={4}>
//               {mainLenders.map((lender, _idx) => {
//                 const isSelected = selectedLenders.includes(lender);
//                 return (
//                   <Box
//                     key={lender}
//                     w="full"
//                     p={4}
//                     borderRadius="lg"
//                     border="2px"
//                     borderColor={isSelected ? config.accentColor : config.inactiveColor}
//                     bg={isSelected ? '#F3F0FF' : 'white'}
//                     cursor="pointer"
//                     onClick={() => toggleLender(lender)}
//                     _hover={{ 
//                       borderColor: isSelected ? config.accentColor : "#D1D5DB",
//                       bg: isSelected ? "#F3F0FF" : "#F8F9FA"
//                     }}
//                     transition="all 0.2s"
//                     _active={{ transform: "scale(0.98)" }}
//                   >
//                     <Flex justify="space-between" align="center">
//                       <Text 
//                         color="gray.900"
//                         fontWeight={isSelected ? "bold" : "medium"}
//                         fontSize="md"
//                         pr={2}
//                       >
//                         {lender}
//                       </Text>
//                       <Box
//                         w="24px"
//                         h="24px"
//                         borderRadius="full"
//                         border="2px"
//                         borderColor={isSelected ? config.accentColor : 'gray.300'}
//                         bg="white"
//                         display="flex"
//                         alignItems="center"
//                         justifyContent="center"
//                         flexShrink={0}
//                       >
//                         <Icon 
//                           as={Check} 
//                           w={3} 
//                           h={3} 
//                           color={isSelected ? config.accentColor : "#E9ECF0"}
//                           strokeWidth={3}
//                         />
//                       </Box>
//                     </Flex>
//                   </Box>
//                 );
//               })}

//               {/* Insert the View More button after half of the main lender items */}
//               <Button
//                 w="full"
//                 variant="outline"
//                 bg={config.accentLightColor || config.inactiveColor}
//                 borderColor={config.accentColor}
//                 color="black"
//                 p={4}
//                 onClick={() => setShowMoreLenders(!showMoreLenders)}
//                 rightIcon={
//                   <ChevronDown 
//                     size={20} 
//                     style={{ transform: showMoreLenders ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
//                   />
//                 }
//                 _hover={{ bg: '#E9E5FF', color: '#5B34C8'}}
//                 fontWeight="medium"
//                 height="auto"
//                 borderRadius="lg"
//                 fontSize="md"
//                 alignSelf="center"
//                 mt={3}
//                 mb={3}
//               >
//                 {showMoreLenders ? 'Hide lenders' : 'View more lenders'}
//               </Button>

//               {/* Additional lenders when expanded */}
//               {showMoreLenders && extraLenders.map((lender) => {
//                 const isSelected = selectedLenders.includes(lender);
//                 return (
//                   <Box
//                     key={lender}
//                     w="full"
//                     p={4}
//                     borderRadius="2xl"
//                     border="1px"
//                     borderColor={isSelected ? config.accentColor : '#E9ECF0'}
//                     bg={isSelected ? '#F3F0FF' : 'white'}
//                     cursor="pointer"
//                     onClick={() => toggleLender(lender)}
//                     _hover={{ 
//                       borderColor: isSelected ? config.accentColor : "#D1D5DB",
//                       bg: isSelected ? "#F3F0FF" : "#F8F9FA"
//                     }}
//                     transition="all 0.2s"
//                     _active={{ transform: "scale(0.98)" }}
//                   >
//                     <Flex justify="space-between" align="center">
//                       <Text 
//                         color="gray.900"
//                         fontWeight={isSelected ? "bold" : "medium"}
//                         fontSize="md"
//                         pr={2}
//                       >
//                         {lender}
//                       </Text>
//                       <Box
//                         w="24px"
//                         h="24px"
//                         borderRadius="full"
//                         border="2px"
//                         borderColor={isSelected ? config.accentColor : '#E9ECF0'}
//                         bg="white"
//                         display="flex"
//                         alignItems="center"
//                         justifyContent="center"
//                         flexShrink={0}
//                       >
//                         <Icon 
//                           as={Check} 
//                           w={3} 
//                           h={3} 
//                           color={isSelected ? config.accentColor : "#E9ECF0"}
//                           strokeWidth={3}
//                         />
//                       </Box>
//                     </Flex>
//                   </Box>
//                 );
//               })}
//             </VStack>

//             {/* Next Step Button */}
//             <NextButton onClick={handleNextStep} />
//           </Box>

//           {/* Bottom Centered Content */}
//           <VStack spacing={4} align="center">
//             {/* Trustpilot Rating */}
//             <Trustpilot size="md" />
//             <ClaimUpTo />

//             {/* Sign In Link */}
//             <Text 
//               fontSize="sm" 
//               color="gray.900" 
//               textAlign="center"
//             >
//               Already have an account?{' '}
//               <Link 
//                 color={config.accentColor} 
//                 fontWeight="medium" 
//                 onClick={() => navigate('/auth/login')}
//                 textDecoration="underline"
//               >
//                 Sign in
//               </Link>
//             </Text>
//           </VStack>
//           </Box>

    //       {/* Bottom Features */}
    //       <Box w="full" maxW={{ base: "full", md: "2xl" }}>
    //         <SecureBar />
    //       </Box>
    //     </VStack>
    //   </Container>

    //   <Footer />
    // </Box>
//   );
// };

// export default LenderSelection;

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
  useBreakpointValue,
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

const LenderSelection: React.FC = () => {
  const [selectedLenders, setSelectedLenders] = useState<string[]>([]);
  const [showMoreLenders, setShowMoreLenders] = useState(false);
  const navigate = useNavigate();
  const { config } = useTenant();

  // Mobile-first responsive detection
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Load saved lender selection on component mount
  useEffect(() => {
    const savedLenderSelection = getLenderSelection();
    if (savedLenderSelection) {
      setSelectedLenders(savedLenderSelection.selectedLenders);
    }
  }, []);
  
  const mainLenders = [
    'Barclays Finance',
    'Black Horse',
    'BMW Finance',
    'Close Brothers Motor Finance',
    'Mercedes-Benz Financial Services',
    'Motonovo Finance',
    'Santander Consumer Finance',
    'Volkswagen Finance'
  ];

  const extraLenders = [
    'Ford Credit',
    'Toyota Financial Services',
    'Nissan Finance',
    'Vauxhall Finance',
  ];

  // Toggles lender selection state
  const toggleLender = (lender: string) => {
    setSelectedLenders(prev =>
      prev.includes(lender)
        ? prev.filter(l => l !== lender)
        : [...prev, lender]
    );
  };

  const handleNextStep = () => {
    saveLenderSelection({ selectedLenders });
    navigate('/auth/userdetails');
  };
  
  const handleSkip = () => {
    saveLenderSelection({ selectedLenders: [] });
    navigate('/auth/userdetails');
  };

  // Mobile layout - everything in one screen
  if (isMobile) {
    return (
      <Box minH="100vh" bg="white" w="100%" display="flex" flexDirection="column">
        <Header />
        
        <Container maxW="full" px={4} py={2} flex="1" display="flex" flexDirection="column">
          {/* Compact Progress Bar */}
          <Box mb={3}>
            <ProgressBar currentStep={1} totalSteps={4} />
          </Box>

          {/* Compact Header with Skip */}
          <Flex justify="space-between" align="center" mb={3}>
            <Box flex="1">
              <Text fontSize="lg" fontWeight="bold" color="gray.900" fontFamily="Poppins" lineHeight="1.2">
                Check to see if you're owed up to £6427*?
              </Text>
              <Text fontSize="xs" color="gray.600" fontFamily="Poppins">
                Select your vehicle finance lenders below to start your free check
              </Text>
            </Box>
            <Button
              size="xs"
              variant="outline"
              borderColor="#A3A3A3"
              borderRadius="full"
              px={3}
              py={2}
              onClick={handleSkip}
              bg="white"
              fontSize="xs"
              fontWeight="bold"
              color="#171331"
              ml={2}
            >
              Skip →
            </Button>
          </Flex>

          {/* Compact Lenders List - Fixed Height with Scroll */}
          <Box 
            flex="1" 
            maxH="340px" 
            overflowY="auto" 
            border="1px solid #E2E8F0" 
            borderRadius="lg" 
            mb={3}
          >
            <VStack spacing={1} p={2}>
              {mainLenders.map((lender) => {
                const isSelected = selectedLenders.includes(lender);
                return (
                  <Box
                    key={lender}
                    w="full"
                    p={2}
                    borderRadius="md"
                    border="1px"
                    borderColor={isSelected ? config.accentColor : '#E9ECF0'}
                    bg={isSelected ? '#F3F0FF' : 'white'}
                    cursor="pointer"
                    onClick={() => toggleLender(lender)}
                    _active={{ transform: "scale(0.98)" }}
                    minH="44px"
                    display="flex"
                    alignItems="center"
                  >
                    <Flex justify="space-between" align="center" w="full">
                      <Text 
                        color="gray.900"
                        fontWeight={isSelected ? "bold" : "medium"}
                        fontSize="sm"
                        fontFamily="Poppins"
                        flex="1"
                        noOfLines={1}
                      >
                        {lender}
                      </Text>
                      <Box
                        w="20px"
                        h="20px"
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

              {/* Compact View More button */}
              <Button
                w="full"
                variant="outline"
                bg={config.accentLightColor}
                borderColor={config.accentColor}
                color="black"
                py={2}
                onClick={() => setShowMoreLenders(!showMoreLenders)}
                rightIcon={
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      transform: showMoreLenders ? 'rotate(180deg)' : 'rotate(0deg)', 
                      transition: 'transform 0.2s' 
                    }}
                  />
                }
                fontWeight="medium"
                height="40px"
                borderRadius="md"
                fontSize="sm"
                fontFamily="Poppins"
              >
                {showMoreLenders ? 'Hide lenders' : 'View more lenders'}
              </Button>

              {/* Additional lenders */}
              {showMoreLenders && extraLenders.map((lender) => {
                const isSelected = selectedLenders.includes(lender);
                return (
                  <Box
                    key={lender}
                    w="full"
                    p={2}
                    borderRadius="md"
                    border="1px"
                    borderColor={isSelected ? config.accentColor : '#E9ECF0'}
                    bg={isSelected ? '#F3F0FF' : 'white'}
                    cursor="pointer"
                    onClick={() => toggleLender(lender)}
                    _active={{ transform: "scale(0.98)" }}
                    minH="44px"
                    display="flex"
                    alignItems="center"
                  >
                    <Flex justify="space-between" align="center" w="full">
                      <Text 
                        color="gray.900"
                        fontWeight={isSelected ? "bold" : "medium"}
                        fontSize="sm"
                        fontFamily="Poppins"
                        flex="1"
                        noOfLines={1}
                      >
                        {lender}
                      </Text>
                      <Box
                        w="20px"
                        h="20px"
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
          </Box>

          {/* Compact Next Button */}
          <Button
            w="full"
            bg={config.primaryColor}
            color="black"
            p={3}
            onClick={handleNextStep}
            _hover={{ bg: '#A8EF7D' }}
            fontWeight="bold"
            height="48px"
            fontSize="md"
            borderRadius="full"
            rightIcon={<Text as="span" ml={1}>→</Text>}
            fontFamily="Poppins"
            mb={3}
          >
            Next step
          </Button>

          {/* Compact Bottom Content */}
          <VStack spacing={2} align="center">
            <Trustpilot size="sm" />
            <Text fontSize="xs" color="gray.900" textAlign="center" fontFamily="Poppins">
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
        </Container>
      </Box>
    );
  }

  // Desktop layout - unchanged
  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} flex="1" px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={{ base: 4, md: 6 }}>
          <ProgressBar currentStep={1} totalSteps={4} />

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

            <Box w="full" maxW={{ base: "full", md: "2xl" }}>
              <VStack spacing={3} w="full" mb={4}>
                {mainLenders.map((lender, _idx) => {
                  const isSelected = selectedLenders.includes(lender);
                  return (
                    <Box
                      key={lender}
                      w="full"
                      p={4}
                      borderRadius="lg"
                      border="2px"
                      borderColor={isSelected ? config.accentColor : config.inactiveColor}
                      bg={isSelected ? '#F3F0FF' : 'white'}
                      cursor="pointer"
                      onClick={() => toggleLender(lender)}
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
                          fontSize="md"
                          pr={2}
                        >
                          {lender}
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

                <Button
                  w="full"
                  variant="outline"
                  bg={config.accentLightColor || config.inactiveColor}
                  borderColor={config.accentColor}
                  color="black"
                  p={4}
                  onClick={() => setShowMoreLenders(!showMoreLenders)}
                  rightIcon={
                    <ChevronDown 
                      size={20} 
                      style={{ transform: showMoreLenders ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    />
                  }
                  _hover={{ bg: '#E9E5FF', color: '#5B34C8'}}
                  fontWeight="medium"
                  height="auto"
                  borderRadius="lg"
                  fontSize="md"
                  alignSelf="center"
                  mt={3}
                  mb={3}
                >
                  {showMoreLenders ? 'Hide lenders' : 'View more lenders'}
                </Button>

                {showMoreLenders && extraLenders.map((lender) => {
                  const isSelected = selectedLenders.includes(lender);
                  return (
                    <Box
                      key={lender}
                      w="full"
                      p={4}
                      borderRadius="2xl"
                      border="1px"
                      borderColor={isSelected ? config.accentColor : '#E9ECF0'}
                      bg={isSelected ? '#F3F0FF' : 'white'}
                      cursor="pointer"
                      onClick={() => toggleLender(lender)}
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
                          fontSize="md"
                          pr={2}
                        >
                          {lender}
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

              <NextButton onClick={handleNextStep} />
            </Box>

            <VStack spacing={4} align="center">
              <Trustpilot size="md" />
              <ClaimUpTo />
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