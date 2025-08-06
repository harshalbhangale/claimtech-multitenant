import React from 'react';
import {
  Box,
  Skeleton,
  VStack,
  HStack,
  Circle,
} from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';

interface ClaimCardSkeletonProps {
  hasAdditionalRequirements?: boolean;
}

const ClaimCardSkeleton: React.FC<ClaimCardSkeletonProps> = ({ 
  hasAdditionalRequirements = false 
}) => {
  const { config } = useTenant();

  return (
    <Box border="1.5px solid #E2E8F0" borderRadius="lg" p={5} position="relative">
      {/* Badge Skeleton */}
      <Skeleton
        position="absolute"
        top="-10px"
        right="12px"
        height="20px"
        width="80px"
        borderRadius="full"
      />

      {/* Lender Name Skeleton */}
      <Skeleton height="24px" width="60%" mb={2} />

      {/* Status Badge Skeleton */}
      <HStack
        display="inline-flex"
        bg={`${config.accentLightColor}80`}
        borderRadius="full"
        px={{ base: 2, md: 3 }}
        py={{ base: 0.5, md: 1 }}
        mb={{ base: 2, md: 4 }}
        border="1px solid"
        borderColor={`${config.accentColor}40`}
        spacing={{ base: 1, md: 2 }}
        maxW="100%"
      >
        <Circle
          size={{ base: "14px", md: "18px" }}
          bg={config.accentColor}
          color="white"
          minW="unset"
        >
          <Skeleton size="8px" borderRadius="full" />
        </Circle>
        <Skeleton height="14px" width="80px" />
      </HStack>

      {/* Progress Bar Skeleton */}
      <VStack spacing={2} align="stretch" mb={4}>
        <Skeleton height="8px" width="100%" borderRadius="full" />
        <Skeleton height="12px" width="40%" />
      </VStack>

      <Box h={4} />

      {/* Action Buttons Skeleton */}
      <VStack spacing={6} align="stretch" mt={4}>
        {/* Provide Details Skeleton */}
        <Box>
          <HStack mb={3}>
            <Circle size="24px" bg={config.accentLightColor}>
              <Skeleton size="14px" borderRadius="full" />
            </Circle>
            <Box flex="1">
              <Skeleton height="16px" width="70%" mb={1} />
              <Skeleton height="14px" width="50%" />
            </Box>
          </HStack>
          <Skeleton height="48px" width="100%" borderRadius="full" />
        </Box>

        {/* Additional Requirements Skeleton - Only show when needed */}
        {hasAdditionalRequirements && (
          <Box>
            <HStack mb={3}>
              <Circle size="24px" bg={config.accentLightColor}>
                <Skeleton size="14px" borderRadius="full" />
              </Circle>
              <Box flex="1">
                <Skeleton height="16px" width="80%" mb={1} />
                <Skeleton height="14px" width="60%" />
              </Box>
            </HStack>
            <Skeleton height="48px" width="100%" borderRadius="full" />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ClaimCardSkeleton; 