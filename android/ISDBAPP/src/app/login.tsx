import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Button } from '../components/ui';

export function LoginScreen() {
  const { colors } = useTheme();

  const handleGitHubLogin = () => {
    // OAuth flow would be triggered here
    console.log('GitHub login');
  };

  const handleDiscordLogin = () => {
    // OAuth flow would be triggered here
    console.log('Discord login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>
            🏗️
          </Text>
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
          />
          <Button
            title="Continue with Discord"
            onPress={handleDiscordLogin}
            variant="outline"
            fullWidth
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
  logo: {
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
