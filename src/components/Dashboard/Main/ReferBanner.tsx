import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
} from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';

interface ReferProps {
  onRefer?: () => void;
}

/**
 * Yellow banner for refer-a-friend (Coming Soon, button disabled).
 */
const Refer: React.FC<ReferProps> = () => {
  const { config } = useTenant();

  return (
    <Box
      border="2px solid #FFECC0"
      bg="#FFFDF4"
      p={5}
      borderRadius="lg"
      fontFamily="Poppins"
    >
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <Box>
          <Text fontWeight="bold" mb={1} fontSize="md">
            Refer a friend <Badge ml={2} colorScheme="yellow" borderRadius="full" px={2} fontSize="0.8em">Coming Soon</Badge>
          </Text>
          <Text fontSize="sm">
            Refer friends or family and get a £20 Amazon voucher per successful claimant!
          </Text>
        </Box>

        <Button
          bg={config.primaryColor}
          color="black"
          _hover={{ bg: `${config.primaryColor}80` }}
          borderRadius="full"
          h="36px"
          px={6}
          fontWeight="medium"
          fontSize="sm"
          isDisabled
        >
          Refer
        </Button>
      </Flex>
    </Box>
  );
};

export default Refer;
export { Refer };
