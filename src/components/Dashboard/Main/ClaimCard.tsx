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
import AdditionalInfoModal from './Modals/RequirementInfoModal';
import SignatureModal from './Modals/SignatureModal';
import { useRequirements } from '../../../hooks/queries/useRequirements';

interface ClaimCardProps {
  lender: string;
  stage: string;
  progress: number;
  onUploadId(): void;
  onProvideDetails(): void;
  id: string;
  hasAdditionalRequirements?: boolean;
  agreements?: any[];
  agreementsLoading?: boolean;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ 
  lender, 
  stage,  
  onProvideDetails, 
  id, 
  hasAdditionalRequirements = false, // Default to false
  agreements = [],
  agreementsLoading = false
}) => {
  const { config } = useTenant();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [selectedSignatureRequirement, setSelectedSignatureRequirement] = useState<any>(null);

  // Fetch requirements to determine button visibility
  const { data: requirements = [] } = useRequirements(id);

  // Separate requirements by type - include 'rejected' status for retry scenarios
  const documentRequirements = requirements.filter(req => 
    (req.status === 'pending' || req.status === 'rejected') && 
    (req.requirement_type === 'document' || req.requirement_type === 'information' || req.requirement_type === undefined)
  );
  const signatureRequirements = requirements.filter(req => 
    (req.status === 'pending' || req.status === 'rejected') && 
    req.requirement_type === 'signature'
  );

  const hasDocumentRequirements = documentRequirements.length > 0;
  const hasSignatureRequirements = signatureRequirements.length > 0;

  const handleProvideDetails = () => {
    setIsModalOpen(true);
    onProvideDetails();
  };

  const handleProvideAdditionalInfo = () => {
    setIsAdditionalInfoModalOpen(true);
  };

  const handleSignatureRequired = () => {
    // Get the first pending signature requirement
    const signatureReq = signatureRequirements[0];
    if (signatureReq) {
      setSelectedSignatureRequirement(signatureReq);
      setIsSignatureModalOpen(true);
    }
  };

  const handleSignatureSuccess = () => {
    // Clear selected requirement - cache will be automatically invalidated by mutations
    setSelectedSignatureRequirement(null);
    setIsSignatureModalOpen(false);
  };

  return (
    <>
      <Box border="1.5px solid #E2E8F0" borderRadius="lg" p={5} position="relative">
        {(hasAdditionalRequirements || hasDocumentRequirements || hasSignatureRequirements) && (
          <Badge position="absolute" top="-10px" right="12px" bg="#FF004D" color="white" fontSize="xs" borderRadius="full" px={3} py={1}>
            Action required
          </Badge>
        )}
        <HStack w="100%" justify="space-between" align="center" mb={4}>
          <Heading fontSize="lg" fontWeight="bold">{lender}</Heading>
          <HStack
            display="inline-flex"
            bg={`${config.accentLightColor}80`}
            borderRadius="full"
            px={{ base: 2, md: 3 }}
            py={{ base: 0.5, md: 1 }}
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
        </HStack>

        <ClaimProgress currentStep={1}/>
         <Box h={4} />

         {/* Agreement Cards */}
         {agreementsLoading ? (
           <VStack spacing={2} align="stretch">
             <Box h="40px" bg="gray.100" borderRadius="md" />
             <Box h="40px" bg="gray.100" borderRadius="md" />
           </VStack>
         ) : agreements && agreements.length > 0 ? (
           <VStack spacing={2} align="stretch">
             {agreements.map((agreement) => (
               <Box
                 key={agreement.id}
                 bg={`${config.accentLightColor}30`}
                 border="1px solid"
                 borderColor={`${config.accentColor}15`}
                 borderRadius="md"
                 p={3}
                 _hover={{ bg: `${config.accentLightColor}50`, transform: "translateY(-1px)" }}
                 transition="all 0.2s"
               >
                 <HStack justify="space-between" align="start">
                   <VStack align="start" spacing={0}>
                     <Text fontSize="sm" fontWeight="bold" color={config.accentColor}>
                       #{agreement.agreement_number}
                     </Text>
                     <Text fontSize="xs" color="gray.600">
                       <Text as="span" fontWeight="medium">Reg:</Text> {agreement.vehicle_registration || '-'}
                     </Text>
                   </VStack>
                   <Text fontSize="xs" color="gray.500">
                     <Text as="span" fontWeight="medium">Started at:</Text> {agreement.start_date ? new Date(agreement.start_date).toLocaleDateString() : '-'}
                   </Text>
                 </HStack>
               </Box>
             ))}
           </VStack>
         ) : (
           <Box
             bg="gray.50"
             border="1px dashed"
             borderColor="gray.300"
             borderRadius="md"
             p={3}
             textAlign="center"
           >
             <Text fontSize="xs" color="gray.500" fontStyle="italic">
               No agreements available
             </Text>
           </Box>
         )}

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
                Add Agreement Details
                <ArrowRightIcon width={14} height={14} strokeWidth={3} />
              </Button>
            </Box>

            {/* Document Upload Requirements - Show when staff requests document upload */}
            {(hasAdditionalRequirements || hasDocumentRequirements) && (
            <Box>
              <HStack mb={3}>
                <Circle size="24px" bg={config.accentLightColor} color={config.accentColor}>
                  <ExclamationCircleIcon width={14} height={14} strokeWidth={2} />
                </Circle>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">Additional documents required</Text>
                  <Text fontSize="sm">Please upload the requested documents</Text>
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
                Upload Documents
                <ArrowRightIcon width={14} height={14} strokeWidth={3} />
              </Button>
            </Box>
            )}

            {/* Signature Requirements - Only show when staff requests signature */}
            {hasSignatureRequirements && (
            <Box>
              <HStack mb={3}>
                <Circle size="24px" bg={config.accentLightColor} color={config.accentColor}>
                  <ExclamationCircleIcon width={14} height={14} strokeWidth={2} />
                </Circle>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">Digital signature required</Text>
                  <Text fontSize="sm">Please provide your digital signature</Text>
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
                onClick={handleSignatureRequired}
              >
                Update Signature
                <ArrowRightIcon width={14} height={14} strokeWidth={3} />
              </Button>
            </Box>
            )}
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

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        requirementReason={selectedSignatureRequirement?.requirement_reason || 'Digital signature required'}
        onSuccess={handleSignatureSuccess}
        mode="dashboard"
        claimId={id}
        requirementId={selectedSignatureRequirement?.id}
      />
    </>
  );
};

export default ClaimCard;
export { ClaimCard }; 