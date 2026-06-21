import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from './use-theme';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import { m3Shape } from '../constants/m3-shape';

export type ToastType = 'error' | 'success' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
}

const TOAST_DURATION = 3000;
const ANIM_DURATION = 250;

export function useToast() {
  const { colors } = useTheme();
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ message, type });

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: ANIM_DURATION,
      useNativeDriver: true,
    }).start();

    // Auto-hide after duration
    timerRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setToast(null);
      });
    }, TOAST_DURATION);
  }, [opacity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'error':
        return { bg: colors.error, text: colors.onError };
      case 'success':
        return { bg: '#22c55e', text: '#ffffff' };
      case 'info':
        return { bg: colors.primary, text: colors.onPrimary };
    }
  };

  const ToastComponent = toast ? (
    <Animated.View
      style={[
        styles.container,
        { opacity, backgroundColor: getToastColors(toast.type).bg },
      ]}
      pointerEvents="none"
    >
      <Text
        style={[
          styles.text,
          { color: getToastColors(toast.type).text },
        ]}
      >
        {toast.message}
      </Text>
    </Animated.View>
  ) : null;

  return { show, ToastComponent };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: m3Spacing.lg,
    right: m3Spacing.lg,
    paddingVertical: m3Spacing.sm,
    paddingHorizontal: m3Spacing.md,
    borderRadius: m3Shape.small,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  text: {
    ...m3Typography.bodyMedium,
    fontWeight: '600',
  },
});