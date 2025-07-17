import React from 'react';
import { Flex, Image, Box } from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';
import { UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { config } = useTenant();
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={3} borderBottom="1px solid #E2E8F0">
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
          cursor="pointer"
          onClick={() => navigate('/dashboard')}
        />
        
        {/* User Icon */}
        <Box  
          bg={config.accentColor}
          p={2} 
          borderRadius="full" 
          color="white" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          cursor="pointer"
          onClick={() => navigate('/dashboard/profile')}
        >
          <UserIcon width={18} height={18} />
        </Box>
       
      </Flex>
    </Box>
  );
  
}; 