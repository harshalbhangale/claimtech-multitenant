import React from 'react';
import { Button, Text } from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';

interface NextButtonProps {
  onClick: () => void;
  label?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({
  onClick,
  label = "Next step",
  isDisabled = false,
  isLoading = false
}) => {
  const { config } = useTenant();
  
  return (
    <Button
      w="full"
      bg={config.primaryColor}
      color="black"
      p={6}
      mb={6}
      onClick={onClick}
      _hover={{ bg: `${config.primaryColor}CC` }}
      _active={{ transform: "scale(0.98)" }}
      fontWeight="bold"
      height="auto"
      fontSize="md"
      borderRadius="full"
      rightIcon={<Text as="span" ml={1}>→</Text>}
      minH="56px"
      isDisabled={isDisabled}
      isLoading={isLoading}
      fontFamily="Poppins"
    >
      {label}
    </Button>
  );
};

export default NextButton;
