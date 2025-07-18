import { useEffect, useRef } from 'react';

/**
 * Custom hook for auto-saving form data to localStorage
 * @param data - The data to save
 * @param saveFunction - Function to save the data
 * @param delay - Debounce delay in milliseconds (default: 1000ms)
 */
export const useAutoSave = <T>(
  data: T,
  saveFunction: (data: T) => void,
  delay: number = 1000
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip auto-save on initial mount to avoid overwriting with empty values
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveFunction(data);
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
