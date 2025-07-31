import { VStack, Heading, Text, Button, Image, SimpleGrid, Box, Icon, HStack, Input } from '@chakra-ui/react';
import { IdentificationIcon, InformationCircleIcon, LockClosedIcon,  ShieldCheckIcon } from '@heroicons/react/24/outline';
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
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleContinue = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    console.log("Uploading file:", selectedFile.name);

    try {
      const res = await uploadIdDocument(selectedFile);
      console.log("Upload Success:", res);
      setUploadSuccess('Document uploaded successfully!');
      // You could also store res.document_id or res.id_document_url in state or context
    } catch (err: any) {
      console.error("Upload Error:", err);
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };


  return (
    <Box minH="100vh" bg="white">
      <Header />
      <VStack spacing={6} align="center" px={4} py={4} maxW="container.sm" mx="auto">
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
            >
              Change file
            </Button>
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
          color="black"
          size="lg"
          height="50px"
          w="full"
          fontFamily="Poppins"
          borderRadius="full"
          _hover={{ bg: `${config.primaryColor}CC` }}
          onClick={handleContinue}
          isLoading={uploading}
          loadingText="Uploading..."
          disabled={uploading}
        >
          Continue
          <Icon as={ArrowRightIcon} w={5} h={5} ml={2} />
        </Button>

        {/* Claim Amount */}
        <HStack spacing={2}>
          <Box
            w={8}
            h={8}
            borderRadius="full"
            bg="#5B34C8"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize="sm"
            flexShrink={0}
          >
            <Box 
              as="svg" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              w="16px" 
              h="16px"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </Box>
          </Box>

          <Text fontFamily="Poppins" fontWeight="semibold">
            Claim up to £2,976.30* per agreement
          </Text>
        </HStack>

        {/* Trustpilot Image */}
        <Image src="/icons/trustpilot.svg" alt="Trustpilot rating" h="8" />

        {/* Security Features */}
        <SimpleGrid columns={3} spacing={8} w="full">
          {[
            { icon: ShieldCheckIcon, title: 'Secure Upload', subtitle: 'Your files are safe' },
            { icon: LockClosedIcon, title: 'SSL Encrypted', subtitle: 'Protected connection' },
            { icon: ShieldCheckIcon, title: 'Data Protected', subtitle: 'Privacy ensured' }
          ].map((feature, index) => (
            <VStack key={index}>
              <Box
                w={8}
                h={8}
                borderRadius="full"
                bg="#F3F0FA"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={feature.icon} w={4} h={4} color="#6A47CF" />
              </Box>
              <Text fontSize="sm" fontWeight="bold" textAlign="center">{feature.title}</Text>
              <Text fontSize="xs" color="gray.600" textAlign="center">{feature.subtitle}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default DocumentUpload;
