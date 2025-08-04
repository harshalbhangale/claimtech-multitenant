import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../../contexts/TenantContext';
interface ActionBannerProps {
  onUploadId?: () => void;
  label?: string;
  buttonText?: string;
}

/**
 * Red action-required banner with upload button.
 */
const ActionBanner: React.FC<ActionBannerProps> = ({
  onUploadId,
  label = 'Action Required',
  buttonText = 'Upload ID ',
}) => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const handleClick = () => {
    if (onUploadId) {
      onUploadId();
    }
    navigate('/dashboard/documentupload');
  };

  return (
    <Box
      border="1px solid #FF5A5A"
      bg="#FFF6F6"
      p={4}
      borderRadius="lg"
      fontFamily="Poppins"
    >
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <HStack spacing={2} align="center">
          <Icon as={ExclamationCircleIcon} w={4} h={4} color="#FF5A5A" />
          <Text fontWeight="bold" fontSize="md">
            {label}
          </Text>
        </HStack>

        <Button
          bg={config.primaryColor}
          color="black"
          _hover={{ bg: `${config.primaryColor}CC` }}
          borderRadius="full"
          h="32px"
          px={6}
          fontWeight="md"
          fontSize="sm"
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </Flex>
    </Box>
  );
};

export default ActionBanner;
export { ActionBanner };
