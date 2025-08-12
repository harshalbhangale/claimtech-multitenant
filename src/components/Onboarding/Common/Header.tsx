import React from 'react';
import { Flex, Image, Box } from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';

export const Header: React.FC = () => {
  const { config } = useTenant();

  return (
    <Box textAlign="center" py={1} mb={2}>
      <Flex 
        maxW="3xl"
        mx="auto"
        px={{ base: 6, sm: 8, lg: 12 }}
        justify="space-between" 
        align="center"
      >
        <Image 
          src={config.logo} 
          alt={config.name}
          h={{ base: "28px", md: "36px" }}
          objectFit="contain"
          maxW={{ base: "200px", md: "auto" }}
        />
        <Image 
          src={config.secured} 
          alt="Website Secured"
          h={{ base: "24px", md: "32px" }}
          objectFit="contain"
          maxW={{ base: "200px", md: "auto" }}
        />
      </Flex>
    </Box>
  );
}; 