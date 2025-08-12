import React from 'react';
import { Box, Text, Container, VStack, HStack, Image, Link, Stack, Flex } from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';

export const Footer: React.FC = () => {
  const { config } = useTenant();

  return (
    <Box bg="#EFF1F4" w="full" py={6}>
      <Flex 
        maxW="3xl"
        mx="auto"
        px={0}
        justify="space-between" 
        align="center"
      >
        <Container maxW="3xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <VStack spacing={{ base: 8, md: 10 }} align="flex-start">
            {/* Top Row - Logo and Navigation Links */}
            <Stack 
              direction={{ base: "column", md: "row" }}
              justify="space-between" 
              align={{ base: "flex-start", md: "center" }} 
              w="full"
              spacing={{ base: 6, md: 0 }}
            >
              {/* Company Logo */}
              <Image 
                src={config.logo} 
                alt={config.name}
                h={{ base: "28px", md: "32px" }}
                objectFit="contain"
                maxW={{ base: "180px", md: "auto" }}
              />

              {/* Navigation Links */}
              <HStack 
                spacing={{ base: 4, md: 8 }}
                direction={{ base: "column", sm: "row" }}
                align={{ base: "flex-start", sm: "center" }}
              >
                <Link 
                  href="/privacy-policy" 
                  color="gray.700"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="bold"
                  _hover={{ color: config.accentColor }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/no-win-no-fee" 
                  color="gray.700"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="bold"
                  _hover={{ color: config.accentColor }}
                >
                  No Win No Fee
                </Link>
                <Link 
                  href="/complaints" 
                  color="gray.700"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="bold"
                  _hover={{ color: config.accentColor }}
                >
                  Complaints
                </Link>
              </HStack>
            </Stack>

            {/* Legal Text Sections */}
            <VStack spacing={{ base: 6, md: 8 }} align="flex-start" w="full">
              {/* Company Information */}
              <Text 
                fontSize={{ base: "xs", md: "sm" }} 
                color="gray.600" 
                lineHeight="1.2"
                textAlign="justify"
                fontWeight="medium"
              >
                {config.name} is a trading style of Solvo Solutions Ltd, authorised and regulated by the Financial 
                Conduct Authority for claims management referrals (FRN: 1013195), registered in England and Wales 
                Registration Number: 14760023, address is Suite 105, Earl Business Centre, Dowry Street, Oldham, England, 
                OL8 2PF
              </Text>
                
              {/* Claims Information */}
              <Text 
                fontSize={{ base: "xs", md: "sm" }} 
                color="gray.600" 
                lineHeight="1.2"
                textAlign="justify"
                fontWeight="medium"
              >
                You don't need a claims management company to make a claim. You can contact the organisation 
                directly for free and make use of the Financial Ombudsman Service if dissatisfied with the outcome. If we 
                identify a potential claim, we will refer you to one of our panel Solicitors who will pay us a fee for the 
                referral. This fee is not passed to you. If you decide to use our panel firm they will charge you a 
                success fee agreed with you before you decide whether to go ahead. A customer's claim may not necessarily 
                be resolved more quickly, or with a better prospect of success if the customer uses the services of a Claims 
                Management Company than if the customer were to make the claim themselves for free.
              </Text>
                
              {/* Fee Information */}
              <Text 
                fontSize={{ base: "xs", md: "sm" }} 
                color="gray.600"
                lineHeight="1.2"
                textAlign="justify"
                fontWeight="medium"
              >
                *If your claim is successful, you will be required to pay our solicitor's fees. Our solicitors typically charge 
                around 30% of any compensation awarded to you. If you cancel your claim before an outcome, you may 
                be required to pay a termination fee for work carried out on your claim. Please see your Solicitors No Win 
                No Fee agreement for more details.
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};
