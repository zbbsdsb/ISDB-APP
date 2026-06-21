import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Avatar, Card } from '../ui';
import { m3Typography } from '../../constants/m3-typography';
import { m3Spacing } from '../../constants/m3-spacing';
import { m3Shape } from '../../constants/m3-shape';
import type { ProjectPost } from '@isdb/shared';

interface PostCardProps {
  post: ProjectPost;
}

const TYPE_LABELS: Record<string, string> = {
  update: 'Update',
  milestone: 'Milestone',
  issue: 'Issue',
  link: 'Link',
};

export default function PostCard({ post }: PostCardProps) {
  const { colors } = useTheme();

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '';

  return (
    <Card variant="filled" padding={m3Spacing.md} style={styles.card}>
      <View style={styles.header}>
        {post.type && (
          <View style={[styles.typeBadge, { backgroundColor: colors.secondaryContainer }]}>
            <Text style={[styles.typeText, { color: colors.onSecondaryContainer }]}>
              {TYPE_LABELS[post.type] || post.type}
            </Text>
          </View>
        )}
        <Text style={[styles.dateText, { color: colors.onSurfaceVariant }]}>{formattedDate}</Text>
      </View>
      <Text style={[styles.content, { color: colors.onSurface }]}>{post.content}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: m3Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: m3Spacing.sm },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: m3Shape.small },
  typeText: { ...m3Typography.labelSmall, fontWeight: '600' },
  dateText: { ...m3Typography.bodySmall },
  content: { ...m3Typography.bodyMedium },
});