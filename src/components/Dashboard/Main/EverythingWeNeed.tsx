import React from 'react';
import { Box, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useTenant } from '../../../contexts/TenantContext';

const EverythingWeNeed: React.FC = () => {
  const { config } = useTenant();
  return (
    <Box
      border="1px solid #E2E8F0"
      bg="white"
      p={3}
      borderRadius="lg"
      fontFamily="Poppins"
    >
      <Text fontWeight="bold" mb={1}>You're up to date! We have everything we need</Text>
      <Text fontSize="sm" color="gray.600" mb={2}>We'll message you if we require anything else</Text>
      <VStack align="start" spacing={1}>
        <HStack>
          <Icon as={CheckCircleIcon} color={config.accentColor} />
          <Text fontSize="sm">ID uploaded</Text>
        </HStack>
        <HStack>
          <Icon as={CheckCircleIcon} color={config.accentColor} />
          <Text fontSize="sm">Signature done</Text>
        </HStack>
        <HStack>
          <Icon as={CheckCircleIcon} color={config.accentColor} />
          <Text fontSize="sm">Details done</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default EverythingWeNeed;
export { EverythingWeNeed };