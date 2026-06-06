import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';

export function AuthCallbackScreen() {
  const { colors } = useTheme();
  const { user, initialized } = useAuth();
  const navigation = useNavigation();
  const [status, setStatus] = useState('Processing login...');

  useEffect(() => {
    const checkAuth = async () => {
      if (initialized) {
        if (user) {
          setStatus('Login successful! Redirecting...');
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' as never }],
            });
          }, 1000);
        } else {
          setStatus('Login failed. Please try again.');
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Landing' as never }],
            });
          }, 2000);
        }
      }
    };

    checkAuth();
  }, [user, initialized, navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        <Text style={[styles.statusText, { color: colors.text }]}>{status}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loader: {
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
