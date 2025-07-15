"use client"

import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import * as React from "react"

interface ProviderProps {
  children: React.ReactNode;
}

// Setup custom theme to use Poppins font globally
const theme = extendTheme({
  fonts: {
    heading: "'Poppins', system-ui, sans-serif",
    body: "'Poppins', system-ui, sans-serif",
  },
});

export function Provider({ children }: ProviderProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
