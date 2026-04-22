import { QueryClient } from '@tanstack/react-query';

/**
 * Global Query Client for OptionPluse.
 * Standardizes caching behavior to reduce bandwidth and provide a snappy UI.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 seconds (market data window)
      staleTime: 5_000,
      
      // Keep inactive queries in memory for 5 minutes
      gcTime: 1000 * 60 * 5,
      
      // Retry failed requests with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 401 or 404
        if (error?.status === 401 || error?.status === 404) return false;
        return failureCount < 2;
      },
      
      // Refetch when app gains focus
      refetchOnWindowFocus: true,
      
      // Re-connect trigger
      refetchOnReconnect: 'always',
    },
  },
});
