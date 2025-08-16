import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Link,
} from '@chakra-ui/react';

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <HStack spacing={3} align="flex-start" w="full">
    <Box flexShrink={0} mt={0.5}>
      <Image 
        src={`/Signature/${icon}`} 
        alt={title}
        boxSize={{ base: "32px", md: "36px" }}
        objectFit="contain"
      />
    </Box>
    <VStack align="flex-start" spacing={1} flex="1">
      <Text 
        fontSize={{ base: "sm", md: "md" }} 
        fontWeight="bold" 
        color="gray.900"
        fontFamily="Poppins"
        lineHeight="1.3"
      >
        {title}
      </Text>
      <Text 
        fontSize={{ base: "xs", md: "sm" }} 
        color="gray.700"
        fontFamily="Poppins"
        lineHeight="1.4"
      >
        {description}
      </Text>
    </VStack>
  </HStack>
);

const WhatHappensAfterSigning: React.FC = () => {
  const features = [
    {
      icon: "a.svg",
      title: "Soft credit search",
      description: "We will run a soft search to locate your agreements; this does not affect your credit score."
    },
    {
      icon: "fee.svg", 
      title: "There are free alternatives",
      description: "You can complain to the lender yourself, free of charge, and if unhappy take the matter to the Financial Ombudsman Service. A regulator-run redress scheme may also become available. By signing and submitting this form you acknowledge that you do not wish to pursue mis-sold vehicle finance claims by yourself and instead instruct our solicitors to pursue such claims on your behalf on a 'No Win, No Fee' basis."
    },
    {
      icon: "c.svg",
      title: "Referral fees", 
      description: "This comes at no additional charge to you. If your claim succeeds, Prowse Phillips Law Ltd may pay us a referral fee out of your success fee."
    },
    {
      icon: "d.svg",
      title: "No Win No Fee*",
      description: "If the claim succeeds you pay the solicitor a success fee capped at a maximum of 30% +VAT of any compensation, in line with the regulators rules."
    },
    {
      icon: "e.svg",
      title: "14-Day \"Cooling Off\"",
      description: "You'll have a 14-day cooling-off period during which you can cancel at any time without any charges. After this period, Prowse Phillips Law Ltd's Cancellation Fee may apply if they have completed work on your case."
    },
    {
      icon: "f.svg",
      title: "We may need more information",
      description: "We may ask for further information; this could include proof of ID or agreement details. This is only to support our investigation and assist in your claim."
    },
    {
      icon: "g.svg", 
      title: "Your documents",
      description: "By signing you agree that we may run a soft credit check on your behalf to locate agreement data, and you grant separate Letters of Authority: one to Solvo Solutions Ltd and one to Prowse Phillips Law Ltd, authorising them to investigate and handle your cases. Prowse Phillips' No-Win-No-Fee Agreement is a standalone document."
    }
  ];

  return (
    <VStack 
      spacing={{ base: 4, md: 6 }} 
      align="center"
      w="full"
    >
      {/* Header */}
      <VStack spacing={{ base: 2, md: 3 }} align="flex-start" textAlign="left" w="full" maxW="2xl">
        <Text 
          fontSize={{ base: "lg", md: "2xl" }} 
          fontWeight="bold" 
          color="gray.900"
          fontFamily="Poppins"
        >
          What happens after I sign?
        </Text>
        <Text 
          fontSize={{ base: "xs", md: "sm" }} 
          color="gray.600"
          fontFamily="Poppins"
          lineHeight="1.4"
        >
          We locate your agreements and prepare the complaint, then refer your case to our solicitors 
          Prowse Phillips Law Ltd, who will run and manage the claim and keep you updated.
        </Text>
      </VStack>

      {/* Features List */}
      <VStack spacing={{ base: 3, md: 4 }} align="stretch" w="full" maxW="2xl">
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </VStack>

      {/* Contact Information - styled to match the last feature item */}
      <HStack spacing={3} align="flex-start" w="full" maxW="2xl">
        <Box flexShrink={0} mt={0.5}>
          <Image 
            src="/Signature/h.svg" 
            alt="How to make a complaint to us"
            boxSize={{ base: "32px", md: "36px" }}
            objectFit="contain"
          />
        </Box>
        <VStack align="flex-start" spacing={2} flex="1">
          <Text 
            fontSize={{ base: "sm", md: "md" }} 
            fontWeight="bold" 
            color="gray.900"
            fontFamily="Poppins"
            lineHeight="1.3"
          >
            How to make a complaint to us
          </Text>
          <Text 
            fontSize={{ base: "xs", md: "sm" }} 
            color="gray.700"
            fontFamily="Poppins"
            lineHeight="1.4"
            mb={2}
          >
            To make a complaint to Solvo Solutions Ltd, please contact us using the information provided below.
          </Text>
          
          <VStack spacing={1} align="flex-start" fontSize={{ base: "xs", md: "sm" }} color="gray.700">
            <Text>
              <Text as="span" fontWeight="bold" color="gray.900">Telephone:</Text> 0333 049 9895
            </Text>
            
            <Text>
              <Text as="span" fontWeight="bold" color="gray.900">Email:</Text>{' '}
              <Link href="mailto:complaints@resolvemyclaim.co.uk">
                complaints@resolvemyclaim.co.uk
              </Link>
            </Text>
            
            <Text>
              <Text as="span" fontWeight="bold" color="gray.900">Post:</Text> Suite 3, 2nd Floor, Didsbury House, 748 - 754 Wilmslow Road, Manchester, England, M20 2DW
            </Text>
          </VStack>
          
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.600" fontFamily="Poppins" mt={2}>
            For more information please read our{' '}
            <Link href="/complaints" textDecoration="underline">
              complaints policy
            </Link>
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default WhatHappensAfterSigning;
