import { Box, Text, Button, Image, Input, HStack, Icon, useClipboard } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../MainPage/Header';
import { useTenant } from '../../../contexts/TenantContext';
const Refer = () => {
  const [referralLink] = useState('https://claim.resolvemyclaim.co.uk/claims_referral=12345');
  const { hasCopied, onCopy } = useClipboard(referralLink);
  const { config } = useTenant();
  return (
    <Box minH="100vh" bg="#F9F9FB">
      <Header />
      <Box maxW="container.sm" mx="auto" px={4} py={6}>
        {/* Back button */}
        <Link to="/dashboard">
          <HStack spacing={1} mb={6}>
            <Icon as={ArrowLeftIcon} w={6} h={6} color="gray.800"/>
            <Text fontWeight="medium" fontSize="md" fontFamily="Poppins" color="gray.800">All claims</Text>
          </HStack>
        </Link>

        {/* Gift illustration */}
        <Box textAlign="center" mb={6}>
          <Image 
            src="/Refer/ReferGift.svg" 
            alt="Gift box" 
            mx="auto"
            h="140px"
          />
        </Box>

        {/* Main heading */}
        <Text 
          textAlign="center" 
          fontSize="xl" 
          fontWeight="bold" 
          mb={4}
          fontFamily="Poppins"
        >
          Refer a friend and get £20!
        </Text>

        {/* Description */}
        <Text 
          textAlign="center" 
          fontSize="sm" 
          fontWeight="medium"
          mb={4}
          px={4}
          color="gray.700"
          fontFamily="Poppins"
        >
          Refer any friends and family you think could benefit from the 
          service and we'll send you £20 amazon voucher for everyone with 
          a successful claim!
        </Text>

        {/* Instructions */}
        <Text 
          textAlign="center" 
          fontSize="sm" 
          mb={6}
          fontWeight="medium"
          color="gray.700"
          fontFamily="Poppins"
        >
          Click the button below to copy your unique referral URL and 
          send it around to your friends and family.
        </Text>

        {/* Referral link section */}
        <Box mb={6}>
          <Text 
            fontSize="sm" 
            fontWeight="medium" 
            mb={2}
            color="gray.700"
            fontFamily="Poppins"
          >
            Your unique referral link is:
          </Text>
          <HStack position="relative">
            <Input 
              value={referralLink}
              isReadOnly
              bg="white"
              borderRadius="md"
              py={6}
              fontSize="sm"
              pr="70px"
              border="1px solid"
              borderColor="gray.300"
              color="gray.700"
              fontFamily="Poppins"
            />
            <Button
              position="absolute"
              right={4}
              bg={config.primaryColor}
              color="black"
              size="sm"
              onClick={onCopy}
              borderRadius="full"
              _hover={{ bg: `${config.primaryColor}80` }}
              fontFamily="Poppins"
              fontWeight="semibold"
              border="1px solid"
              borderColor={`${config.primaryColor}80`}
              px={4}
            >
              {hasCopied ? "Copied!" : "Copy"}
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Refer;
export { Refer };
