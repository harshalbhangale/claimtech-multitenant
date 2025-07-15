import React from 'react';
import { Flex, Text, Circle, VStack, HStack, SimpleGrid, Box } from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';

export const SecureBar: React.FC = () => {
  const { config } = useTenant();

  return (
    <SimpleGrid 
      columns={{ base: 3, sm: 3 }} 
      spacing={{ base: 10, md: 24 }} 
      py={{ base: 8, md: 8 }}
      w="full"
    >
      {/* 100% No Win No Fee */}
      <VStack align="center" textAlign="center" spacing={{ base: 3, md: 3 }}>
        <Circle 
          size={{ base: "40px", md: "40px" }} 
          bg="#EEEBFA" 
          mb={{ base: 0, md: 0 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box 
            as="svg" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            w={{ base: "24px", md: "24px" }} 
            h={{ base: "24px", md: "24px" }} 
            color={config.accentColor}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </Box>
        </Circle>
        <VStack spacing={0}>
          <Text 
            fontSize={{ base: "xs", sm: "sm", md: "sm" }} 
            color="gray.700"
            fontWeight="bold"
            lineHeight="1.3"
          >
            100% No Win No
          </Text>
          <Text 
            fontSize={{ base: "xs", sm: "sm", md: "sm" }} 
            color="gray.700"
            fontWeight="bold"
            lineHeight="1.3"
          >
            Fee**
          </Text>
        </VStack>
      </VStack>

      {/* Quick & easy form */}
      <VStack align="center" textAlign="center" spacing={{ base: 3, md: 3 }}>
        <Circle 
          size={{ base: "40px", md: "40px" }} 
          bg="#EEEBFA" 
          mb={{ base: 0, md: 0 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box 
            as="svg" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            w={{ base: "24px", md: "24px" }} 
            h={{ base: "24px", md: "24px" }} 
            color={config.accentColor}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </Box>
        </Circle>
        <VStack spacing={0}>
          <Text 
            fontSize={{ base: "xs", sm: "sm", md: "sm" }} 
            color="gray.700"
            fontWeight="bold"
            lineHeight="1.3"
          >
            Quick & easy
          </Text>
          <Text 
            fontSize={{ base: "xs", sm: "sm", md: "sm" }} 
            color="gray.700"
            fontWeight="bold"
            lineHeight="1.3"
          >
            form
          </Text>
        </VStack>
      </VStack>

      {/* Claim up to £6,427* */}
      <VStack align="center" textAlign="center" spacing={{ base: 3, md: 3 }}>
        <Circle 
          size={{ base: "40px", md: "40px" }} 
          bg="#EEEBFA" 
          mb={{ base: 0, md: 0 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box 
            as="svg" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            w={{ base: "24px", md: "24px" }} 
            h={{ base: "24px", md: "24px" }} 
            color={config.accentColor}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </Box>
        </Circle>
        <VStack spacing={0}>
          <Text 
            fontSize={{ base: "xs", sm: "sm", md: "sm" }} 
            color="gray.700"
            fontWeight="bold"
            lineHeight="1.3"
          >
            Claim up to
          </Text>
          <Text 
            fontSize={{ base: "xs", sm: "sm", md: "sm" }} 
            color="gray.700"
            fontWeight="bold"
            lineHeight="1.3"
          >
            £6,427*
          </Text>
        </VStack>
      </VStack>
    </SimpleGrid>
  );
};
