// src/components/Login/LoginPage.tsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Flex,
  Container,
  Image,
  Divider,
  useToast,
  Icon,
  Circle,
} from '@chakra-ui/react';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

import { Header } from './Header';
import { useTenant } from '../../contexts/TenantContext';
import CustomButton from '../Onboarding/Common/CustomButton';
import { sendMagicLink } from '../../api/services/onboarding/magicLink';

export const LoginPage: React.FC = () => {
  const { config } = useTenant();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const toast = useToast();

  const handleSendMagicLink = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSending(true);

    try {
      await sendMagicLink(email.trim());
      
      setIsSent(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Failed to send magic link:', error);
      
      let errorMessage = 'Failed to send magic link. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = () => {
    setIsSent(false);
    setEmail('');
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container
        bg="white"
        py={{ base: 3, md: 3 }}
        px={{ base: 4, md: 8 }}
        borderBottom="1px solid #E2E8F0"
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box>
          <VStack spacing={8} align="stretch">
            {/* Logo Section */}
            <VStack spacing={3} textAlign="center">
              <Image
                src={config.logo}
                alt="Logo"
                h={{ base: "48px", md: "56px" }}
                mb={6}
                mx="auto"
                objectFit="contain"
              />
              <Text
                fontSize={{ base: "xl", md: "1.5xl" }}
                fontWeight="bold"
                color="black"
                letterSpacing="tight"
              >
                {isSent ? "Check your email" : "Welcome Back"}
              </Text>
              <Text fontSize="md" color="gray.500" maxW="80%" mx="auto">
                {isSent 
                  ? "We've sent a magic link to your email. Click the link to log in securely."
                  : "Enter your email to receive a magic link to log in."
                }
              </Text>
            </VStack>

            {/* Magic Link Form */}
            {!isSent ? (
              <VStack spacing={5} align="stretch">
                <Box>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="gray.50"
                    border="1.5px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    h="48px"
                    fontSize="md"
                    _placeholder={{ color: 'gray.400' }}
                    _focus={{
                      borderColor: config.accentColor,
                      boxShadow: `0 0 0 2px ${config.accentLightColor || config.accentColor}`,
                      bg: "white"
                    }}
                    transition="all 0.2s"
                    disabled={isSending}
                  />
                </Box>

                <CustomButton
                  onClick={handleSendMagicLink}
                  w="full"
                  h="48px"
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="2xl"
                  bg={config.primaryColor}
                  color="black"
                  _hover={{
                    bg: config.accentLightColor || config.accentColor,
                    border: `1.5px solid ${config.accentColor}`,
                    boxShadow: `0 2px 8px ${config.accentLightColor || config.accentColor}33`
                  }}
                  _active={{
                    bg: config.accentColor,
                    color: "white"
                  }}
                  isLoading={isSending}
                  loadingText="Sending..."
                  disabled={isSending}
                >
                  Send Magic Link
                </CustomButton>
              </VStack>
            ) : (
              <VStack spacing={6} align="stretch">
                {/* Success Animation */}
                <VStack spacing={4} py={6}>
                  <Circle
                    size="80px"
                    bg="green.100"
                    border="3px solid"
                    borderColor="green.200"
                    animation="pulse 2s infinite"
                  >
                    <Icon as={EnvelopeIcon} w={10} h={10} color="green.500" />
                  </Circle>
                  
                  <VStack spacing={2}>
                    <Text fontSize="lg" fontWeight="bold" color="green.700">
                      Magic link sent!
                    </Text>
                    <Text fontSize="sm" color="green.600" textAlign="center">
                      We've sent a secure login link to:
                    </Text>
                    <Box
                      p={3}
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                      w="full"
                    >
                      <Text fontSize="sm" color="gray.700" fontWeight="medium" textAlign="center">
                        {email}
                      </Text>
                    </Box>
                  </VStack>
                </VStack>

                {/* Instructions */}
                <Box
                  p={4}
                  bg={config.accentLightColor}
                  border="1px solid"
                  borderColor={`${config.accentColor}40`}
                  borderRadius="lg"
                >
                  <VStack spacing={3} align="start">
                    <Text fontSize="sm" fontWeight="bold" color={config.accentColor}>
                      What happens next?
                    </Text>
                    <VStack spacing={2} align="start" w="full">
                      <Flex align="center" gap={2}>
                        <Circle size="20px" bg={config.accentColor} color="white">
                          <Text fontSize="xs" fontWeight="bold">1</Text>
                        </Circle>
                        <Text fontSize="sm" color="gray.700">Check your email inbox</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Circle size="20px" bg={config.accentColor} color="white">
                          <Text fontSize="xs" fontWeight="bold">2</Text>
                        </Circle>
                        <Text fontSize="sm" color="gray.700">Click the "Log in" button in the email</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Circle size="20px" bg={config.accentColor} color="white">
                          <Text fontSize="xs" fontWeight="bold">3</Text>
                        </Circle>
                        <Text fontSize="sm" color="gray.700">You'll be automatically logged in</Text>
                      </Flex>
                    </VStack>
                  </VStack>
                </Box>
                
                {/* Action Buttons */}
                <VStack spacing={3}>
                  <Button
                    onClick={handleResend}
                    variant="outline"
                    borderColor={config.accentColor}
                    color={config.accentColor}
                    bg="white"
                    h="48px"
                    fontSize="md"
                    fontWeight="bold"
                    borderRadius="2xl"
                    w="full"
                    leftIcon={<Icon as={ArrowLeftIcon} w={4} h={4} />}
                    _hover={{
                      bg: config.accentLightColor || "gray.50",
                      borderColor: config.accentColor,
                      color: config.accentColor,
                      boxShadow: `0 2px 8px ${config.accentLightColor || config.accentColor}33`
                    }}
                    _active={{
                      bg: config.accentLightColor || "gray.100"
                    }}
                    transition="all 0.2s"
                  >
                    Send to different email
                  </Button>
                  
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    Didn't receive the email? Check your spam folder or try again.
                  </Text>
                </VStack>
              </VStack>
            )}

            {/* Divider Section */}
            <Flex align="center" gap={2} py={2}>
              <Divider borderColor="gray.200" />
              <Text fontSize="sm" color="gray.400" fontWeight="medium">
                or
              </Text>
              <Divider borderColor="gray.200" />
            </Flex>

            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                New here? Start a new claim to create an account.
              </Text>
              <Button
                onClick={() => { window.location.href = '/'; }}
                variant="outline"
                borderColor={config.accentColor}
                color={config.accentColor}
                bg="white"
                h="48px"
                fontSize="md"
                fontWeight="bold"
                borderRadius="2xl"
                w="full"
                _hover={{
                  bg: config.accentLightColor || "gray.50",
                  borderColor: config.accentColor,
                  color: config.accentColor,
                  boxShadow: `0 2px 8px ${config.accentLightColor || config.accentColor}33`
                }}
                _active={{
                  bg: config.accentLightColor || "gray.100"
                }}
                transition="all 0.2s"
              >
                Start your claim
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
