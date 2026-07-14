import React from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {Text} from './text';
import {m3Spacing} from '../../constants/m3-spacing';
import {m3Typography} from '../../constants/m3-typography';
import logger from '../../utils/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional custom fallback renderer. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-phase errors anywhere below it and shows a recoverable
 * fallback instead of white-screening the whole app. Async/event errors are
 * NOT caught (those should be handled where they occur).
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {error: null};

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {error};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => {
    this.setState({error: null});
  };

  render() {
    const {error} = this.state;
    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }
      return <DefaultFallback error={error} reset={this.reset} />;
    }
    return this.props.children;
  }
}

function DefaultFallback({error, reset}: {error: Error; reset: () => void}) {
  const {colors} = useTheme();
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.inner}>
        <Text
          variant="title"
          style={[styles.title, {color: colors.onSurface}]}>
          Something went wrong
        </Text>
        <Text
          variant="body"
          style={[styles.message, {color: colors.onSurfaceVariant}]}>
          {error.message || 'An unexpected error occurred.'}
        </Text>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={reset}
          activeOpacity={0.85}>
          <Text variant="label" style={styles.buttonText}>
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: m3Spacing.xl,
    gap: m3Spacing.md,
  },
  title: {...m3Typography.titleMedium},
  message: {
    ...m3Typography.bodyMedium,
    textAlign: 'center',
    maxWidth: 320,
  },
  button: {
    marginTop: m3Spacing.sm,
    paddingVertical: m3Spacing.sm,
    paddingHorizontal: m3Spacing.lg,
    borderRadius: 12,
  },
  buttonText: {color: '#FFFFFF'},
});

export default ErrorBoundary;
