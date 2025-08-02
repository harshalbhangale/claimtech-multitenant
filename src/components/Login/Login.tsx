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
} from '@chakra-ui/react';

import { Header } from './Header';
import { useTenant } from '../../contexts/TenantContext';
import CustomButton from '../Onboarding/Common/CustomButton';

export const LoginPage: React.FC = () => {
  const { config } = useTenant();
  const [email, setEmail] = useState('');




  // const handleSignIn = () => {
  //   // Handle sign in logic here
  //   console.log('Sign in with:', { email});
  // };

  // const handleStartClaim = () => {
  //   // Handle start new claim logic here
  //   console.log('Starting new claim');
  // };

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
                Welcome Back
              </Text>
              <Text fontSize="md" color="gray.500" maxW="80%" mx="auto">
                Enter your email to receive a magic link to log in.
              </Text>
            </VStack>

            {/* Magic Link Form */}
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
                />
              </Box>

              <CustomButton
                onClick={() => {
                  // Handle sending magic link logic here
                  console.log('Send magic link to:', email);
                }}
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
              >
                Send Magic Link
              </CustomButton>
            </VStack>

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
