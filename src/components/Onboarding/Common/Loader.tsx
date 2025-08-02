import { Box, useToken } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

export const LoadingBar = ({ loading = 0 }: { loading: number }) => {
  const brandPrimary = useToken('colors', 'brand.primary', '#3182ce'); // fallback to blue

  const pulse = keyframes`
    0%, 50%, 75%, 100% {
      background-color: ${brandPrimary};
    }
  `;

  return (
    <Box
      bg="white"
      w="full"
      h="8px"
      borderRadius="full"
      overflow="hidden"
    >
      <Box
        h="full"
        borderRadius="full"
        transition="all 150ms ease-in-out"
        animation={`${pulse} 1s infinite linear`}
        bg="brand.primary"
        style={{ width: `${loading}%` }}
      />
    </Box>
  );
};

export default LoadingBar;
