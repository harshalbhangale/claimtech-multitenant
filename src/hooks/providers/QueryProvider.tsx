import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time for all queries
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Default cache time
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Retry failed requests
      retry: 2,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query DevTools - only in development */}
    </QueryClientProvider>
  );
}; 