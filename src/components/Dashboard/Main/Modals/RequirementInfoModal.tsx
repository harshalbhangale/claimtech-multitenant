import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  useToast,
  Spinner,
  Center,
  Input,
  FormControl,
  FormLabel,
  Circle,
} from '@chakra-ui/react';
import { DocumentIcon, CloudArrowUpIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

import { useTenant } from '../../../../contexts/TenantContext';
import { fetchRequirements, uploadRequirementDocument, type Requirement } from '../../../../api/services/dashboard/additionalRequirement';

interface AdditionalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string;
}

const AdditionalInfoModal: React.FC<AdditionalInfoModalProps> = ({
  isOpen,
  onClose,
  claimId,
}) => {
  const { config } = useTenant();
  const toast = useToast();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && claimId) {
      handleFetchRequirements();
    }
  }, [isOpen, claimId]);

  const handleFetchRequirements = async () => {
    setLoading(true);
    try {
      const data = await fetchRequirements(claimId);
      setRequirements(data);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch requirements',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (requirementId: string, file: File) => {
    setUploadingFiles(prev => new Set(prev).add(requirementId));
    
    try {
      await uploadRequirementDocument(claimId, requirementId, file);
      
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh requirements
      await handleFetchRequirements();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(requirementId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFF3CD', color: '#856404', borderColor: '#FFEAA7' };
      case 'submitted':
        return { bg: '#D1ECF1', color: '#0C5460', borderColor: '#BEE5EB' };
      case 'approved':
        return { bg: '#D4EDDA', color: '#155724', borderColor: '#C3E6CB' };
      case 'rejected':
        return { bg: '#F8D7DA', color: '#721C24', borderColor: '#F5C6CB' };
      default:
        return { bg: '#E2E3E5', color: '#383D41', borderColor: '#D6D8DB' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ExclamationCircleIcon width={16} height={16} />;
      case 'submitted':
        return <CloudArrowUpIcon width={16} height={16} />;
      case 'approved':
        return <CheckCircleIcon width={16} height={16} />;
      case 'rejected':
        return <ExclamationCircleIcon width={16} height={16} />;
      default:
        return <DocumentIcon width={16} height={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={{ base: "full", md: "xl" }} 
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        borderRadius={{ base: "none", md: "2xl" }}
        boxShadow="2xl"
        border="1px solid"
        borderColor="gray.100"
        maxH={{ base: "100vh", md: "80vh" }}
        m={{ base: 0, md: 4 }}
      >
        <Box bg={config.accentLightColor} p={6} borderTopRadius="2xl">
          <ModalHeader p={0} fontSize="2xl" fontFamily="Poppins" fontWeight="bold">
            Additional Information Required
          </ModalHeader>
          <Text color="gray.600" mt={1}>Please provide the requested documents and information</Text>
        </Box>
        <ModalCloseButton top={6} right={6}
          _hover={{ bg: 'gray.100' }}
        />
        
        <ModalBody p={{ base: 4, md: 6 }}>
          {loading ? (
            <Center py={10}>
              <VStack spacing={4}>
                <Spinner size="lg" color={config.primaryColor} thickness="3px" />
                <Text color="gray.600">Loading requirements...</Text>
              </VStack>
            </Center>
          ) : requirements.length === 0 ? (
            <Center py={10}>
              <VStack spacing={4}>
                <Circle size="60px" bg="gray.100" color="gray.400">
                  <DocumentIcon width={24} height={24} />
                </Circle>
                <Text color="gray.600" textAlign="center">
                  No additional requirements found for this claim.
                </Text>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {requirements
                // Completely filter out signature requirements - they should never appear in document upload modal
                .filter((requirement) => requirement.requirement_type !== 'signature')
                .map((requirement, index) => {
                const statusStyle = getStatusColor(requirement.status);
                const isUploading = uploadingFiles.has(requirement.id);
                const isNewRequirement = requirement.status === 'pending' && !requirement.document;
                
                return (
                  <Box
                    key={requirement.id}
                    p={{ base: 4, md: 5 }}
                    borderRadius={{ base: "lg", md: "xl" }}
                    border="2px solid"
                    borderColor={isNewRequirement ? config.accentColor : 'gray.200'}
                    bg={isNewRequirement ? `${config.accentLightColor}20` : 'white'}
                    position="relative"
                    _hover={{
                      transform: { base: 'none', md: 'translateY(-2px)' },
                      boxShadow: 'lg',
                      borderColor: isNewRequirement ? config.accentColor : config.accentColor,
                    }}
                    transition="all 0.3s ease"
                  >
                    {isNewRequirement && (
                      <Badge
                        position="absolute"
                        top="-8px"
                        right="12px"
                        bg={config.accentColor}
                        color="white"
                        fontSize="xs"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                      >
                        New Request
                      </Badge>
                    )}
                    
                    <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                      <VStack align="stretch" spacing={2}>
                        <HStack 
                          justify="space-between" 
                          align={{ base: "start", md: "center" }}
                          flexWrap={{ base: "wrap", md: "nowrap" }}
                          spacing={{ base: 2, md: 3 }}
                        >
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" fontWeight="medium">
                            Requirement #{index + 1}
                          </Text>
                          <Badge
                            bg={statusStyle.bg}
                            color={statusStyle.color}
                            borderRadius="full"
                            px={{ base: 2, md: 3 }}
                            py={1}
                            fontSize="xs"
                            fontWeight="semibold"
                            border="1px solid"
                            borderColor={statusStyle.borderColor}
                            flexShrink={0}
                          >
                            <HStack spacing={1}>
                              {getStatusIcon(requirement.status)}
                              <Text textTransform="capitalize">{requirement.status}</Text>
                            </HStack>
                          </Badge>
                        </HStack>
                        
                        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.800" lineHeight="1.4">
                          {requirement.requirement_reason}
                        </Text>
                        
                        <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
                          Requested on {formatDate(requirement.created_at)}
                        </Text>
                      </VStack>
                      
                      {requirement.rejected_reason && (
                        <Box
                          p={{ base: 3, md: 3 }}
                          bg="red.50"
                          borderRadius={{ base: "md", md: "lg" }}
                          border="1px solid"
                          borderColor="red.200"
                        >
                          <HStack spacing={2} align="start">
                            <ExclamationCircleIcon width={16} height={16} color="#E53E3E" />
                            <Text fontSize={{ base: "xs", md: "sm" }} color="red.600" fontWeight="medium">
                              Rejection Reason:
                            </Text>
                          </HStack>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="red.700" mt={1} lineHeight="1.4">
                            {requirement.rejected_reason}
                          </Text>
                        </Box>
                      )}
                      
                      {requirement.document && (
                        <Box
                          p={{ base: 3, md: 3 }}
                          bg="green.50"
                          borderRadius={{ base: "md", md: "lg" }}
                          border="1px solid"
                          borderColor="green.200"
                        >
                          <HStack spacing={2} align="start">
                            <CheckCircleIcon width={16} height={16} color="#38A169" />
                            <Text fontSize={{ base: "xs", md: "sm" }} color="green.600" fontWeight="medium">
                              Document Uploaded
                            </Text>
                          </HStack>
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="green.700" mt={1}>
                            Last updated: {formatDate(requirement.updated_at)}
                          </Text>
                        </Box>
                      )}
                      
                      {(requirement.status === 'pending' || requirement.status === 'rejected') && (
                        <Box>
                          <FormControl>
                            <FormLabel fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="gray.700" mb={3}>
                              Upload Document
                            </FormLabel>
                            <Box
                              position="relative"
                              border="2px dashed"
                              borderColor={isUploading ? "gray.300" : config.accentColor}
                              borderRadius="xl"
                              p={6}
                              bg={isUploading ? "gray.50" : "white"}
                              _hover={{ 
                                borderColor: isUploading ? "gray.300" : "gray.300",
                                bg: isUploading ? "gray.50" : "gray.50"
                              }}
                              transition="all 0.3s ease"
                              cursor={isUploading ? "not-allowed" : "pointer"}
                            >
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(requirement.id, file);
                                  }
                                }}
                                disabled={isUploading}
                                position="absolute"
                                top={0}
                                left={0}
                                width="100%"
                                height="100%"
                                opacity={0}
                                cursor={isUploading ? "not-allowed" : "pointer"}
                              />
                              {isUploading ? (
                                <VStack spacing={3}>
                                  <Spinner size="lg" color={config.primaryColor} />
                                  <VStack spacing={1}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                      Uploading document...
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Please wait while we process your file
                                    </Text>
                                  </VStack>
                                </VStack>
                              ) : (
                                <VStack spacing={3}>
                                  <Circle 
                                    size="48px" 
                                    bg={`${config.accentColor}20`} 
                                    color={config.accentColor}
                                  >
                                    <CloudArrowUpIcon width={24} height={24} />
                                  </Circle>
                                  <VStack spacing={1}>
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                      Drop your file here or click to browse
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                                    </Text>
                                  </VStack>
                                </VStack>
                              )}
                            </Box>
                          </FormControl>
                        </Box>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          )}
          
          <Divider my={{ base: 4, md: 6 }} />

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdditionalInfoModal;