import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Card } from '../ui';
import { m3Typography } from '../../constants/m3-typography';
import { m3Spacing } from '../../constants/m3-spacing';

interface TeamBlockProps {
  config: Record<string, any>;
  projectId: string;
}

export default function TeamBlock({ config }: TeamBlockProps) {
  const { colors } = useTheme();
  const showRoles = config?.show_roles !== false;
  const maxDisplay = config?.max_display || 5;

  // Team data would come from a join on project_members; for now show placeholder
  return (
    <Card variant="elevated" padding={m3Spacing.md} style={styles.card}>
      <Text style={[styles.title, { color: colors.onBackground }]}>Team</Text>
      <Text style={[styles.hint, { color: colors.onSurfaceVariant }]}>
        Team members will appear here
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: m3Spacing.md },
  title: { ...m3Typography.titleSmall, marginBottom: m3Spacing.sm },
  hint: { ...m3Typography.bodyMedium, fontStyle: 'italic' },
});