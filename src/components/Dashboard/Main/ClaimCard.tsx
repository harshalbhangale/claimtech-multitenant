import React from 'react';
import {
  Box,

  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Circle,

} from '@chakra-ui/react';
import ClaimProgress from './ClaimProgress';
import { ArrowRightIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Button from '../../Onboarding/Common/CustomButton';
import { useTenant } from '../../../contexts/TenantContext';

interface ClaimCardProps {
  lender: string;
  stage: string;
  progress: number;
  onUploadId(): void;
  onProvideDetails(): void;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ lender, stage, onUploadId, onProvideDetails }) => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const handleUploadId = () => {
    onUploadId();
    navigate('/dashboard/documentupload');
  };

  return (
    <Box border="1.5px solid #E2E8F0" borderRadius="lg" p={5} position="relative">
      <Badge position="absolute" top="-10px" right="12px" bg="#FF004D" color="white" fontSize="xs" borderRadius="full" px={3} py={1}>
        Action required
      </Badge>

      <Heading fontSize="lg" fontWeight="bold" mb={1}>{lender}</Heading>
      <Text fontSize="sm" mb={4}>{stage}</Text>

      <ClaimProgress currentStep={1} />
      <Box h={4} />

      <VStack spacing={6} align="stretch">
        {/* Upload ID */}
        <Box>
          <HStack mb={3}>
            <Circle size="24px" bg={config.accentLightColor} color={config.accentColor}>
              <ExclamationCircleIcon width={14} height={14} strokeWidth={2} />
            </Circle>
            <Box>
              <Text fontWeight="bold" fontSize="sm">Lender requires more information</Text>
              <Text fontSize="sm">Upload ID Document</Text>
            </Box>
          </HStack>
          <Button w="full" color="black" _hover={{ bg: `${config.primaryColor}80` }} borderRadius="full" gap={1} height="48px" fontFamily="Poppins" onClick={handleUploadId}>
            Upload ID Document
            <ArrowRightIcon width={14} height={14} strokeWidth={3} />
          </Button>
        </Box>

        {/* Provide Details */}
        <Box>
          <HStack mb={3}>
            <Circle size="24px" bg={config.accentLightColor} color={config.accentColor}>
              <ExclamationCircleIcon width={14} height={14} strokeWidth={2} />
            </Circle>
            <Box>
              <Text fontWeight="bold" fontSize="sm">Lender requires more information</Text>
              <Text fontSize="sm">Provide Details</Text>
            </Box>
          </HStack>
          <Button w="full" color="black" _hover={{ bg: `${config.primaryColor}80` }} borderRadius="full" gap={1} height="48px" fontFamily="Poppins" onClick={onProvideDetails}>
            Provide Details
            <ArrowRightIcon width={14} height={14} strokeWidth={3} />
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default ClaimCard;
export { ClaimCard }; 