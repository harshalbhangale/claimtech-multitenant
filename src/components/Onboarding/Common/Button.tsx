import React from 'react';
import { Button as ChakraButton, Text } from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';
import type{ButtonProps} from '@chakra-ui/react';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({ children, ...props }) => {
  const { config } = useTenant();
  
  return (
    <ChakraButton
      w="full"
      bg={config.primaryColor}
      color="black"
      p={6}
      mb={6}
      _hover={{ bg: '#A8EF7D' }}
      _active={{ transform: "scale(0.98)" }}
      fontWeight="medium"
      height="auto"
      fontSize="md"
      borderRadius="full"
      rightIcon={<Text as="span" ml={1}>→</Text>}
      minH="56px"
      fontFamily="Poppins"
      {...props}
    >
      {children}
    </ChakraButton>
  );
};

export default Button;
