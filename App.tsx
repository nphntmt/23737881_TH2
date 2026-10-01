// TH2 | 23737881 | NGÔ PHONG HÀO #STAMP

import React from 'react';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import RootNavigator from '@navigation/RootNavigator';

const queryClient =
  new QueryClient();

const App = () => {
  return (
    <SafeAreaProvider>

      <QueryClientProvider
        client={queryClient}>

        <RootNavigator />

      </QueryClientProvider>

    </SafeAreaProvider>
  );
};

export default App;