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
        <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
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
                spacing={{ base: 3, md: 8 }}
                direction="row"
                align="center"
                flexWrap="wrap"
              >
<Stack
  direction={{ base: "column", md: "row" }}
  spacing={{ base: 2, md: 8 }}
  align={{ base: "flex-start", md: "center" }}
>
  <Link
    href="/privacy-policy"
    color="gray.700"
    fontSize={{ base: "sm", md: "md" }}
    fontWeight="medium"
    _hover={{ color: config.accentColor }}
    display={{ base: "block", md: "inline" }}
    py={{ base: 1, md: 0 }}
  >
    Privacy Policy
  </Link>
  <Link
    href="/no-win-no-fee"
    color="gray.700"
    fontSize={{ base: "sm", md: "md" }}
    fontWeight="medium"
    _hover={{ color: config.accentColor }}
    display={{ base: "block", md: "inline" }}
    py={{ base: 1, md: 0 }}
  >
    No Win No Fee
  </Link>
  <Link
    href="/complaints"
    color="gray.700"
    fontSize={{ base: "sm", md: "md" }}
    fontWeight="medium"
    _hover={{ color: config.accentColor }}
    display={{ base: "block", md: "inline" }}
    py={{ base: 1, md: 0 }}
  >
    Complaints
  </Link>
</Stack>
              </HStack>
            </Stack>

            {/* Legal Text Sections */}
            <VStack align="flex-start" w="full">
              {/* Company Information */}

              <Text 
                fontSize={{ base: "sm", md: "sm" }} 
                color="gray.600" 
                lineHeight="1.2"
                textAlign="justify"
                fontWeight="regular"
              >
                © 2025 Resolve My Claim. All rights reserved.
              </Text>
              <VStack spacing={{ base: 6, md: 6 }} >
              <Text 
                fontSize={{ base: "sm", md: "sm" }} 
                color="gray.600" 
                lineHeight="1.2"
                textAlign="justify"
                fontWeight="regular"
              >
                ResolveMyClaim is a trading style of Solvo Solutions Ltd, authorised and regulated by the Financial 
                Conduct Authority for claims management referrals (FRN: 1013195), registered in England and Wales 
                Registration Number: 14760023, address is Suite 3, 2nd Floor, Didsbury House, 748 - 754 Wilmslow Road, Manchester, England, M20 2DW.
              </Text>


                
              {/* Claims Information */}
              <Text 
                fontSize={{ base: "sm", md: "sm" }} 
                color="gray.600" 
                lineHeight="1.2"
                textAlign="justify"
                fontWeight="regular"
              >
                You don't need a claims management company to make a claim. You can contact the Financial Ombudsman Service directly for free. If we identify a potential claim, we will refer you to one of our panel solicitors, who pay a referral fee that is not passed on to you. If you decide to use our panel firm they will charge you a "success fee" and that using a Claims Management Company does not necessarily lead to quicker resolution or better success than making the claim yourself for free.
              </Text>
                
              {/* Refund Amounts Disclaimer */}
              <Text 
                fontSize={{ base: "sm", md: "sm" }} 
                color="gray.600"
                lineHeight="1.2"
                textAlign="justify"
                fontWeight="regular"
              >
                *The amounts shown reflect a calculation made from a limited batch of agreements and do not guarantee a specific refund amount. A typical range (25th-75th percentile) is £466 - £2,418, with some refunds reaching £5,898, although the FCA believe most claims will result in refunds of below £950.
              </Text>
                
              {/* Solicitor Fees and Termination Disclaimer */}
              <Text 
                fontSize={{ base: "sm", md: "sm" }} 
                color="gray.600"
                lineHeight="1.2"
                textAlign="justify"
                fontWeight="regular"
              >
                **If your claim is successful, you will be required to pay our solicitor's fees. Prowse Philips Law Ltd typically charge a maximum of 30% + VAT of any compensation awarded to you. If you cancel your claim before an outcome, you may be required to pay a termination fee for work carried out on your claim. Please see Prowse Philips Law Ltd 'No Win No Fee' agreement for more details.
              </Text>
            </VStack>
                          </VStack>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};
