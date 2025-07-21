// import React, { useRef, useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   VStack,
//   Text,
//   HStack,
//   Flex,
//   Image,
//   Button as ChakraButton,
//   useToast,
// } from '@chakra-ui/react';
// // @ts-ignore - library lacks type definitions
// import SignatureCanvas from 'react-signature-canvas';
// import { useNavigate } from 'react-router-dom';
// import { Header } from '../Common/Header';
// import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
// import { SecureBar } from '../Common/Securebar';
// import { useTenant } from '../../../contexts/TenantContext';
// import Button from '../Common/Button';
// import { saveSignature, getSavedSignature, clearSignature } from '../../../utils/signatureStorage';

// const SignatureStep: React.FC = () => {
//   const sigCanvasRef = useRef<any>(null);
//   const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const navigate = useNavigate();
//   const { config } = useTenant();
//   const toast = useToast();
  
//   const [, setIsLoading] = useState(false);
//   const [hasSignature, setHasSignature] = useState(false);
//   const [agreedToTerms, setAgreedToTerms] = useState(false);

//   // Load saved signature on component mount
//   useEffect(() => {
//     const savedSignature = getSavedSignature();
//     if (savedSignature && savedSignature.signatureDataUrl) {
//       // Load signature into canvas
//       const img = document.createElement('img') as HTMLImageElement;
//       img.onload = () => {
//         const canvas = sigCanvasRef.current?.getCanvas();
//         if (canvas) {
//           const ctx = canvas.getContext('2d');
//           if (ctx) {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//             setHasSignature(true);
//             setAgreedToTerms(savedSignature.isAgreed);
//           }
//         }
//       };
//       img.src = savedSignature.signatureDataUrl;
//     }

//     // Cleanup timeout on unmount
//     return () => {
//       if (saveTimeoutRef.current) {
//         clearTimeout(saveTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Track signature changes with debouncing
//   const handleSignatureChange = () => {
//     if (sigCanvasRef.current) {
//       const isEmpty = sigCanvasRef.current.isEmpty();
//       setHasSignature(!isEmpty);
      
//       // Auto-save signature if not empty with debouncing
//       if (!isEmpty) {
//         // Clear any existing timeout
//         if (saveTimeoutRef.current) {
//           clearTimeout(saveTimeoutRef.current);
//         }
        
//         // Set new timeout for auto-save
//         saveTimeoutRef.current = setTimeout(() => {
//           if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
//             const signatureDataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
//             saveSignature(signatureDataUrl);
            
//             // Subtle feedback for auto-save
//             toast({
//               title: "Signature saved",
//               status: "success",
//               duration: 1000,
//               isClosable: false,
//               position: "bottom-right",
//               variant: "subtle",
//             });
//           }
//         }, 1000); // Save after 1 second of inactivity
//       }
//     }
//   };

//   const handleClear = () => {
//     // Clear timeout if pending
//     if (saveTimeoutRef.current) {
//       clearTimeout(saveTimeoutRef.current);
//     }
    
//     sigCanvasRef.current?.clear();
//     setHasSignature(false);
//     // Clear from storage as well
//     clearSignature();
    
//     toast({
//       title: "Signature cleared",
//       status: "info",
//       duration: 2000,
//       isClosable: true,
//     });
//   };

//   const handleSubmit = async () => {
//     if (!sigCanvasRef.current) return;
    
//     if (sigCanvasRef.current.isEmpty()) {
//       toast({
//         title: "Signature required",
//         description: "Please provide a signature before continuing.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     if (!agreedToTerms) {
//       toast({
//         title: "Agreement required",
//         description: "Please confirm that you agree to the terms and conditions.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const signatureDataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
      
//       // Save signature with agreement confirmation
//       saveSignature(signatureDataUrl);
      
//       toast({
//         title: "Signature saved successfully",
//         description: "Your signature has been securely saved.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });

//       // Simulate processing time for better UX
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       // Navigate to searching screen
//       navigate('/auth/searching');
//     } catch (error) {
//       console.error('Error saving signature:', error);
//       toast({
//         title: "Error saving signature",
//         description: "Please try again or contact support if the issue persists.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box minH="100vh" bg="white" w="100%">
//       <Header />

//       <Container
//         maxW="3xl"
//         pt={{ base: 2, md: 3 }}
//         pb={{ base: 4, md: 6 }}
//         px={{ base: 4, sm: 6, lg: 8 }}
//       >
//         <VStack spacing={{ base: 4, md: 6 }} align="stretch">
//           {/* Main Card */}
//           <Box border="1.5px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
//             <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold" mb={2} color="gray.900" fontFamily="Poppins">
//               Great news, Harshal !
//             </Text>
//             <Flex align="center" mb={4} flexWrap="wrap" gap={1}>
//               <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.900" fontWeight="bold" fontFamily="Poppins">
//                 Final step to potentially claiming up to
//               </Text>
//               <Text as="span" color="#50C878" fontWeight="bold" fontFamily="Poppins">
//                 £6,427*
//               </Text>
//               <Text fontSize="lg" ml={1}>
//                 🎉
//               </Text>
//             </Flex>

//             <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.700" mb={6} fontFamily="Poppins">
//               Please read the documents below before signing. They allow us to transfer your claim
//               to our third party so they can make a claim on your behalf; this is No-Win-No-Fee, so
//               you will only be charged if compensation is recovered.
//             </Text>

//             {/* Enhanced Signature Canvas */}
//             <Box mb={6} position="relative">
//               <Text fontSize="md" fontWeight="semibold" mb={3} color="gray.800" fontFamily="Poppins">
//                 Digital Signature
//               </Text>
              
// <Box 
//   position="relative" 
//   border="1px solid #E2E8F0"
//   borderRadius="lg"
//   bg="#F8F9FA"
//   overflow="hidden"
// >
//   <SignatureCanvas
//     ref={sigCanvasRef}
//     penColor="black"
//     dotSize={1}
//     minWidth={2}
//     maxWidth={2}
//     throttle={8}
//     velocityFilterWeight={0}
//     onEnd={handleSignatureChange}
//     canvasProps={{
//       width: 800,
//       height: 200,
//       style: { 
//         width: '100%', 
//         height: '200px',
//         borderRadius: '8px',
//         cursor: 'default',
//         touchAction: 'none',
//         userSelect: 'none',
//         WebkitUserSelect: 'none',
//         MozUserSelect: 'none'
//       },
//     }}
//   />

//   {!hasSignature && (
//     <Flex
//       position="absolute"
//       top="50%"
//       left="50%"
//       transform="translate(-50%, -50%)"
//       pointerEvents="none"
//       direction="column"
//       align="center"
//       color="gray.400"
//     >
//       <Text fontSize="2xl" fontWeight="normal" color="gray.300" fontStyle="italic" fontFamily="Poppins">
//         Sign Here
//       </Text>
//     </Flex>
//   )}

//   {/* ✅ Fixed Reset Button */}
//   <Box position="absolute" top={2} right={2} zIndex={1}>
//     <ChakraButton
//       size="sm"
//       variant="ghost"
//       color={config.accentColor}
//       onClick={handleClear}
//       fontWeight="bold"
//       fontSize="sm"
//       fontFamily="Poppins"
//       _hover={{ bg: 'transparent', textDecoration: 'underline' }}
//       isDisabled={!hasSignature}
//       opacity={hasSignature ? 1 : 0.5}
//     >
//       Reset
//     </ChakraButton>
//   </Box>
// </Box>

//             </Box>

//             {/* Submit Button */}
//             <Button
//               onClick={handleSubmit}
//               fontWeight="bold"
//               mb={6}
//             >
//               Find my agreements
//             </Button>

//             {/* Trustpilot */}
//             <Image src="/icons/trustpilot.svg" alt="Trustpilot Rating" h="32px" objectFit="contain" mx="auto" mb={6} />

//             {/* Disclaimer Text */}
//             <Text fontSize="xs" fontWeight="medium" color="gray.600" fontFamily="Poppins">
//               By signing above and clicking 'Find my agreements', you agree that we will run a soft
//               credit check (powered by Checkboard IP Ltd) to identify any potential car finance
//               claims. These searches will not impact your credit score but will verify any
//               agreements that are found. You are signing all documents related to your claim.
//               Copies will be emailed to you once the third party begins your claim(s), and they will
//               keep you updated thereafter. You agree that your electronic signature may be used for
//               each Letter of Authority and Conditional Fee Agreement that is applicable to your
//               claim, without further permission. By signing here you understand that Solvo
//               Solutions Ltd will receive a marketing fee from the chosen panel law firm for making
//               the introduction. You understand that this fee is not deducted from your compensation
//               and that if you would like to know the exact fee that you are free to ask.
//             </Text>
//           </Box>

//           {/* View Files Section */}
//           <Box>
//             <Text fontWeight="bold" color="gray.900" fontFamily="Poppins" mb={2}>
//               View Files
//             </Text>
//             <Text fontSize="sm" color="gray.700" fontFamily="Poppins" mb={4}>
//               By proceeding you confirm that you agree to both Resolve My Claim's letter of
//               authority, allowing them to investigate your claims, and Prowse Phillips Law's letter
//               of authority and terms of business, allowing them to submit any car finance claims.
//             </Text>
            
//             {/* Files List */}
//             <VStack spacing={3} align="stretch" mb={6}>
//               <HStack
//                 as="a"
//                 href="/documents/prowse-phillips.pdf"
//                 download
//                 spacing={3}
//                 p={3}
//                 border="1px solid #E2E8F0"
//                 borderRadius="lg"
//                 _hover={{ bg: '#F9FAFB' }}
//               >
//                 <ArrowDownTrayIcon width={20} height={20} color={config.accentColor} />
//                 <Text fontSize="sm" color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
//                   Prowse Phillips – No win, no fee agreement
//                 </Text>
//               </HStack>
//               <HStack
//                 as="a"
//                 href="/documents/resolve-my-claim.pdf"
//                 download
//                 spacing={3}
//                 p={3}
//                 border="1px solid #E2E8F0"
//                 borderRadius="lg"
//                 _hover={{ bg: '#F9FAFB' }}
//               >
//                 <ArrowDownTrayIcon width={20} height={20} color={config.accentColor} />
//                 <Text fontSize="sm" color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
//                   Resolve My Claim – Form of Authority
//                 </Text>
//               </HStack>
//             </VStack>
//           </Box>

//           {/* Secure Bar */}
//           <Box w="full" maxW={{ base: 'full', md: '2xl' }}>
//             <SecureBar />
//           </Box>
//         </VStack>
//       </Container>
//     </Box>
//   );
// };

// export default SignatureStep;
// export { SignatureStep };

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  HStack,
  Flex,
  Image,
  Button as ChakraButton,
  useToast,
} from '@chakra-ui/react';
// @ts-ignore - library lacks type definitions
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import Button from '../Common/Button';
import { saveSignature, getSavedSignature, clearSignature } from '../../../utils/signatureStorage';
import { submitSignature, canvasToFile } from '../../../api/services/submitSignature';

const SignatureStep: React.FC = () => {
  const sigCanvasRef = useRef<any>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { config } = useTenant();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Load saved signature on component mount
  useEffect(() => {
    const savedSignature = getSavedSignature();
    if (savedSignature && savedSignature.signatureDataUrl) {
      // Load signature into canvas
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => {
        const canvas = sigCanvasRef.current?.getCanvas();
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setHasSignature(true);
          }
        }
      };
      img.src = savedSignature.signatureDataUrl;
    }

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Track signature changes with debouncing
  const handleSignatureChange = () => {
    if (sigCanvasRef.current) {
      const isEmpty = sigCanvasRef.current.isEmpty();
      setHasSignature(!isEmpty);
      
      // Auto-save signature if not empty with debouncing
      if (!isEmpty) {
        // Clear any existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        // Set new timeout for auto-save
        saveTimeoutRef.current = setTimeout(() => {
          if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
            const signatureDataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
            saveSignature(signatureDataUrl);
            
            // Subtle feedback for auto-save
            toast({
              title: "Signature saved",
              status: "success",
              duration: 1000,
              isClosable: false,
              position: "bottom-right",
              variant: "subtle",
            });
          }
        }, 1000); // Save after 1 second of inactivity
      }
    }
  };

  const handleClear = () => {
    // Clear timeout if pending
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    sigCanvasRef.current?.clear();
    setHasSignature(false);
    // Clear from storage as well
    clearSignature();
    
    toast({
      title: "Signature cleared",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSubmit = async () => {
    if (!sigCanvasRef.current) return;
    
    if (sigCanvasRef.current.isEmpty()) {
      toast({
        title: "Signature required",
        description: "Please provide a signature before continuing.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get the trimmed canvas
      const trimmedCanvas = sigCanvasRef.current.getTrimmedCanvas();
      
      // Convert canvas to File
      const signatureFile = await canvasToFile(trimmedCanvas, 'signature.png');
      
      // Save signature data URL to localStorage for future use
      const signatureDataUrl = trimmedCanvas.toDataURL('image/png');
      saveSignature(signatureDataUrl);
      
      // Submit signature to backend
      const response = await submitSignature(signatureFile);
      
      toast({
        title: "Signature submitted successfully",
        description: "Your signature has been submitted and saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      console.log('Signature submission response:', response);

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to searching screen
      navigate('/auth/searching');
    } catch (error: any) {
      console.error('Error submitting signature:', error);
      
      let errorMessage = 'Failed to submit signature. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error submitting signature",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container
        maxW="3xl"
        pt={{ base: 2, md: 3 }}
        pb={{ base: 4, md: 6 }}
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Main Card */}
          <Box border="1.5px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold" mb={2} color="gray.900" fontFamily="Poppins">
              Great news, Harshal!
            </Text>
            <Flex align="center" mb={4} flexWrap="wrap" gap={1}>
              <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.900" fontWeight="bold" fontFamily="Poppins">
                Final step to potentially claiming up to
              </Text>
              <Text as="span" color="#50C878" fontWeight="bold" fontFamily="Poppins">
                £6,427*
              </Text>
              <Text fontSize="lg" ml={1}>
                🎉
              </Text>
            </Flex>

            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.700" mb={6} fontFamily="Poppins">
              Please read the documents below before signing. They allow us to transfer your claim
              to our third party so they can make a claim on your behalf; this is No-Win-No-Fee, so
              you will only be charged if compensation is recovered.
            </Text>

            {/* Enhanced Signature Canvas */}
            <Box mb={6} position="relative">
              <Text fontSize="md" fontWeight="semibold" mb={3} color="gray.800" fontFamily="Poppins">
                Digital Signature
              </Text>
              
              <Box 
                position="relative" 
                border="1px solid #E2E8F0"
                borderRadius="lg"
                bg="#F8F9FA"
                overflow="hidden"
              >
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="black"
                  dotSize={1}
                  minWidth={2}
                  maxWidth={2}
                  throttle={8}
                  velocityFilterWeight={0}
                  onEnd={handleSignatureChange}
                  canvasProps={{
                    width: 800,
                    height: 200,
                    willReadFrequently: true, // Fix Canvas2D warning
                    style: { 
                      width: '100%', 
                      height: '200px',
                      borderRadius: '8px',
                      cursor: 'default',
                      touchAction: 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none'
                    },
                  }}
                />

                {!hasSignature && (
                  <Flex
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    pointerEvents="none"
                    direction="column"
                    align="center"
                    color="gray.400"
                  >
                    <Text fontSize="2xl" fontWeight="normal" color="gray.300" fontStyle="italic" fontFamily="Poppins">
                      Sign Here
                    </Text>
                  </Flex>
                )}

                {/* Reset Button */}
                <Box position="absolute" top={2} right={2} zIndex={1}>
                  <ChakraButton
                    size="sm"
                    variant="ghost"
                    color={config.accentColor}
                    onClick={handleClear}
                    fontWeight="bold"
                    fontSize="sm"
                    fontFamily="Poppins"
                    _hover={{ bg: 'transparent', textDecoration: 'underline' }}
                    isDisabled={!hasSignature}
                    opacity={hasSignature ? 1 : 0.5}
                  >
                    Reset
                  </ChakraButton>
                </Box>
              </Box>
            </Box>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              fontWeight="bold"
              mb={6}
              isLoading={isLoading}
              loadingText="Submitting signature..."
            >
              Find my agreements
            </Button>

            {/* Trustpilot */}
            <Image src="/icons/trustpilot.svg" alt="Trustpilot Rating" h="32px" objectFit="contain" mx="auto" mb={6} />

            {/* Disclaimer Text */}
            <Text fontSize="xs" fontWeight="medium" color="gray.600" fontFamily="Poppins">
              By signing above and clicking 'Find my agreements', you agree that we will run a soft
              credit check (powered by Checkboard IP Ltd) to identify any potential car finance
              claims. These searches will not impact your credit score but will verify any
              agreements that are found. You are signing all documents related to your claim.
              Copies will be emailed to you once the third party begins your claim(s), and they will
              keep you updated thereafter. You agree that your electronic signature may be used for
              each Letter of Authority and Conditional Fee Agreement that is applicable to your
              claim, without further permission. By signing here you understand that Solvo
              Solutions Ltd will receive a marketing fee from the chosen panel law firm for making
              the introduction. You understand that this fee is not deducted from your compensation
              and that if you would like to know the exact fee that you are free to ask.
            </Text>
          </Box>

          {/* View Files Section */}
          <Box>
            <Text fontWeight="bold" color="gray.900" fontFamily="Poppins" mb={2}>
              View Files
            </Text>
            <Text fontSize="sm" color="gray.700" fontFamily="Poppins" mb={4}>
              By proceeding you confirm that you agree to both Resolve My Claim's letter of
              authority, allowing them to investigate your claims, and Prowse Phillips Law's letter
              of authority and terms of business, allowing them to submit any car finance claims.
            </Text>
            
            {/* Files List */}
            <VStack spacing={3} align="stretch" mb={6}>
              <HStack
                as="a"
                href="/documents/prowse-phillips.pdf"
                download
                spacing={3}
                p={3}
                border="1px solid #E2E8F0"
                borderRadius="lg"
                _hover={{ bg: '#F9FAFB' }}
              >
                <ArrowDownTrayIcon width={20} height={20} color={config.accentColor} />
                <Text fontSize="sm" color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
                  Prowse Phillips – No win, no fee agreement
                </Text>
              </HStack>
              <HStack
                as="a"
                href="/documents/resolve-my-claim.pdf"
                download
                spacing={3}
                p={3}
                border="1px solid #E2E8F0"
                borderRadius="lg"
                _hover={{ bg: '#F9FAFB' }}
              >
                <ArrowDownTrayIcon width={20} height={20} color={config.accentColor} />
                <Text fontSize="sm" color="gray.900" fontWeight="medium" flex="1" fontFamily="Poppins">
                  Resolve My Claim – Form of Authority
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Secure Bar */}
          <Box w="full" maxW={{ base: 'full', md: '2xl' }}>
            <SecureBar />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default SignatureStep;
export { SignatureStep };