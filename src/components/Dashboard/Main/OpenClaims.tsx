import React from 'react';
import { VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ClaimCard from './ClaimCard';
import { useTenant } from '../../../contexts/TenantContext';
import { useState, useEffect } from 'react';
import { getClaims } from '../../../api/services/dashboard/getClaims';
import type { Claim } from '../../../api/services/dashboard/getClaims';
import { Spinner, Alert, AlertIcon } from '@chakra-ui/react';

const OpenClaims: React.FC = () => {
  const { config } = useTenant();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClaims();
        setClaims(data);
      } catch (err) {
        setError('Failed to load claims.');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);
  return (
    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
      <Text
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold"
        fontFamily="Poppins"
        pt={{ base: 3, md: 4 }}
        pb={2}
      >
        My open claims
      </Text>
      <HStack 
        bg={config.accentLightColor}
        borderRadius={{ base: "md", md: "md" }} 
        p={{ base: 3, md: 4 }} 
        spacing={{ base: 2, md: 3 }} 
        fontSize={{ base: "xs", md: "sm" }} 
        border="1px solid #DED6F5"
        align="start"
      >
        <Icon 
          as={ExclamationCircleIcon} 
          w={{ base: 4, md: 5 }} 
          h={{ base: 4, md: 5 }} 
          color={config.accentColor} 
          flexShrink={0}
          mt={0.5}
        />
        <Text 
          fontFamily="Poppins" 
          fontWeight="medium" 
          color="#1A1A1A"
          lineHeight="1.5"
          fontSize={{ base: "xs", md: "sm" }}
        >
          We're currently searching your credit file for finance agreements between 2007 and 2019, which will be available within 2 days. We'll send you a text if we find any!
        </Text>
      </HStack>

      {loading && <Spinner size={{ base: "md", md: "lg" }} />}
      {error && (
        <Alert status="error" borderRadius={{ base: "md", md: "md" }} fontSize={{ base: "sm", md: "md" }}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      {!loading && !error && claims.length === 0 && (
        <Text color="gray.500" fontFamily="Poppins" fontSize={{ base: "sm", md: "md" }} textAlign="center" py={{ base: 4, md: 6 }}>
          No open claims found.
        </Text>
      )}
      {claims.map((claim) => (
        <ClaimCard
          key={claim.id}
          id={claim.id}
          lender={claim.lender_name}
          stage={claim.status}
          progress={25} // You can adjust this if you have a real progress value
          onUploadId={() => {}}
          onProvideDetails={() => {}}
        />
      ))}
    </VStack>
  );
};

export default OpenClaims;
export { OpenClaims }; 
