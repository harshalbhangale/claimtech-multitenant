import React from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Header } from '../components/Dashboard/Main/Header';
import { Refer } from '../components/Dashboard/Main/ReferBanner';
import { ActionBanner } from '../components/Dashboard/Main/ActionRequiredBanner';
import { OpenClaims } from '../components/Dashboard/Main/OpenClaims';

const Dashboard: React.FC = () => {
  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="3xl" pt={8} pb={12}>
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
            <Refer />
            <ActionBanner />
          </VStack>
          <OpenClaims />
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
