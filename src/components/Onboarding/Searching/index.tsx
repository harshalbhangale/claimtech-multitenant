import React, { useEffect, useState } from 'react';
import { Box, Container, VStack, Text, Progress, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';

const SearchingAgreements: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Simple looping progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Auto-navigate to dashboard after a short delay.
  useEffect(() => {
    const timer = setTimeout(() => navigate('/auth/otpverify'), 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #EFEBFB, white)">
      <Header />

      <Container maxW="4xl" textAlign="center" pt={24}>
        <VStack spacing={10}>
          <Text color="#5B34C8" fontWeight="bold" fontSize="sm" textTransform="uppercase">
            Almost there
          </Text>

          <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold" color="gray.900">
            Searching for agreements…
          </Text>

          <Progress
            value={progress}
            w="220px"
            h="4px"
            colorScheme="blue"
            borderRadius="full"
            bg="white"
          />

          <Flex fontSize="2xl">🚀</Flex>

          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color="gray.900" maxW="lg">
            We are searching for agreements from 2019 - 2024. Your older agreements will take a further 24
            hours
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default SearchingAgreements;
export { SearchingAgreements }; 