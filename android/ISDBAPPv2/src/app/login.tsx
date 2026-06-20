import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { Button, Icon } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';

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
        {/* Back button */}
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          variant="text"
          icon={<Icon name="back" size="sm" color={colors.primary} />}
          style={styles.backButton}
        />

        <View style={styles.header}>
          <Text style={[styles.logoEmoji, { color: colors.primary }]}>🏗️</Text>
          <Text style={[styles.title, { color: colors.onBackground }]}>
            Insane Dream Builder
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Sign in to continue
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Continue with GitHub"
            onPress={handleGitHubLogin}
            variant="tonal"
            fullWidth
            loading={loading}
            icon={<Icon name="github" size="md" color={colors.onSecondaryContainer} />}
          />
          <Button
            title="Continue with Discord"
            onPress={handleDiscordLogin}
            variant="outlined"
            fullWidth
            loading={loading}
            icon={<Icon name="discord" size="md" color={colors.primary} />}
          />
          <Button
            title="Continue with Google"
            onPress={() => Alert.alert('Coming soon', 'Google sign-in is not yet available')}
            variant="outlined"
            fullWidth
            icon={<Icon name="google" size="md" />}
          />
        </View>

        <Text style={[styles.terms, { color: colors.onSurfaceVariant }]}>
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
    padding: m3Spacing.lg,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: m3Spacing.sm,
    left: m3Spacing.sm,
  },
  header: {
    alignItems: 'center',
    marginBottom: m3Spacing.xl,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: m3Spacing.md,
  },
  title: {
    ...m3Typography.headlineSmall,
    textAlign: 'center',
  },
  subtitle: {
    ...m3Typography.bodyLarge,
    marginTop: m3Spacing.xs,
    textAlign: 'center',
  },
  buttons: {
    gap: m3Spacing.sm,
    marginBottom: m3Spacing.xl,
  },
  terms: {
    ...m3Typography.bodySmall,
    textAlign: 'center',
  },
});
