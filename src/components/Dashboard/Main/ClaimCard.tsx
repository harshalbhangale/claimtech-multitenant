import React, { useState } from 'react';
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
import Button from '../../Onboarding/Common/CustomButton';
import { useTenant } from '../../../contexts/TenantContext';
import { AgreementDetailsModal } from './Modals/AgreementModal';
import AdditionalInfoModal from './Modals/AdditionalInfoModal';

interface ClaimCardProps {
  lender: string;
  stage: string;
  progress: number;
  onUploadId(): void;
  onProvideDetails(): void;
  id: string;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ lender, stage,  onProvideDetails, id }) => {
  const { config } = useTenant();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] = useState(false);

  const handleProvideDetails = () => {
    setIsModalOpen(true);
    onProvideDetails();
  };

  const handleProvideAdditionalInfo = () => {
    setIsAdditionalInfoModalOpen(true);
  };

  return (
    <>
      <Box border="1.5px solid #E2E8F0" borderRadius="lg" p={5} position="relative">
        <Badge position="absolute" top="-10px" right="12px" bg="#FF004D" color="white" fontSize="xs" borderRadius="full" px={3} py={1}>
          Action required
        </Badge>

        <Heading fontSize="lg" fontWeight="bold" mb={1}>{lender}</Heading>
        <HStack
          display="inline-flex"
          bg={`${config.accentLightColor}80`}
          borderRadius="full"
          px={{ base: 2, md: 3 }}
          py={{ base: 0.5, md: 1 }}
          mb={{ base: 2, md: 4 }}
          border="1px solid"
          borderColor={`${config.accentColor}40`}
          boxShadow="0px 1px 3px rgba(0,0,0,0.05)"
          _hover={{ transform: "translateY(-1px)", boxShadow: "0px 3px 6px rgba(0,0,0,0.1)" }}
          transition="all 0.2s"
          spacing={{ base: 1, md: 2 }}
          maxW="100%"
        >
          <Circle
            size={{ base: "14px", md: "18px" }}
            bg={config.accentColor}
            color="white"
            minW="unset"
          >
            <Text fontSize={{ base: "8px", md: "10px" }} fontWeight="bold">!</Text>
          </Circle>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            fontFamily="Poppins"
            fontWeight="semibold"
            color={config.accentColor}
            ml={{ base: 0.5, md: 1 }}
            noOfLines={1}
            maxW={{ base: "110px", md: "none" }}
          >
            {stage}
          </Text>
        </HStack>

        <ClaimProgress currentStep={1}/>
        <Box h={4} />

        <VStack spacing={6} align="stretch" mt={4}>

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
            <Button w="full" color="black" _hover={{ bg: `${config.primaryColor}80` }} borderRadius="full" gap={1} height="48px" fontFamily="Poppins" onClick={handleProvideDetails}>
              Provide Details
              <ArrowRightIcon width={14} height={14} strokeWidth={3} />
            </Button>
          </Box>

          <Box>
            <HStack mb={3}>
              <Circle size="24px" bg={config.accentLightColor} color={config.accentColor}>
                <ExclamationCircleIcon width={14} height={14} strokeWidth={2} />
              </Circle>
              <Box>
                <Text fontWeight="bold" fontSize="sm">Additional information required</Text>
                <Text fontSize="sm">Please provide the requested details</Text>
              </Box>
            </HStack>
            <Button
              w="full"
              color="black"
              _hover={{ bg: `${config.primaryColor}80` }}
              borderRadius="full"
              gap={1}
              height="48px"
              fontFamily="Poppins"
              onClick={handleProvideAdditionalInfo}
            >
              Urgent Requirements
              <ArrowRightIcon width={14} height={14} strokeWidth={3} />
            </Button>
          </Box>
        </VStack>
      </Box>

      <AgreementDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        claimId={id}
      />
      
      <AdditionalInfoModal
        isOpen={isAdditionalInfoModalOpen}
        onClose={() => setIsAdditionalInfoModalOpen(false)}
        claimId={id}
      />
    </>
  );
};

export default ClaimCard;
export { ClaimCard }; 