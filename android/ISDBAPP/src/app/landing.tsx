import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Button } from '../components/ui';

interface LandingScreenProps {
  onLogin: () => void;
}

export function LandingScreen({ onLogin }: LandingScreenProps) {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Insane Dream Builder
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Build Something Insane
          </Text>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.heroText, { color: colors.primary }]}>
            🏗️
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Get Started"
            onPress={onLogin}
            size="lg"
            fullWidth
          />
          <Text style={[styles.terms, { color: colors.textSecondary }]}>
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  heroText: {
    fontSize: 120,
  },
  actions: {
    marginBottom: 40,
    gap: 16,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
  },
});
