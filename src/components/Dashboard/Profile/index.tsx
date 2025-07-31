import { Box, VStack, Text, HStack, Button, Input, SimpleGrid, Icon, Radio, RadioGroup, useToast} from '@chakra-ui/react';
import { DocumentCheckIcon, GiftIcon, ArrowRightOnRectangleIcon, ChevronRightIcon, CheckIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { useTenant } from '../../../contexts/TenantContext';

const Profile = () => {
  const { config } = useTenant();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading] = useState(false);
  const toast = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG or PDF file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedFile(file);
  };


  return (
    <Box p={8} maxW="2xl" mx="auto">
      {/* Account Details Section */}
      <Text color="gray.500" mb={2} fontSize="sm" fontWeight="medium">
        Account details
      </Text>
      <Text fontSize="2xl" fontWeight="bold" mb={8} fontFamily="Poppins">
        Fdghj Fghjk
      </Text>

      {/* Quick Actions */}
      <VStack spacing={4} mb={10} align="stretch">
        {[
          { icon: DocumentCheckIcon, text: 'Open Claim', count: '1', link: '/dashboard' },
          { icon: GiftIcon, text: 'Refer a Friend', link: '/dashboard/refer' },
          { icon: ArrowRightOnRectangleIcon, text: 'Log out', link: 'https://www.resolvemyclaim.co.uk/' }
        ].map((action, index) => (
          <Box
            key={index}
            as="button"
            bg="white"
            p={5}
            borderRadius="xl"
            boxShadow="sm"
            border="1.5px solid"
            borderColor="gray.100"
            _hover={{ bg: 'gray.50', borderColor: 'gray.200' }}
            w="full"
            transition="all 0.2s"
            onClick={() => {
              if (action.text === 'Open Claim' || action.text === 'Refer a Friend') {
                window.location.href = action.link;
              } else if (action.text === 'Log out') {
                window.location.href = action.link;
              }
            }}
          >
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <Box
                  w={12}
                  h={12}
                  borderRadius="full"
                  bg={config.accentLightColor}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid"
                  borderColor={config.accentLightColor}
                >
                  <Icon as={action.icon} w={6} h={6} color={config.accentColor} />
                </Box>
                <Text fontFamily="Poppins" fontSize="lg" fontWeight="medium">
                  {action.text}
                  {action.count && (
                    <Box as="span" ml={3} color={config.accentColor} fontWeight="semibold">
                      {action.count}
                    </Box>
                  )}
                </Text>
              </HStack>
              <Icon as={ChevronRightIcon} w={6} h={6} color="gray.400" />
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Your Details Section */}
      <HStack justify="space-between" align="center" mb={6}>
        <Text color={config.accentColor} fontSize="md" fontWeight="bold">
          Your details
        </Text>
        <Button
          variant="outline"
          size="sm"
          borderRadius="full"
          borderColor={config.accentColor}
          color={config.accentColor}
          fontWeight="medium"
          px={6}
          _hover={{ bg: config.accentLightColor }}
        >
          Edit Profile
        </Button>
      </HStack>

      {/* Contact Details */}
      <VStack spacing={4} mb={10} align="stretch">
        <Input
          value="ejghajk@gma.com"
          isReadOnly
          bg="white"
          borderRadius="lg"
          fontSize="md"
          fontFamily="Poppins"
          size="lg"
          border="1.5px solid"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
        />
        <Input
          value="07738585850"
          isReadOnly
          bg="white"
          borderRadius="lg"
          fontSize="md"
          fontFamily="Poppins"
          size="lg"
          border="1.5px solid"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
        />
        <Input
          value="Address Line 1"
          isReadOnly
          bg="white"
          borderRadius="lg"
          fontSize="md"
          color="gray.400"
          fontFamily="Poppins"
          size="lg"
          border="1.5px solid"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
        />
        <Input
          value="4, New Cathedral St"
          isReadOnly
          bg="white"
          borderRadius="lg"
          fontSize="md"
          fontFamily="Poppins"
          size="lg"
          border="1.5px solid"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
        />
        <Input
          value="M1 1AD"
          isReadOnly
          bg="white"
          borderRadius="lg"
          fontSize="md"
          fontFamily="Poppins"
          size="lg"
          border="1.5px solid"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
        />
        <SimpleGrid columns={3} spacing={4}>
          {['21', '01', '2001'].map((value, index) => (
            <Input
              key={index}
              value={value}
              isReadOnly
              bg="white"
              borderRadius="lg"
              fontSize="md"
              fontFamily="Poppins"
              size="lg"
              border="1.5px solid"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.300' }}
            />
          ))}
        </SimpleGrid>
      </VStack>

      {/* Account Settings */}
      <Text color="gray.500" fontSize="sm" fontWeight="medium" mb={4}>
        Account settings
      </Text>

      {/* Notifications */}
      <Box 
        bg="white" 
        p={6} 
        borderRadius="xl" 
        mb={6} 
        border="1.5px solid"
        borderColor="gray.100"
        boxShadow="sm"
      >
        <Text fontWeight="bold" mb={6} fontFamily="Poppins" fontSize="lg">
          Notifications
        </Text>
        <VStack spacing={5} align="stretch">
          {[
            { label: 'Email', name: 'email' },
            { label: 'WhatsApp', name: 'whatsapp' },
            { label: 'SMS', name: 'sms' }
          ].map((notification, index) => (
            <HStack key={index} justify="space-between" py={1}>
              <Text fontFamily="Poppins" fontSize="md">{notification.label}</Text>
              <RadioGroup defaultValue="yes">
                <HStack spacing={6}>
                  <Radio 
                    value="yes" 
                    color={config.primaryColor}
                    size="lg"
                    borderColor="gray.300"
                  >
                    <Text fontSize="md">Yes</Text>
                  </Radio>
                  <Radio 
                    value="no" 
                    color={config.primaryColor}
                    size="lg"
                    borderColor="gray.300"
                  >
                    <Text fontSize="md">No</Text>
                  </Radio>
                </HStack>
              </RadioGroup>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* ID Document */}
      <Box 
        bg="white" 
        p={6} 
        borderRadius="xl" 
        mb={8}
        border="1.5px solid"
        borderColor="gray.100"
        boxShadow="sm"
      >
        <HStack justify="space-between" mb={selectedFile ? 4 : 0}>
          <Text fontWeight="bold" fontFamily="Poppins" fontSize="lg">ID Document</Text>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.pdf"
            style={{ display: 'none' }}
          />
          <Button
            variant="outline"
            size="sm"
            borderRadius="full"
            borderColor={config.accentColor}
            color={config.accentColor}
            fontWeight="bold"
            px={6}
            _hover={{ bg: config.accentLightColor }}
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
          >
            {selectedFile ? 'Change' : 'Upload'}
          </Button>
        </HStack>

        {/* Selected File Preview */}
        {selectedFile && (
          <VStack spacing={4} align="stretch">
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
            
            <Button
              w="full"
              bg={config.primaryColor}
              color="black"
              size="md"
              borderRadius="full"
              _hover={{ bg: `${config.primaryColor}80` }}
              fontFamily="Poppins"
              fontWeight="semibold"
              isLoading={isUploading}
              loadingText="Uploading..."
              onClick={() => window.location.href = '/dashboard/documentupload'}
            >
              Upload Document
              <Icon as={CheckIcon} w={4} h={4} ml={1} strokeWidth={3}/>
            </Button>
          </VStack>
        )}
      </Box>

      {/* Update Button */}
      <Button
        w="full"
        bg={config.primaryColor}
        color="black"
        size="lg"
        height="56px"
        borderRadius="full"
        _hover={{ bg: `${config.primaryColor}80` }}
        fontFamily="Poppins"
        fontSize="lg"
        fontWeight="semibold"
        boxShadow="sm"
      >
        Update 
        <Icon as={CheckIcon} w={4} h={4} ml={1} strokeWidth={3}/>
      </Button>
    </Box>
  );
};

export default Profile;
