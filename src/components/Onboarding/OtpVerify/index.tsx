import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  Link,
  HStack,
  Flex,
  Circle,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { SecureBar } from '../Common/Securebar';
import { useTenant } from '../../../contexts/TenantContext';

const OtpVerify: React.FC = () => {
  const { config } = useTenant();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleVerify = () => {
    // TODO: verify code -> navigate
    navigate('/auth/missingagreements');
  };

  const handleResend = () => {
    // TODO: call resend endpoint
    alert('Verification code resent');
  };

  const isValid = code.trim().length > 0;

  return (
    <Box minH="100vh" bg="white">
      <Header />

      <Container maxW="3xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Box border="2px solid #E2E8F0" borderRadius="lg" p={6} w="full">
            <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold" mb={2}>
              Check your messages now!
            </Text>

            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Enter verification code
            </Text>
            <Input
              placeholder="Enter OTP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              size="lg"
              mb={6}
              bg="white"
              border="2px solid #EAECF0"
              _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px #5B34C8` }}
              borderRadius="md"
            />

            <Button
              w="full"
              bg={config.primaryColor}
              color="black"
              h="56px"
              borderRadius="full"
              _hover={{ bg: '#A8EF7D' }}
              fontWeight="medium"
              onClick={handleVerify}
              rightIcon={<Text as="span" ml={1}>→</Text>}
            >
              Verify now
            </Button>

            <Box mt={6}>
              <Text fontWeight="bold" fontSize="md" mb={1}>
                Didn't get a text?
              </Text>
              <Text fontSize="sm" color="gray.700" >
                Your code will be valid for 10 minutes. If you don't get a text or it's expired you can request a new one.
              </Text>
              <Button
                variant="link"
                size="sm"
                onClick={handleResend}
                fontFamily="Poppins"
                textDecoration="underline"
                color={config.accentColor}
                fontWeight="medium"
                _hover={{ opacity: 0.8 }}
              >
                Resend verification code
              </Button>
            </Box>
          </Box>

          <SecureBar />
        </VStack>
      </Container>
    </Box>
  );
};

export default OtpVerify;
export { OtpVerify };
