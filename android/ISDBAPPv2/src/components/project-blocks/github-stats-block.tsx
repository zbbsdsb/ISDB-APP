import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Card } from '../ui';
import { m3Typography } from '../../constants/m3-typography';
import { m3Spacing } from '../../constants/m3-spacing';

interface GithubStatsBlockProps {
  config: Record<string, any>;
}

export default function GithubStatsBlock({ config }: GithubStatsBlockProps) {
  const { colors } = useTheme();
  const repoUrl: string = config?.repo_url || '';

  return (
    <Card variant="elevated" padding={m3Spacing.md} style={styles.card}>
      <Text style={[styles.title, { color: colors.onBackground }]}>GitHub</Text>
      {repoUrl ? (
        <Text
          style={[styles.link, { color: colors.primary }]}
          onPress={() => Linking.openURL(repoUrl)}
        >
          {repoUrl}
        </Text>
      ) : (
        <Text style={[styles.hint, { color: colors.onSurfaceVariant }]}>
          No GitHub repo linked
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: m3Spacing.md },
  title: { ...m3Typography.titleSmall, marginBottom: m3Spacing.sm },
  link: { ...m3Typography.bodyMedium, textDecorationLine: 'underline' },
  hint: { ...m3Typography.bodyMedium, fontStyle: 'italic' },
});