import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box
        maxW="500px"
        w="full"
        textAlign="center"
        p={8}
        borderRadius="lg"
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow="lg"
      >
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          color={useColorModeValue('blue.600', 'blue.300')}
          mb={4}
        >
          404
        </Heading>
        <Heading as="h2" size="lg" mb={6}>
          Page Not Found
        </Heading>
        <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} mb={8}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button
          as={RouterLink}
          to="/"
          colorScheme="blue"
          size="lg"
          leftIcon={<FiHome />}
        >
          Return Home
        </Button>
      </Box>
    </Flex>
  );
};

export default NotFound; 