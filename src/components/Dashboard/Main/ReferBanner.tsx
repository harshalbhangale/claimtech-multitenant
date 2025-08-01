import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../../contexts/TenantContext';
interface ReferProps {
  onRefer?: () => void;
}

/**
 * Yellow banner prompting user to refer friends.
 */
const Refer: React.FC<ReferProps> = ({ onRefer }) => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const handleClick = () => {
    if (onRefer) {
      onRefer();
    }
    navigate('/dashboard/refer');
  };

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
            Refer a friend ✨
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
          fontWeight="bold"
          fontSize="sm"
          onClick={handleClick}
        >
          Refer
        </Button>
      </Flex>
    </Box>
  );
};

export default Refer;
export { Refer };
