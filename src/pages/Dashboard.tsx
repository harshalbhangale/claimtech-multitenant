import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Header } from '../components/Dashboard/Main/Header';
//import { Refer } from '../components/Dashboard/Main/ReferBanner';
import { ActionBanner } from '../components/Dashboard/Main/ActionRequiredBanner';
import { GlobalRequirementBanners } from '../components/Dashboard/Main/GlobalRequirementBanners';
import { OpenClaims } from '../components/Dashboard/Main/OpenClaims';
import api from '../api';
import { EverythingWeNeed } from '../components/Dashboard/Main/EverythingWeNeed';

const Dashboard: React.FC = () => {
  const [showUploadIdBanner, setShowUploadIdBanner] = useState<boolean>(false);
  useEffect(() => {
    let mounted = true;
    const checkIdDoc = async () => {
      try {
        const res = await api.get('api/v1/onboarding/upload-id/');
        // If we got a URL, ID already exists -> do not show banner
        if (!mounted) return;
        setShowUploadIdBanner(!(res?.data && res.data.id_document_url));
      } catch (err: any) {
        // Show banner only when backend explicitly says ID document not found
        const msg = err?.response?.data?.error;
        if (!mounted) return;
        setShowUploadIdBanner(msg === 'ID document not found');
      }
    };
    checkIdDoc();
    return () => { mounted = false; };
  }, []);
  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          mb={3}
          fontFamily="Poppins"
        >
          Your dashboard
        </Text>
        <VStack spacing={1} align="stretch">
          <VStack spacing={1} align="stretch">
            {showUploadIdBanner && (
              <ActionBanner label="Action Required" buttonText="Upload ID" />
            )}
            {!showUploadIdBanner && (
              <EverythingWeNeed/>
            )}
            <GlobalRequirementBanners />
          </VStack>
          <OpenClaims />
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
