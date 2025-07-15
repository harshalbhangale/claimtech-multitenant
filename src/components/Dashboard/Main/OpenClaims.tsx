import React from 'react';
import { VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ClaimCard from './ClaimCard';

const OpenClaims: React.FC = () => (
  <VStack spacing={4} align="stretch">
    <Text
      fontSize="xl"
      fontWeight="bold"
      fontFamily="Poppins"
      pt={4}
      pb={2}
    >
      My open claims
    </Text>
    <HStack 
      bg="#F4F0FF" 
      borderRadius="md" 
      p={4} 
      spacing={3} 
      fontSize="sm" 
      border="1px solid #DED6F5"
    >
      <Icon as={ExclamationCircleIcon} w={5} h={5} color="#5B34C8" />
      <Text 
        fontFamily="Poppins" 
        fontWeight="medium" 
        color="#1A1A1A"
        lineHeight="1.5"
      >
        We're currently searching your credit file for finance agreements between 2007 and 2019, which will be available within 2 days. We'll send you a text if we find any!
      </Text>
    </HStack>

    <ClaimCard 
      lender="Zuto" 
      stage="Your LOA has been signed" 
      progress={25} 
      onUploadId={() => {}} 
      onProvideDetails={() => {}} 
    />
        <ClaimCard 
      lender="Black Horse" 
      stage="Your LOA has been signed" 
      progress={25} 
      onUploadId={() => {}} 
      onProvideDetails={() => {}} 
    />    <ClaimCard 
    lender="Barclay" 
    stage="Your LOA has been signed" 
    progress={25} 
    onUploadId={() => {}} 
    onProvideDetails={() => {}} 
  />
  </VStack>
);

export default OpenClaims;
export { OpenClaims }; 