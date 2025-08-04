import React from 'react';
import { Box, Text, Circle } from '@chakra-ui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface SuccessMessageProps {
  message: string;
  size?: 'xs' | 'sm' | 'md' ;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, size = 'sm' }) => {
  const sizeConfig = {
    xs: {
      padding: 2,
      iconSize: 12,
      circleSize: 16,
      fontSize: 'xs'
    },
    sm: {
      padding: 3,
      iconSize: 16,
      circleSize: 20,
      fontSize: 'sm'
    },
    md: {
      padding: 4,
      iconSize: 14,
      circleSize: 24,
      fontSize: 'md'
    },
  };

  const config = sizeConfig[size];

  return (
    <Box
      bg="green.50"
      border="1px solid"
      borderColor="green.200"
      borderRadius="lg"
      p={config.padding}
      display="flex"
      alignItems="center"
      gap={3}
      mb={2}
    >
      <Circle size={`${config.circleSize}px`} bg="green.500" color="white" flexShrink={0}>
        <CheckIcon width={config.iconSize} height={config.iconSize} />
      </Circle>
      <Text
        color="green.800"
        fontFamily="Poppins"
        fontWeight="semibold"
        fontSize={config.fontSize}
      >
        {message}
      </Text>
    </Box>
  );
};

export default SuccessMessage; 