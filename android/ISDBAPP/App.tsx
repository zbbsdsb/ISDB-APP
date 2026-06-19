/**
 * Oasis.ISDB - Insane Dream Builder Mobile App
 * Package: oasis.isdb
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/hooks/use-theme';
import { Navigation } from './src/navigation';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { setupErrorHandling, logInfo } from './src/utils/errorReporting';

function App(): React.JSX.Element {
  useEffect(() => {
    setupErrorHandling();
    logInfo('App started');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <Navigation />
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
