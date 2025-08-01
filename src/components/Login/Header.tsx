// src/components/Login/Header.tsx
import React from 'react';
import { Flex, Image, Box } from '@chakra-ui/react';
import { useTenant } from '../../contexts/TenantContext';

export const Header: React.FC = () => {
  const { config } = useTenant();

  return (
    <Box bg="white" py={{ base: 3, md: 3 }} px={{ base: 4, md: 8 }} borderBottom='1px solid #E2E8F0'>
      <Flex 
        maxW="3xl"
        mx="auto"
        px={{ base: 4, sm: 6, lg: 8 }}
        justify="space-between" 
        align="center"
      >
        {/* Logo */}
        <Image 
          src={config.logo} 
          alt={config.name}
          h={{ base: "28px", md: "36px" }}
          objectFit="contain"
          maxW={{ base: "200px", md: "auto" }}
        />
        
        {/* Secured Badge */}
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
