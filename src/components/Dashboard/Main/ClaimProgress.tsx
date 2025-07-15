import React from 'react';
import { Box, HStack, VStack, Text, Circle } from '@chakra-ui/react';

interface ClaimProgressProps {
  currentStep: number;
}

const labels = [
  'Reviewing your details',
  'Documents requested',
  'Claim submitted',
  'Claim acknowledged',
];

const ClaimProgress: React.FC<ClaimProgressProps> = ({ currentStep }) => (
  <Box w="full">
    <HStack spacing={4} align="flex-start" w="full">
      {labels.map((label, idx) => {
        const step = idx + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const color = isActive || isCompleted ? '#5B34C8' : '#E2E8F0';
        const textColor = isActive ? 'purple.600' : isCompleted ? 'gray.600' : 'gray.400';
        return (
          <VStack key={step} spacing={2} flex={1} align="center">
            <Box w="full" h="6px" bg={color} borderRadius="full" />
            <VStack spacing={1} align="center">
              <Text fontSize="xs" textAlign="center" color={textColor} fontWeight={isActive ? 'bold' : 'normal'}>
                {label}
              </Text>
            </VStack>
          </VStack>
        );
      })}
    </HStack>
  </Box>
);

export default ClaimProgress;
export { ClaimProgress }; 