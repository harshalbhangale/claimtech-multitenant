import React from 'react';
import { Box, VStack, Text, Image, Icon, Button, Divider, Flex } from '@chakra-ui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTenant } from '../../contexts/TenantContext';

const EmailSuccessful: React.FC<{ email?: string }> = ({ email }) => {
  const { config } = useTenant();

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgGradient={`linear(to-br, ${config.accentLightColor || "#e0f2fe"}, white 60%)`}
      px={4}
    >
      <Box
        maxW="md"
        w="100%"
        bg="white"
        borderRadius="2xl"
        boxShadow="0 8px 32px rgba(0,0,0,0.10)"
        p={{ base: 7, md: 12 }}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative accent circle */}
        <Box
          position="absolute"
          top="-60px"
          right="-60px"
          w="120px"
          h="120px"
          bg={config.accentLightColor || "blue.50"}
          opacity={0.25}
          borderRadius="full"
          zIndex={0}
        />
        {/* Logo */}
        <Image
          src={config.logo}
          alt="Logo"
          h={{ base: "44px", md: "56px" }}
          objectFit="contain"
          mx="auto"
          mb={2}
          zIndex={1}
          position="relative"
        />
        <VStack spacing={7} zIndex={1} position="relative">
          {/* Success Icon */}
          <Flex
            bgGradient={`linear(to-br, ${config.accentLightColor || "#dbeafe"}, ${config.accentColor || "#3b82f6"} 80%)`}
            borderRadius="full"
            p={3}
            boxShadow="0 2px 12px rgba(59,130,246,0.10)"
            align="center"
            justify="center"
            mx="auto"
            mt={2}
            mb={1}
            w="fit-content"
          >
            <Icon
              as={CheckCircleIcon}
              w={16}
              h={16}
              color={config.primaryColor || "blue.400"}
              filter="drop-shadow(0 2px 8px rgba(59,130,246,0.10))"
            />
          </Flex>
          {/* Headline */}
          <Text
            fontSize={{ base: "2xl", md: "2.5xl" }}
            fontWeight="extrabold"
            color={config.accentColor || "blue.600"}
            fontFamily="Poppins"
            letterSpacing="-0.5px"
          >
            Magic Link Sent!
          </Text>
          {/* Subtext */}
          <Text fontSize="lg" color="gray.700" fontWeight="medium" lineHeight="1.6">
            {email
              ? (
                <>
                  We’ve sent a secure magic link to <Text as="span" color={config.accentColor || "blue.500"} fontWeight="bold">{email}</Text>.<br />
                  Please check your inbox and click the link to log in.
                </>
              )
              : (
                <>
                  We’ve sent a secure magic link to your email.<br />
                  Please check your inbox and click the link to log in.
                </>
              )
            }
          </Text>
          <Divider borderColor={config.accentLightColor || "blue.100"} my={2} />
          {/* Help/Resend */}
          <VStack spacing={2} w="100%">
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              Didn’t get the email? Check your spam folder or
            </Text>
            <Button
              variant="outline"
              color={config.accentColor}
              borderColor={config.accentColor}
              borderRadius="2xl"
              fontWeight="bold"
              fontSize="md"
              px={8}
              py={2}
              _hover={{
                bg: config.accentLightColor || "gray.50",
                color: config.accentColor,
                borderColor: config.accentColor,
                boxShadow: `0 2px 8px ${config.accentLightColor || config.accentColor}33`
              }}
              _active={{
                bg: config.accentLightColor || "gray.100"
              }}
              transition="all 0.2s"
              onClick={() => window.location.reload()}
            >
              Resend Magic Link
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default EmailSuccessful;
