import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from './src/api/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { AuthProvider } from './src/context/AuthContext';
import { MarketProvider } from './src/context/MarketContext';

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MarketProvider>
            <RootNavigator />
            <StatusBar style="light" />
          </MarketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
