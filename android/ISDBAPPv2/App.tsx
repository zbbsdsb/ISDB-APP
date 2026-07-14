/**
 * Oasis.ISDB - Insane Dream Builder Mobile App
 * Package: oasis.isdb
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/hooks/use-theme';
import { Navigation } from './src/navigation';
import { ErrorBoundary } from './src/components/ui/error-boundary';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <ErrorBoundary>
            <Navigation />
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {flex: 1},
});
