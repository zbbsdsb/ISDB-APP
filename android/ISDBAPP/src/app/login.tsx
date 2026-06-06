import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui';

export function LoginScreen() {
  const { colors } = useTheme();
  const { signInWithGitHub, signInWithDiscord, loading } = useAuth();
  const navigation = useNavigation();

  const handleGitHubLogin = async () => {
    try {
      await signInWithGitHub();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    }
  };

  const handleDiscordLogin = async () => {
    try {
      await signInWithDiscord();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logoEmoji, { color: colors.primary }]}>🏗️</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Insane Dream Builder
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Continue with GitHub"
            onPress={handleGitHubLogin}
            variant="primary"
            fullWidth
            loading={loading}
          />
          <Button
            title="Continue with Discord"
            onPress={handleDiscordLogin}
            variant="outline"
            fullWidth
            loading={loading}
          />
        </View>

        <Text style={[styles.terms, { color: colors.textSecondary }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
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
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
    marginBottom: 32,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
  },
});
