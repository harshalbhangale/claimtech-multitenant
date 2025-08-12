import React from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Header } from '../components/Dashboard/Main/Header';
//import { Refer } from '../components/Dashboard/Main/ReferBanner';
import { ActionBanner } from '../components/Dashboard/Main/ActionRequiredBanner';
import { OpenClaims } from '../components/Dashboard/Main/OpenClaims';


const Dashboard: React.FC = () => {
  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={6}
          fontFamily="Poppins"
        >
          Your dashboard
        </Text>
        
        <VStack spacing={4} align="stretch">
          <VStack spacing={2} align="stretch">
            <ActionBanner />
          </VStack>
          <OpenClaims />
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
