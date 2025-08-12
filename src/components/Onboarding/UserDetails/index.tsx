import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  VStack,
  Text,
  Box,
  Flex,
  HStack,
  Input,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Common/Header';
import { Footer } from '../Common/Footer';
import { SecureBar } from '../Common/Securebar';
import { ProgressBar } from '../Common/ProgressBar';
import { useTenant } from '../../../contexts/TenantContext';
import NextButton from '../../Onboarding/Common/NextButton';
import Trustpilot from '../Common/Trustpilot';
import { saveUserDetails, getUserDetails, getLenderSelection } from '../../../utils/onboardingStorage';
import { useAutoSave } from '../../../hooks/useAutoSave';

function isValidDate(day: string, month: string, year: string) {
  if (!day || !month || !year) return false;
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  // Check for valid day in month
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

function isAtLeast18YearsOld(day: string, month: string, year: string) {
  if (!isValidDate(day, month, year)) return false;
  const dob = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  const today = new Date();
  const eighteen = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return dob <= eighteen;
}

export const UserDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useTenant();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [selectedLendersCount, setSelectedLendersCount] = useState(0);

  // Validation state
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; dob?: string }>({});

  // Refs for auto-focus functionality
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Handle Enter key press to submit form
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNextStep();
    }
  };

  // Handle date field navigation (forward and backward)
  const handleDateKeyDown = (e: React.KeyboardEvent, field: 'day' | 'month' | 'year') => {
    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNextStep();
      return;
    }

    // Handle Backspace for reverse navigation
    if (e.key === 'Backspace') {
      const target = e.target as HTMLInputElement;
      const currentValue = target.value;
      
      // If field is empty and backspace is pressed, move to previous field
      if (currentValue === '') {
        e.preventDefault();
        if (field === 'month' && dayRef.current) {
          dayRef.current.focus();
        } else if (field === 'year' && monthRef.current) {
          monthRef.current.focus();
        }
      }
    }
  };

  // Load saved user details and lender selection on component mount
  useEffect(() => {
    const savedUserDetails = getUserDetails();
    if (savedUserDetails) {
      setFirstName(savedUserDetails.firstName);
      setLastName(savedUserDetails.lastName);
      setDob(savedUserDetails.dob);
    }

    const savedLenderSelection = getLenderSelection();
    if (savedLenderSelection) {
      setSelectedLendersCount(savedLenderSelection.selectedLenders.length);
    }
  }, []);

  // Auto-save user details as user types
  useAutoSave(
    {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob
    },
    (data) => {
      // Only save if at least name fields have content
      if (data.firstName || data.lastName) {
        saveUserDetails(data);
      }
    },
    2000 // Save after 2 seconds of inactivity
  );

  const validate = () => {
    const newErrors: { firstName?: string; lastName?: string; dob?: string } = {};
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!dob.day || !dob.month || !dob.year) {
      newErrors.dob = 'Date of birth is required';
    } else if (!isValidDate(dob.day, dob.month, dob.year)) {
      newErrors.dob = 'Please enter a valid date of birth';
    } else if (!isAtLeast18YearsOld(dob.day, dob.month, dob.year)) {
      newErrors.dob = 'You must be at least 18 years old';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validate()) {
      return;
    }
    // Save user details to localStorage
    saveUserDetails({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob
    });

    navigate('/auth/addresssearch');
  };

  return (
    <Box minH="100vh" bg="white" w="100%">
      <Header />

      <Container maxW="3xl" pt={{ base: 2, md: 3 }} pb={{ base: 4, md: 6 }} px={{ base: 6, sm: 8, lg: 12 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Progress Steps */}
          <ProgressBar currentStep={2} totalSteps={4} />
          {/* Purple Banner */}
          <Box bg={config.accentColor} color="white" p={4} borderRadius="xl" >
            <Flex justify="center" align="center" gap={4}>
              <Text fontSize={{ base: "xs", md: "xs" }} fontWeight="medium">
                You have selected {selectedLendersCount} agreements which could be worth a total refund value of
              </Text>
              <Box position="relative" display="inline-block" minW="90px">
                <Image
                  src="/icons/scribble.svg"
                  alt=""
                  position="absolute"
                  top="-10px"
                  left="-10px"
                  right="-10px"
                  bottom="-10px"
                  w="calc(100% + 20px)"
                  h="calc(100% + 20px)"
                />
                <Text
                  as="span"
                  position="relative"
                  color="#000000"
                  fontWeight="bold"
                  zIndex={1}
                >
                  £{2976 * selectedLendersCount}*
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Form Section */}
          <Box border="2px solid #E2E8F0" borderRadius="2xl" p={6} w="full">
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mb={3}
              color="gray.900"
            >
              Let's find your finance agreements
            </Text>
            <Text color="gray.600" mb={6} fontSize={{ base: "sm", md: "md" }}>
              Enter your details below so we can search for your finance agreements
            </Text>

            <VStack spacing={5} align="stretch" mb={6}>
              <Box>
                <Input
                  placeholder="First name"
                  size="lg"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                  }}
                  onKeyDown={handleKeyDown}
                  bg="white"
                  border="1px solid"
                  borderColor={errors.firstName ? "red.400" : "gray.300"}
                  borderRadius="md"
                  _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                  height="56px"
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.firstName}
                  </Text>
                )}
              </Box>

              <Box>
                <Input
                  placeholder="Last name"
                  size="lg"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                  }}
                  onKeyDown={handleKeyDown}
                  bg="white"
                  border="1px solid"
                  borderColor={errors.lastName ? "red.400" : "gray.300"}
                  borderRadius="md"
                  _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                  height="56px"
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.lastName}
                  </Text>
                )}
              </Box>

              <Box>
                <HStack spacing={2} mb={2} align="center">
                  <Box as="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    w="16px"
                    h="16px"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    Date of birth
                  </Text>
                </HStack>
                <HStack spacing={4} w="full">
                  <Input
                    ref={dayRef}
                    placeholder="DD"
                    size="lg"
                    flex="1"
                    value={dob.day}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setDob({ ...dob, day: value });
                      if (errors.dob) setErrors({ ...errors, dob: undefined });
                      // Auto-focus to month field when day is complete
                      if (value.length === 2 && monthRef.current) {
                        monthRef.current.focus();
                      }
                    }}
                    onKeyDown={(e) => handleDateKeyDown(e, 'day')}
                    bg="white"
                    border="1px solid"
                    borderColor={errors.dob ? "red.400" : "gray.300"}
                    borderRadius="xl"
                    _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                    height="56px"
                    fontSize="lg"
                    color="gray.900"
                    textAlign="left"
                    fontFamily="Poppins"
                    _placeholder={{ color: "gray.400", fontSize: "lg" }}
                    maxLength={2}
                    inputMode="numeric"
                    aria-invalid={!!errors.dob}
                  />
                  <Input
                    ref={monthRef}
                    placeholder="MM"
                    size="lg"
                    flex="1"
                    value={dob.month}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setDob({ ...dob, month: value });
                      if (errors.dob) setErrors({ ...errors, dob: undefined });
                      // Auto-focus to year field when month is complete
                      if (value.length === 2 && yearRef.current) {
                        yearRef.current.focus();
                      }
                    }}
                    onKeyDown={(e) => handleDateKeyDown(e, 'month')}
                    bg="white"
                    border="1px solid"
                    borderColor={errors.dob ? "red.400" : "gray.300"}
                    borderRadius="xl"
                    _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                    height="56px"
                    fontSize="lg"
                    color="gray.900"
                    textAlign="left"
                    fontFamily="Poppins"
                    _placeholder={{ color: "gray.400", fontSize: "lg" }}
                    maxLength={2}
                    inputMode="numeric"
                    aria-invalid={!!errors.dob}
                  />
                  <Input
                    ref={yearRef}
                    placeholder="YYYY"
                    size="lg"
                    flex="1"
                    value={dob.year}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setDob({ ...dob, year: value });
                      if (errors.dob) setErrors({ ...errors, dob: undefined });
                    }}
                    onKeyDown={(e) => handleDateKeyDown(e, 'year')}
                    bg="white"
                    border="1px solid"
                    borderColor={errors.dob ? "red.400" : "gray.300"}
                    borderRadius="xl"
                    _focus={{ borderColor: config.accentColor, boxShadow: `0 0 0 1px ${config.accentColor}` }}
                    height="56px"
                    fontSize="lg"
                    color="gray.900"
                    textAlign="left"
                    fontFamily="Poppins"
                    _placeholder={{ color: "gray.400", fontSize: "lg" }}
                    maxLength={4}
                    inputMode="numeric"
                    aria-invalid={!!errors.dob}
                  />
                </HStack>
                {errors.dob && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.dob}
                  </Text>
                )}
              </Box>
            </VStack>

            {/* Next Step Button */}
            <NextButton onClick={handleNextStep} />

            {/* Bottom Centered Content */}
            <VStack spacing={4} align="center">
              {/* Trustpilot Rating */}
              <Trustpilot size="md" />

            </VStack>
          </Box>

          {/* Bottom Features */}
          <Box w="full" maxW={{ base: "full", md: "2xl" }}>
            <SecureBar />
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default UserDetailsPage;
