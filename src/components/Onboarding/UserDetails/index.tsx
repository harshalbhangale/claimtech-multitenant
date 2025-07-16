import React, { useState } from 'react';
import {
  Container,
  VStack,
  Text,
  Box,
  Flex,
  HStack,
  Input,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { SecureBar } from '../Common/Securebar';
import { ProgressBar } from '../Common/ProgressBar';
import { useTenant } from '../../../contexts/TenantContext';
import NextButton from '../../Onboarding/Common/NextButton';
import Trustpilot from '../Common/Trustpilot';

export const UserDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });

  const handleNextStep = () => {
    navigate('/auth/addresssearch');
  };

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 4, sm: 6, lg: 8 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Progress Steps */}
          <ProgressBar currentStep={2} totalSteps={4} />
          {/* Purple Banner */}
          <Box bg={config.accentColor} color="white" p={5} borderRadius="xl" mb={4}>
            <Flex justify="center" align="center" gap={4}>
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
                You have selected 1 agreement which could be worth a total refund value of
              </Text>
              <Box position="relative" display="inline-block" minW="90px">
                <Image
                  src="/icons/scribble.svg"
                  alt=""
                  position="absolute"
                  top="-10px"
                  left="-10px"
                  right="-10px"
                  bottom="-10px"
                  w="calc(100% + 20px)"
                  h="calc(100% + 20px)"
                />
                <Text
                  as="span"
                  position="relative"
                  color="#000000"
                  fontWeight="bold"
                  zIndex={1}
                >
                  £2976*
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Form Section */}
          <Box border="2px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mb={3}
              color="gray.900"
            >
              Let's find your finance agreements
            </Text>
            <Text color="gray.600" mb={6} fontSize={{ base: "sm", md: "md" }}>
              Enter your details below so we can search for your finance agreements
            </Text>

            <VStack spacing={5} align="stretch" mb={6}>
              <Input
                placeholder="First name"
                size="lg"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                height="56px"
              />

              <Input
                placeholder="Last name"
                size="lg"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                height="56px"
              />

              <Box>
                <HStack spacing={2} mb={2} align="center">
                <Box as="svg" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor"
                    w="16px"
                    h="16px"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" 
                    />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    Date of birth
                  </Text>
                </HStack>
                <HStack spacing={4} w="full">
                  <Input
                    placeholder="DD"
                    size="lg"
                    flex="1"
                    value={dob.day}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setDob({ ...dob, day: value });
                    }}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="xl"
                    _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                    height="56px"
                    fontSize="lg"
                    color="gray.500"
                    textAlign="left"
                    fontFamily="Poppins"
                    _placeholder={{ color: "gray.400", fontSize: "lg" }}
                    maxLength={2}
                    inputMode="numeric"
                  />
                  <Input
                    placeholder="MM"
                    size="lg"
                    flex="1"
                    value={dob.month}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setDob({ ...dob, month: value });
                    }}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="xl"
                    _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                    height="56px"
                    fontSize="lg"
                    color="gray.500"
                    textAlign="left"
                    fontFamily="Poppins"
                    _placeholder={{ color: "gray.400", fontSize: "lg" }}
                    maxLength={2}
                    inputMode="numeric"
                  />
                  <Input
                    placeholder="YYYY"
                    size="lg"
                    flex="1"
                    value={dob.year}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setDob({ ...dob, year: value });
                    }}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="xl"
                    _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                    height="56px"
                    fontSize="lg"
                    color="gray.500"
                    textAlign="left"
                    fontFamily="Poppins"
                    _placeholder={{ color: "gray.400", fontSize: "lg" }}
                    maxLength={4}
                    inputMode="numeric"
                  />
                </HStack>
              </Box>
            </VStack>

            {/* Next Step Button */}
            <NextButton onClick={handleNextStep} />

            {/* Bottom Centered Content */}
            <VStack spacing={4} align="center">
              {/* Trustpilot Rating */}
              <Trustpilot size="md" />

            </VStack>
          </Box>

          {/* Bottom Features */}
          <Box w="full" maxW={{ base: "full", md: "2xl" }}>
            <SecureBar />
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default UserDetailsPage;
