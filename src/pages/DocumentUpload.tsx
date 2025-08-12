import { VStack, Heading, Text, Button, Image, SimpleGrid, Box, Icon, HStack, Input, Container } from '@chakra-ui/react';
import { IdentificationIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import { DocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

import { Header } from '@/components/Dashboard/Main/Header';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { uploadIdDocument } from '../api/services/dashboard/documentupload';
import { useTenant }from '../contexts/TenantContext';
const DocumentUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const { config } = useTenant();
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Reset upload states when new file is selected
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    
    try {
      const res = await uploadIdDocument(selectedFile);
      console.log("Upload Success:", res);
      setUploadSuccess('Document uploaded successfully!');
    } catch (err: any) {
      console.error("Upload Error:", err);
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  const handleContinue = () => {
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };


  return (
    <Box minH="100vh" bg="white">
      <Header />
      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
        <VStack spacing={6} align="center" w="full">
        {/* Header with Icon */}
        <Box position="relative" display="inline-block">
          <Icon
            as={IdentificationIcon}
            w={8}
            h={8}
            bg="#B8FF8D"
            borderRadius="full"
            p={1.5}
          />
        </Box>

        {/* Title */}
        <Heading
          as="h1"
          size="md"
          textAlign="center"
          fontFamily="Poppins"
          fontWeight="bold"
        >
          Upload your ID to release documents
        </Heading>

        {/* Accepted IDs Info */}
        <Box
          bg="#F4F0FF"
          w="full"
          p={2}
          borderRadius="md"
          border="1px solid #DED6F5"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Icon as={InformationCircleIcon} w={5} h={5} />
          <Text fontFamily="Poppins" fontWeight="semibold" color="#1A1A1A" >
            Accepted IDs: Passport or Driving Licence
          </Text>
        </Box>

        {/* Requirements List */}
        <VStack align="start" w="full" spacing={1}>
          <Text fontFamily="Poppins" fontWeight="medium">
            Make sure that:
          </Text>
          <VStack align="start" spacing={1} w="full">
            {[
              'Your ID is not expired',
              'All 4 corners are visible',
              'Its clear and not blurry',
              'Its not covered by anything'
            ].map((requirement, index) => (
              <HStack key={index}>
                <Box position="relative" width={5} height={5}>
                  <Box as="svg" width="100%" height="100%" viewBox="0 0 20 20" fill="#B8FF8D">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </Box>
                  <Box as="svg" width="80%" height="80%" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', top: '10%', left: '10%' }}>
                    <path d="M9 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L9 10.586z" fill="black" />
                  </Box>
                </Box>
                <Text fontFamily="Poppins">{requirement}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>

        {/* ID Examples Grid */}
        <SimpleGrid columns={2} spacing={4} w="60%">
          {[
            { src: '/IDCheck/incorrectb.png', alt: 'Incorrect ID 1', isCorrect: false },
            { src: '/IDCheck/incorrecta.png', alt: 'Incorrect ID 2', isCorrect: false },
            { src: '/IDCheck/incorrectc.png', alt: 'Incorrect ID 3', isCorrect: false },
            { src: '/IDCheck/correct.png', alt: 'Correct ID', isCorrect: true }
          ].map((image, index) => (
            <Box
              key={index}
              borderRadius="xl"
              overflow="hidden"
              position="relative"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="sm"
            >
              <Image src={image.src} alt={image.alt} w="full" h="auto" />
            </Box>
          ))}
        </SimpleGrid>
        
        {/* File Upload Button */}
        <Input
          type="file"
          accept="image/*,.pdf"
          display="none"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        {/* Selected File Preview */}
        {selectedFile ? (
          <VStack spacing={4} align="stretch" w="full">
            <HStack 
              p={4} 
              bg="gray.50" 
              borderRadius="lg" 
              border="1px dashed" 
              borderColor="gray.200"
            >
              <Icon as={DocumentIcon} w={5} h={5} color="gray.500" />
              <Text fontSize="sm" color="gray.700" fontFamily="Poppins">
                {selectedFile.name}
              </Text>
              <Text fontSize="sm" color="gray.500" ml="auto">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </HStack>
            
            {uploadSuccess && (
              <HStack 
                p={4} 
                bg="#E6F6EC" 
                borderRadius="lg" 
                border="1px solid" 
                borderColor="#C3E6D1"
              >
                <Icon as={CheckIcon} w={5} h={5} color="green.500" />
                <Text fontSize="sm" color="green.700" fontFamily="Poppins" fontWeight="medium">
                  {uploadSuccess}
                </Text>
              </HStack>
            )}
            
            {uploadError && (
              <HStack 
                p={4} 
                bg="#FEE2E2" 
                borderRadius="lg" 
                border="1px solid" 
                borderColor="#FCA5A5"
              >
                <Box as="svg" width="20px" height="20px" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill="#DC2626"/>
                </Box>
                <Text fontSize="sm" color="red.700" fontFamily="Poppins" fontWeight="medium">
                  {uploadError}
                </Text>
              </HStack>
            )}
            
            {/* Change file and Upload Document buttons side by side */}
            <HStack spacing={4} w="full">
              <Button
                variant="outline"
                borderColor="#6A47CF"
                color="gray.800"
                size="md"
                fontWeight="xs"
                height="40px"
                fontFamily="Poppins"
                fontSize="sm"
                borderRadius="full"
                _hover={{ bg: '#F3F0FA' }}
                onClick={handleFileButtonClick}
                flex="1"
              >
                Change file
              </Button>
              {!uploadSuccess && (
                <Button
                  bg={config.accentColor}
                  color="white"
                  size="md"
                  height="40px"
                  fontFamily="Poppins"
                  borderRadius="full"
                  _hover={{ bg: `${config.accentColor}CC` }}
                  onClick={handleUpload}
                  isLoading={uploading}
                  loadingText="Uploading..."
                  disabled={uploading}
                  fontSize="sm"
                  fontWeight="xs"
                  flex="1"
                >
                  Upload Document
                </Button>
              )}
            </HStack>
          </VStack>
        ) : (
          <Button
            variant="outline"
            borderColor="#6A47CF"
            color="gray.800"
            size="md"
            fontWeight="xs"
            height="40px"
            maxW="380px"
            fontFamily="Poppins"
            fontSize="sm"
            borderRadius="full"
            _hover={{ bg: '#F3F0FA' }}
            alignSelf="flex-start"
            mb={4}
            onClick={handleFileButtonClick}
            isTruncated
          >
            Select file
          </Button>
        )}

        {/* Continue Button */}
        <Button
          bg={config.primaryColor}
          size="lg"
          height="50px"
          w="full"
          fontFamily="Poppins"
          borderRadius="full"
          _hover={{ bg: `${config.primaryColor}CC` }}
          onClick={handleContinue}
          disabled={!uploadSuccess}
        >
          Continue
          <Icon as={ArrowRightIcon} w={5} h={5} ml={2} />
        </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default DocumentUpload;
