import React, { useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  HStack,
  Flex,
  Image,
  Link,
} from '@chakra-ui/react';
// @ts-ignore - library lacks type definitions
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';
import Button from '../Common/Button';

const SignatureStep: React.FC = () => {
  const sigCanvasRef = useRef<any>(null);
  const navigate = useNavigate();
  const { config } = useTenant();

  const handleClear = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSubmit = () => {
    if (!sigCanvasRef.current) return;
    if (sigCanvasRef.current.isEmpty()) {
      alert('Please provide a signature before continuing.');
      return;
    }
    const signatureDataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
    // TODO: Send signatureDataUrl to backend or store appropriately
    console.log('Signature captured:', signatureDataUrl);

    // Navigate to searching screen
    navigate('/auth/searching');
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
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold" mb={2} color="gray.900">
              Great news!
            </Text>
            <Flex align="center" mb={4} flexWrap="wrap" gap={1}>
              <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.900" fontWeight="black">
                Final step to potentially claiming up to
              </Text>
              <Text as="span" color={config.completedColor} fontWeight="bold">
                £6,427*
              </Text>
              <Text fontSize="lg" ml={1}>
                🎉
              </Text>
            </Flex>

            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.700" mb={6}>
              Please read the documents below before signing. They allow us to transfer your claim
              to our third party so they can make a claim on your behalf; this is No-Win-No-Fee, so
              you will only be charged if compensation is recovered.
            </Text>

            {/* Signature Canvas */}
            <Box position="relative" mb={4} border="2px dashed #E2E8F0" borderRadius="lg">
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                canvasProps={{
                  width: 800,
                  height: 200,
                  style: { width: '100%', height: '200px', borderRadius: '12px' },
                }}
              />
              {/* Reset Link */}
              <Link
                position="absolute"
                top={2}
                right={3}
                fontSize="sm"
                color={config.accentColor}
                onClick={handleClear}
                fontWeight="medium"
                textDecoration="underline"
              >
                Reset
              </Link>
              {/* Placeholder Text */}
              <Flex
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                pointerEvents="none"
                color="gray.400"
                fontSize="2xl"
                fontWeight="semibold"
              >
                Sign Here
              </Flex>
            </Box>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              fontWeight="bold"
            >
              Find my agreements
            </Button>

            {/* Trustpilot */}
            <Image src="/icons/trustpilot.svg" alt="Trustpilot Rating" h="32px" objectFit="contain" mx="auto" mb={6} />

            {/* Disclaimer Text */}
            <Text fontSize="xs" fontWeight="medium" color="gray.600">
              By signing above and clicking ‘Find my agreements’, you agree that we will run a soft
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
            <Text fontWeight="bold" color="gray.900">
              View Files
            </Text>
            <Text fontSize="sm" color="gray.700">
              By proceeding you confirm that you agree to both Resolve My Claim’s letter of
              authority, allowing them to investigate your claims, and Prowse Phillips Law’s letter
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
