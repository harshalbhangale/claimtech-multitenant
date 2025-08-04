import { Box, VStack, Text, HStack, Button, Input, SimpleGrid, Icon, Radio, RadioGroup, Badge } from '@chakra-ui/react';
import { DocumentCheckIcon, GiftIcon, ArrowRightOnRectangleIcon, ChevronRightIcon, CheckIcon, DocumentIcon } from '@heroicons/react/24/outline';

import { useTenant } from '../../../contexts/TenantContext';

const Profile = () => {
  const { config } = useTenant();
  // const [ setSelectedFile] = useState<File | null>(null);
  // const toast = useToast();

  // File select logic is kept but not used, as upload is coming soon
  // const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   // Validate file type
  //   const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  //   if (!allowedTypes.includes(file.type)) {
  //     toast({
  //       title: "Invalid file type",
  //       description: "Please upload a JPG, PNG or PDF file",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     return;
  //   }

  //   // Validate file size (max 5MB)
  //   const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  //   if (file.size > maxSize) {
  //     toast({
  //       title: "File too large",
  //       description: "Please upload a file smaller than 5MB",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     return;
  //   }

  //   setSelectedFile(file);
  // };

  return (
    <Box p={8} maxW="2xl" mx="auto">
      {/* Account Details Section */}
      <Text color="gray.700" mb={2} fontSize="md" fontWeight="bold">
        Account details
      </Text>


      {/* Quick Actions */}
      <VStack spacing={4} mb={10} align="stretch">
        {/* Open Claim */}
        <Box
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
          onClick={() => window.location.href = '/dashboard'}
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
                <Icon as={DocumentCheckIcon} w={6} h={6} color={config.accentColor} />
              </Box>
              <Text fontFamily="Poppins" fontSize="lg" fontWeight="medium">
                Open Claim
                <Box as="span" ml={3} color={config.accentColor} fontWeight="semibold">
                  1
                </Box>
              </Text>
            </HStack>
            <Icon as={ChevronRightIcon} w={6} h={6} color="gray.400" />
          </HStack>
        </Box>
        {/* Refer a Friend - Coming Soon */}
        <Box
          as="button"
          bg="gray.50"
          p={5}
          borderRadius="xl"
          boxShadow="sm"
          border="1.5px solid"
          borderColor="gray.100"
          w="full"
          transition="all 0.2s"
          cursor="not-allowed"
          aria-disabled="true"
          _hover={{ bg: 'gray.50', borderColor: 'gray.100' }}
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
                <Icon as={GiftIcon} w={6} h={6} color={config.accentColor} />
              </Box>
              <Text fontFamily="Poppins" fontSize="lg" fontWeight="medium" color="gray.400">
                Refer a Friend
                <Badge ml={3} colorScheme="yellow" fontSize="0.8em" borderRadius="full" px={2}>
                  Coming Soon
                </Badge>
              </Text>
            </HStack>
            <Icon as={ChevronRightIcon} w={6} h={6} color="gray.300" />
          </HStack>
        </Box>
        {/* Log out */}
        <Box
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
          onClick={() => window.location.href = 'https://www.resolvemyclaim.co.uk/'}
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
                <Icon as={ArrowRightOnRectangleIcon} w={6} h={6} color={config.accentColor} />
              </Box>
              <Text fontFamily="Poppins" fontSize="lg" fontWeight="medium">
                Log out
              </Text>
            </HStack>
            <Icon as={ChevronRightIcon} w={6} h={6} color="gray.400" />
          </HStack>
        </Box>
      </VStack>

      {/* Your Details Section */}
      <HStack justify="space-between" align="center" mb={6}>
        <Text color= "gray.700" fontSize="md" fontWeight="bold">
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
          isDisabled
        >
          Edit Profile
          <Badge ml={2} colorScheme="yellow" borderRadius="full" px={2} fontSize="0.8em">
            Coming Soon
          </Badge>
        </Button>
      </HStack>

      {/* Contact Details - Dummy Values */}
      <VStack spacing={4} mb={10} align="stretch">
        <Input
          value="example@email.com"
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
          value="+44 7123 456789"
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
          value="123 Example Street"
          isReadOnly
          bg="white"
          borderRadius="lg"
          fontSize="md"
          color="gray.700"
          fontFamily="Poppins"
          size="lg"
          border="1.5px solid"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
        />
        <Input
          value="Apt 4B"
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
          value="AB12 3CD"
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
          <Input
            value="01"
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
            value="01"
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
            value="1990"
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
        </SimpleGrid>
      </VStack>

      {/* Account Settings */}
      <Text color="gray.700" fontSize="md" fontWeight="bold" mb={4}>
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

      {/* ID Document - Coming Soon */}
      <Box 
        bg="white" 
        p={6} 
        borderRadius="xl" 
        mb={8}
        border="1.5px solid"
        borderColor="gray.100"
        boxShadow="sm"
      >
        <HStack justify="space-between" mb={0}>
          <Text fontWeight="bold" fontFamily="Poppins" fontSize="lg">
            ID Document
            <Badge ml={3} colorScheme="yellow" borderRadius="full" px={2} fontSize="0.8em">
              Coming Soon
            </Badge>
          </Text>
        </HStack>
        <VStack spacing={4} align="stretch" mt={6}>
          <HStack 
            p={4} 
            bg="gray.50" 
            borderRadius="lg" 
            border="1px dashed" 
            borderColor="gray.200"
            justify="center"
          >
            <Icon as={DocumentIcon} w={5} h={5} color="gray.400" />
            <Text fontSize="sm" color="gray.400" fontFamily="Poppins">
              ID document upload coming soon
            </Text>
          </HStack>
          <Button
            w="full"
            variant="outline"
            color={config.accentColor}
            borderColor={config.accentColor}
            borderRadius="full"
            fontFamily="Poppins"
            fontWeight="semibold"
            isDisabled
            leftIcon={<Icon as={CheckIcon} w={4} h={4} strokeWidth={3}/>}
          >
            Upload Document
          </Button>
        </VStack>
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
