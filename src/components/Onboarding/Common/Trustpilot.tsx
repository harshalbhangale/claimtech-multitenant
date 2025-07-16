import React from 'react';
import { Image,  VStack } from '@chakra-ui/react';

interface TrustpilotProps {
  size?: 'sm' | 'md' | 'lg';
}

const Trustpilot: React.FC<TrustpilotProps> = ({ size = 'md' }) => {
  // Size variants
  const imageHeight = {
    sm: '24px',
    md: '32px',
    lg: '40px'
  };

  return (
    <VStack spacing={2} align="center">
      <Image 
        src="/icons/trustpilot.svg" 
        alt="Trustpilot Rating" 
        h={imageHeight[size]}
        objectFit="contain"
      />
    </VStack>
  );
};

export default Trustpilot;
