import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppLoading from 'expo-app-loading';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { refreshAccessToken } from './api';
import { LogBox } from 'react-native';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  LogBox.ignoreLogs(['Setting a timer']);

  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!appIsReady) {
    return (
      <AppLoading
        startAsync={() => refreshAccessToken()}
        onFinish={() => setAppIsReady(true)}
        onError={console.warn}
      />
    );
  }

  if (!isLoadingComplete || !fontsLoaded) {
    return null;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* <Navigation colorScheme={colorScheme} /> */}
            <Navigation colorScheme="light" />
            <StatusBar style="dark" />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  }
}
