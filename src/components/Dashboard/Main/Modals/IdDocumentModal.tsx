import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Icon,
  SimpleGrid,
  Image,
  useToast,
  Circle,
} from '@chakra-ui/react';
import { DocumentIcon, CheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useTenant } from '../../../../contexts/TenantContext';

export interface IdDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementReason?: string;
  claimId?: string;
  requirementId?: string;
  title?: string;
  onSubmit?: (payload: { requirementId: string; file: File }) => Promise<void> | void;
}

const IdDocumentModal: React.FC<IdDocumentModalProps> = ({
  isOpen,
  onClose,
  requirementReason,
  claimId: _claimId, // eslint-disable-line @typescript-eslint/no-unused-vars
  requirementId,
  title = "Upload Document",
  onSubmit,
}) => {
  const { config } = useTenant();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!requirementId || !selectedFile) return;
    try {
      setSubmitting(true);
      await onSubmit?.({ requirementId, file: selectedFile });
      
      toast({
        title: "Success!",
        description: "Your document has been uploaded successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error: unknown) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }} motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl" mx={4} overflow="hidden" boxShadow="0 10px 30px rgba(0, 0, 0, 0.1)">
        {/* Simple header */}
        <Box bg={config.accentLightColor} p={4} borderTopRadius="xl">
          <ModalHeader p={0} fontSize="lg" fontFamily="Poppins" fontWeight="bold" color={config.accentColor}>
            {title}
          </ModalHeader>
          <Text color="gray.600" mt={1} fontSize="sm">
            Upload a clear, valid document to complete this requirement
          </Text>
        </Box>
        
        <ModalCloseButton 
          top={4} 
          right={4} 
          size="md"
          borderRadius="full"
          bg="white"
          _hover={{ bg: "gray.100" }}
        />
        
        <ModalBody p={4}>
          {requirementReason && (
            <Box 
              bg="blue.50" 
              border="1px solid" 
              borderColor="blue.200" 
              borderRadius="lg" 
              p={3} 
              mb={4}
            >
              <Text fontSize="sm" color="blue.700" fontFamily="Poppins">
                {requirementReason}
              </Text>
            </Box>
          )}

          <VStack spacing={4} align="stretch">
            {/* Info Box */}
            <Box
              bg={config.accentLightColor}
              p={3}
              borderRadius="lg"
              border="1px solid"
              borderColor={`${config.accentColor}30`}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={InformationCircleIcon} w={4} h={4} color={config.accentColor} />
              <Text fontFamily="Poppins" fontWeight="medium" color="gray.700" fontSize="sm">
                Accepted formats: Passport, Driving Licence, or any document
              </Text>
            </Box>

            {/* Requirements List and Examples - Side by Side */}
            <HStack align="start" spacing={3} w="full">
              {/* Requirements List */}
              <Box flex="1">
                <Text fontFamily="Poppins" fontWeight="medium" mb={2} color="gray.700" fontSize="sm">
                  Make sure that:
                </Text>
                <VStack align="start" spacing={2} w="full">
                  {[
                    'Your document is not expired',
                    'All 4 corners are visible',
                    'It\'s clear and not blurry',
                    'It\'s not covered by anything'
                  ].map((requirement, index) => (
                    <HStack key={index} spacing={2}>
                      <Circle size="16px" bg="green.100" color="green.600">
                        <Icon as={CheckIcon} w={3} h={3} />
                      </Circle>
                      <Text fontFamily="Poppins" fontSize="sm" color="gray.700">
                        {requirement}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* ID Examples Grid */}
              <Box flex="1">
                <Text fontFamily="Poppins" fontWeight="medium" mb={2} color="gray.700" fontSize="sm">
                  Examples:
                </Text>
                <SimpleGrid columns={2} spacing={2} w="full">
                  {[
                    { src: '/IDCheck/incorrectb.png', alt: 'Incorrect ID 1', isCorrect: false },
                    { src: '/IDCheck/incorrecta.png', alt: 'Incorrect ID 2', isCorrect: false },
                    { src: '/IDCheck/incorrectc.png', alt: 'Incorrect ID 3', isCorrect: false },
                    { src: '/IDCheck/correct.png', alt: 'Correct ID', isCorrect: true }
                  ].map((image, index) => (
                    <Box
                      key={index}
                      borderRadius="md"
                      overflow="hidden"
                      position="relative"
                      border="1px solid"
                      borderColor={image.isCorrect ? "green.200" : "gray.200"}
                      boxShadow="sm"
                      maxW="120px"
                      mx="auto"
                    >
                      <Image 
                        src={image.src} 
                        alt={image.alt} 
                        w="100%" 
                        h="80px" 
                        objectFit="cover" 
                      />
                      {image.isCorrect && (
                        <Box
                          position="absolute"
                          top={1}
                          right={1}
                          bg="green.500"
                          color="white"
                          borderRadius="full"
                          px={1.5}
                          py={0.5}
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          ✓
                        </Box>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </HStack>
            
            {/* File Upload Button - Bigger */}
            <Box>
              <Text fontFamily="Poppins" fontWeight="medium" mb={3} color="gray.700" fontSize="sm">
                Upload Document
              </Text>
              <Input
                type="file"
                accept="image/*,.pdf"
                display="none"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              <Button
                onClick={handleFileButtonClick}
                variant="outline"
                size="lg"
                w="full"
                h="120px"
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="lg"
                bg="gray.50"
                _hover={{ bg: "gray.100", borderColor: "gray.400" }}
                display="flex"
                flexDirection="column"
                gap={3}
              >
                <Icon as={DocumentIcon} w={8} h={8} color="gray.500" />
                <Text fontFamily="Poppins" color="gray.600" fontSize="md">
                  {selectedFile ? selectedFile.name : "Click to upload document"}
                </Text>
              </Button>
            </Box>

            {/* Selected File Preview */}
            {selectedFile && (
              <Box
                border="1px solid"
                borderColor="green.200"
                bg="green.50"
                borderRadius="lg"
                p={3}
              >
                <Text fontSize="sm" fontWeight="medium" color="green.700" mb={2} fontFamily="Poppins">
                  Selected Document:
                </Text>
                <Box
                  bg="white"
                  borderRadius="md"
                  p={2}
                  border="1px solid"
                  borderColor="green.200"
                >
                  <HStack spacing={2}>
                    <Icon as={CheckIcon} w={4} h={4} color="green.600" />
                    <Text fontSize="sm" color="gray.800" fontFamily="Poppins" fontWeight="medium">
                      {selectedFile.name}
                    </Text>
                  </HStack>
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>
        
        {/* Simple footer */}
        <ModalFooter 
          borderTopWidth="1px" 
          borderColor="gray.200" 
          p={4}
          gap={3}
        >
          <Button 
            variant="outline" 
            onClick={onClose} 
            size="md"
            borderRadius="lg"
            fontFamily="Poppins"
          >
            Cancel
          </Button>
          <Button
            bg={config.primaryColor}
            color="black"
            _hover={{ bg: `${config.primaryColor}CC` }}
            onClick={handleSubmit}
            isLoading={submitting}
            loadingText="Uploading..."
            isDisabled={!selectedFile}
            fontFamily="Poppins"
            borderRadius="lg"
            size="md"
            rightIcon={!submitting ? <Icon as={CheckIcon} w={4} h={4} /> : undefined}
          >
            Upload Document
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IdDocumentModal;
