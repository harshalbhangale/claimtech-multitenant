import { Box, HStack, VStack, Text, Circle } from '@chakra-ui/react';
import { useTenant } from '../../../contexts/TenantContext';

export const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
    const { config } = useTenant();
    
    return (
        <Box w="full" maxW="3xl" mx="auto">
            <HStack spacing={{ base: 2, md: 4 }} align="flex-start" w="full">
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    
                    return (
                        <VStack 
                            key={stepNumber} 
                            spacing={{ base: 2, md: 3 }} 
                            align="center" 
                            flex="1"
                        >
                            {/* Progress Bar */}
                            <Box 
                                w="full" 
                                h={{ base: "5px", md: "5px" }}
                                bg={isActive ? config.accentColor : isCompleted ? config.completedColor || config.primaryColor : config.inactiveColor || 'gray.300'} 
                                borderRadius="lg" 
                            />
                            
                            {/* Circle and Label Container */}
                            <VStack spacing={{ base: 0.5, md: 1 }} align="center">
                                {/* Circle with Checkmark */}
                                <Circle
                                    size={{ base: "10px", md: "12px" }}
                                    bg={isActive ? config.accentColor : isCompleted ? config.completedColor || config.primaryColor : config.inactiveColor || 'gray.300'}
                                    color="white"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Box 
                                        as="svg" 
                                        w={{ base: "6px", md: "7px" }} 
                                        h={{ base: "6px", md: "7px" }} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                        strokeWidth="3"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </Box>
                                </Circle>
                                
                                {/* Step Label */}
                                <Text 
                                    fontSize={{ base: "xs", md: "xs" }}
                                    fontWeight="bold"
                                    color={
                                        isActive ? 'gray.900' : 
                                        isCompleted ? 'gray.600' : 
                                        config.inactiveColor ? '#4B5563' : 'gray.400'
                                    }
                                    textAlign="center"
                                    lineHeight="1.2"
                                >
                                    STEP {stepNumber}
                                </Text>
                            </VStack>
                        </VStack>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default ProgressBar;
