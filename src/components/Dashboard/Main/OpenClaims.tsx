import React from 'react';
import { VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ClaimCard from './ClaimCard';
import ClaimCardSkeleton from './ClaimCardSkeleton';
import { useTenant } from '../../../contexts/TenantContext';
import { useClaimsWithRealtime, useCentralizedAgreementsPolling } from '../../../hooks/queries/useClaims';
import { useRequirements } from '../../../hooks/queries/useRequirements';
import { useAgreementsWithRealtime } from '../../../hooks/queries/useClaims';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';

const OpenClaims: React.FC = () => {
  const { config } = useTenant();
  const queryClient = useQueryClient();
  
  // TanStack Query handles all the loading, error, and data states with real-time updates
  const { data: claims, isPending, error, refetchImmediately: refetchClaimsImmediately } = useClaimsWithRealtime();

  // Centralized polling for all agreements - reduces server load significantly
  useCentralizedAgreementsPolling();

  // Global visibility change listener for immediate staff updates
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User returned to the tab, immediately refetch all data
        refetchClaimsImmediately();
        // Invalidate all agreements queries
        claims?.forEach(claim => {
          queryClient.invalidateQueries({ queryKey: ['agreements', claim.id] });
        });
      }
    };

    const handleFocus = () => {
      // User switched back to the tab, immediately refetch all data
      refetchClaimsImmediately();
      // Invalidate all agreements queries
      claims?.forEach(claim => {
        queryClient.invalidateQueries({ queryKey: ['agreements', claim.id] });
      });
    };

    const handleOnline = () => {
      // Network connection restored, immediately refetch all data
      refetchClaimsImmediately();
      // Invalidate all agreements queries
      claims?.forEach(claim => {
        queryClient.invalidateQueries({ queryKey: ['agreements', claim.id] });
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [claims, queryClient, refetchClaimsImmediately]);

  return (
    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
      <HStack justify="space-between" align="center">
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          fontFamily="Poppins"
          pt={{ base: 3, md: 4 }}
          pb={2}
        >
          My open claims
        </Text>
      </HStack>
      
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

      {/* TanStack Query handles loading state - Show skeleton cards */}
      {isPending && (
        <VStack spacing={4} align="stretch">
          <ClaimCardSkeleton hasAdditionalRequirements={false} />
          <ClaimCardSkeleton hasAdditionalRequirements={false} />
          <ClaimCardSkeleton hasAdditionalRequirements={false} />
        </VStack>
      )}
      
      {/* TanStack Query handles error state */}
      {error && (
        <Alert status="error" borderRadius={{ base: "md", md: "md" }} fontSize={{ base: "sm", md: "md" }}>
          <AlertIcon />
          Failed to load claims. Please try again.
        </Alert>
      )}
      
      {/* TanStack Query handles empty state */}
      {!isPending && !error && (!claims || claims.length === 0) && (
        <Text color="gray.500" fontFamily="Poppins" fontSize={{ base: "sm", md: "md" }} textAlign="center" py={{ base: 4, md: 6 }}>
          No open claims found.
        </Text>
      )}
      
      {/* Render claims */}
      {!isPending && !error && claims?.map((claim) => {
        // Fetch requirements for this claim
        // We'll use the useRequirements hook inside a child component to avoid breaking rules of hooks
        return (
          <ClaimCardWithRequirements
            key={claim.id}
            claim={claim}
          />
        );
      })}
    </VStack>
  );
};

// Helper component to fetch requirements and agreements for a claim and render ClaimCard
const ClaimCardWithRequirements: React.FC<{ claim: any }> = ({ claim }) => {
  const { data: requirements, isPending: _isReqPending } = useRequirements(claim.id);
  const { data: agreements, isPending: isAgPending } = useAgreementsWithRealtime(claim.id);
  
  // Count pending generic requirements (exclude special types handled by global banners)
  const hasPendingRequirements = (requirements?.some(r =>
    (r.status === 'pending' || r.status === 'rejected') &&
    (() => {
      const requirementType = (r.requirement_type as string) || '';
      const specialTypes = ['signature', 'previous_address', 'previous_name', 'id_document'];
      
      // Special case: "Request proof for name change" should show the button
      if (requirementType === 'previous_name' && r.requirement_reason && 
          r.requirement_reason.toLowerCase().includes('name change')) {
        return true; // Show the button
      }
      
      // Exclude other special types
      return !specialTypes.includes(requirementType);
    })()
  )) || false;

  // No need for individual polling - centralized polling handles all updates
  // This significantly reduces server load from multiple API calls

  return (
    <ClaimCard
      id={claim.id}
      lender={claim.lender_name}
      stage={claim.status}
      progress={25}
      onUploadId={() => {}}
      onProvideDetails={() => {}}
      hasAdditionalRequirements={hasPendingRequirements}
      agreements={agreements}
      agreementsLoading={isAgPending}
      isRealTimeUpdating={true} // Enable real-time updates for both claims and agreements
    />
  );
};

export default OpenClaims;
export { OpenClaims };
