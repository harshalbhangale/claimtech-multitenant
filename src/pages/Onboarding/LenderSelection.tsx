// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronDown } from 'lucide-react';
// import { useTenant } from '../../../contexts/TenantContext';
// import { Header } from '../../../components/onboarding/Common/Header';
// import { SecureBar } from '../../../components/onboarding/Common/Securebar';
// import { Footer } from '../../../components/onboarding/Common/Footer';
// import { ProgressBar } from '../../../components/onboarding/Common/ProgressBar';
// import {
//   Box,
//   Container,
//   Heading,
//   Text,
//   Button,
//   VStack,
//   HStack,
//   Flex,
//   useColorModeValue,
// } from '@chakra-ui/react';

// export const LenderSelection: React.FC = () => {
//   const navigate = useNavigate();
//   const { config } = useTenant();
//   const [selectedLenders, setSelectedLenders] = useState<string[]>([]);
//   const [showMoreLenders, setShowMoreLenders] = useState(false);

//   // Exactly 8 main lenders as shown in the image
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

//   // Additional lenders for "View more"
//   const additionalLenders = [
//     'Audi Finance',
//     'Alphabet',
//     'Arval',
//     'Blue Motor Finance',
//     'CA Auto Bank',
//     'Clydesdale Financial Services',
//     'Creation Finance',
//     'First Response Finance',
//     'Ford Credit',
//     'Hitachi Capital Vehicle Solutions',
//     'Honda Finance',
//     'Hyundai Finance',
//     'Iveco Capital',
//     'JCB Finance',
//     'Kia Finance',
//     'Land Rover Finance',
//     'Lex Autolease',
//     'Lookers Leasing',
//     'MAN Finance',
//     'Mazda Finance',
//     'Mini Finance',
//     'Mitsubishi Motors Finance',
//     'Nissan Finance',
//     'Peugeot Finance',
//     'PSA Finance',
//     'Renault Finance',
//     'Seat Finance',
//     'Skoda Finance',
//     'Suzuki Finance',
//     'Toyota Finance',
//     'Vauxhall Finance',
//     'Volvo Car Finance'
//   ];

//   const allLenders = showMoreLenders ? [...mainLenders, ...additionalLenders] : mainLenders;

//   const handleNext = () => {
//     if (selectedLenders.length > 0) {
//       navigate('/auth/userdetails');
//     }
//   };

//   const handleSkip = () => {
//     navigate('/auth/userdetails');
//   };

//   const toggleLenderSelection = (lender: string) => {
//     setSelectedLenders(prev => 
//       prev.includes(lender) 
//         ? prev.filter(l => l !== lender)
//         : [...prev, lender]
//     );
//   };

//   const bgColor = useColorModeValue('white', 'gray.800');
//   const borderColor = useColorModeValue('gray.200', 'gray.600');

//   return (
//     <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} display="flex" flexDirection="column">
//       {/* Header */}
//       <Header />

//       {/* Main Content */}
//       <Container maxW="4xl" py={8} flex="1">
//         <VStack spacing={8}>
//           {/* Progress Steps */}
//           <ProgressBar currentStep={1} totalSteps={4} />

//           {/* Header with Skip button */}
//           <Flex justify="space-between" align="flex-start" w="full">
//             <VStack align="flex-start" spacing={2}>
//               <Heading size="lg" color="gray.900">
//                 Check to see if you're owed up to £6,427*?
//               </Heading>
//               <Text color="gray.600" fontSize="md">
//                 Select your vehicle finance lenders below to start your free check
//               </Text>
//             </VStack>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleSkip}
//               borderColor="gray.300"
//               color="gray.600"
//               _hover={{ bg: 'gray.50' }}
//             >
//               Skip →
//             </Button>
//           </Flex>

//           {/* Lenders List */}
//           <VStack spacing={2} w="full">
//             {allLenders.map((lender) => (
//               <Box
//                 key={lender}
//                 w="full"
//                 p={4}
//                 borderRadius="xl"
//                 border="2px"
//                 borderColor={selectedLenders.includes(lender) ? config.accentColor : borderColor}
//                 bg={selectedLenders.includes(lender) ? '#F3F0FF' : bgColor}
//                 cursor="pointer"
//                 transition="all 0.2s"
//                 _hover={{
//                   borderColor: selectedLenders.includes(lender) ? config.accentColor : 'gray.300',
//                   bg: selectedLenders.includes(lender) ? '#F3F0FF' : 'gray.50'
//                 }}
//                 onClick={() => toggleLenderSelection(lender)}
//               >
//                 <Flex justify="space-between" align="center">
//                   <Text
//                     color="gray.700"
//                     fontWeight={selectedLenders.includes(lender) ? 'bold' : 'medium'}
//                   >
//                     {lender}
//                   </Text>
//                   <Box
//                     w={6}
//                     h={6}
//                     borderRadius="full"
//                     border="2px"
//                     borderColor={selectedLenders.includes(lender) ? config.accentColor : 'gray.300'}
//                     bg={selectedLenders.includes(lender) ? config.accentColor : 'transparent'}
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                   >
//                     {selectedLenders.includes(lender) && (
//                       <Box as="svg" w={3} h={3} color="white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                       </Box>
//                     )}
//                   </Box>
//                 </Flex>
//               </Box>
//             ))}

//             {/* View More/Less Button */}
//             <Box
//               w="full"
//               p={4}
//               borderRadius="xl"
//               border="2px"
//               borderColor="gray.200"
//               bg="white"
//               cursor="pointer"
//               transition="all 0.2s"
//               _hover={{
//                 borderColor: config.accentColor,
//                 bg: '#F3F0FF'
//               }}
//               onClick={() => setShowMoreLenders(!showMoreLenders)}
//             >
//               <Flex justify="center" align="center">
//                 <Text mr={2} color="gray.700" fontWeight="medium">
//                   {showMoreLenders ? 'View less lenders' : 'View more lenders'}
//                 </Text>
//                 <ChevronDown 
//                   size={16} 
//                   style={{ 
//                     transform: showMoreLenders ? 'rotate(180deg)' : 'rotate(0deg)',
//                     transition: 'transform 0.2s'
//                   }} 
//                 />
//               </Flex>
//             </Box>
//           </VStack>

//           {/* Next Step Button */}
//           <Button
//             w="full"
//             size="lg"
//             bg={config.primaryColor}
//             color="black"
//             borderRadius="full"
//             py={6}
//             fontSize="lg"
//             fontWeight="semibold"
//             isDisabled={selectedLenders.length === 0}
//             onClick={handleNext}
//             _hover={{ 
//               bg: config.primaryColor,
//               opacity: 0.9 
//             }}
//             _disabled={{ 
//               bg: 'gray.300',
//               cursor: 'not-allowed'
//             }}
//           >
//             Next step →
//           </Button>

//           {/* Trustpilot Section */}
//           <Flex justify="center">
//             <HStack spacing={1}>
//               {[...Array(5)].map((_, i) => (
//                 <Box key={i} as="svg" w={5} h={5} color="green.400" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </Box>
//               ))}
//               <Text ml={2} fontWeight="bold">Trustpilot</Text>
//             </HStack>
//           </Flex>

//           {/* Claim Amount with Icon */}
//           <Flex justify="center">
//             <HStack 
//               spacing={3} 
//               bg="white" 
//               borderRadius="full" 
//               px={4} 
//               py={2} 
//               boxShadow="sm"
//               border="1px"
//               borderColor="gray.200"
//             >
//               <Box
//                 w={8}
//                 h={8}
//                 borderRadius="full"
//                 bg={config.accentColor}
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//               >
//                 <Box as="svg" w={4} h={4} color="white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
//                 </Box>
//               </Box>
//               <Text color="gray.900" fontWeight="semibold">Claim up to £6,427*</Text>
//             </HStack>
//           </Flex>

//           {/* Sign In Link */}
//           <Text textAlign="center" color="gray.600">
//             Already have an account?{' '}
//             <Text
//               as="button"
//               color={config.accentColor}
//               fontWeight="medium"
//               textDecoration="underline"
//               _hover={{ opacity: 0.8 }}
//               onClick={() => navigate('/auth/login')}
//             >
//               Sign in
//             </Text>
//           </Text>
//         </VStack>
//       </Container>

//       {/* Bottom Features using SecureBar */}
//       <SecureBar />

//       {/* Footer */}
//       <Footer />
//     </Box>
//   );
// };

// export default LenderSelection; 


import LenderSelection from '../../components/Onboarding/LenderSelection';

export const LenderSelectionPage = () => {
    return (
        <LenderSelection />
    )
}

export default LenderSelectionPage;