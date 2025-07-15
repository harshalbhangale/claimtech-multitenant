/* eslint-disable react-refresh/only-export-components */

"use client"

import {
  Box,
  Portal,
} from "@chakra-ui/react"

interface ToastProps {
  title?: string;
  description?: string;
  type?: 'loading' | 'success' | 'error' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
  meta?: {
    closable?: boolean;
  };
}

export const toaster = {
  show: (props: ToastProps) => {
    // Implementation will be added
    console.log('Toast:', props);
  }
};

export const Toaster = () => {
  
  return (
    <Portal>
      <Box position="fixed" bottom="4" right="4" zIndex="toast">
        {/* Toast implementation will be added */}
      </Box>
    </Portal>
  )
}
