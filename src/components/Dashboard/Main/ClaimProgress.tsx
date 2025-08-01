import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';

interface ClaimProgressProps {
  currentStep: number;
}

const labels = [
  'Reviewing your details',
  'Documents requested',
  'Claim submitted',
  'Claim acknowledged',
];

const ClaimProgress: React.FC<ClaimProgressProps> = ({ currentStep }) => {
  const { config } = useTenant();
  
  return (
    <Box w="full">
      <HStack spacing={4} align="flex-start" w="full">
        {labels.map((label, idx) => {
          const step = idx + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          const color = isActive ? config.accentColor : isCompleted ? (config.completedColor || config.accentColor) : '#E2E8F0';
          const textColor = isActive ? config.accentColor : isCompleted ? 'gray.600' : 'gray.400';
          return (
            <VStack key={step} spacing={2} flex={1} align="center">
              <Box w="full" h="6px" bg={color} borderRadius="full" />
              <VStack spacing={1} align="center">
                <Text 
                  fontSize={{ base: "2xs", md: "xs" }} 
                  textAlign="center" 
                  color={textColor} 
                  fontWeight={isActive ? 'bold' : 'normal'}
                  lineHeight="1.2"
                >
                  {label}
                </Text>
              </VStack>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
};

export default ClaimProgress;
export { ClaimProgress }; 