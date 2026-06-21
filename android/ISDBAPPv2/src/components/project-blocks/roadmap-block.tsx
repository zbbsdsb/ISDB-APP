import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {Card} from '../ui';
import {m3Typography} from '../../constants/m3-typography';
import {m3Spacing} from '../../constants/m3-spacing';
import {m3Shape} from '../../constants/m3-shape';
import type {Milestone} from '@isdb/shared';

interface RoadmapBlockProps {
  config: Record<string, any>;
}

const STATUS_COLORS: Record<string, string> = {
  planned: '#94a3b8',
  in_progress: '#3b82f6',
  completed: '#22c55e',
};

const STATUS_LABELS: Record<string, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function RoadmapBlock({config}: RoadmapBlockProps) {
  const {colors} = useTheme();
  const milestones: Milestone[] = config?.milestones || [];

  return (
    <Card variant="elevated" padding={m3Spacing.md} style={styles.card}>
      <Text style={[styles.title, {color: colors.onBackground}]}>Roadmap</Text>
      {milestones.length === 0 ? (
        <Text style={[styles.emptyText, {color: colors.onSurfaceVariant}]}>
          No milestones yet
        </Text>
      ) : (
        milestones.map((ms, idx) => (
          <View key={ms.id || idx} style={styles.milestoneRow}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: STATUS_COLORS[ms.status] || '#94a3b8'},
              ]}
            />
            <View style={styles.milestoneContent}>
              <Text
                style={[styles.milestoneTitle, {color: colors.onBackground}]}>
                {ms.title}
              </Text>
              {ms.description && (
                <Text
                  style={[
                    styles.milestoneDesc,
                    {color: colors.onSurfaceVariant},
                  ]}>
                  {ms.description}
                </Text>
              )}
              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        (STATUS_COLORS[ms.status] || '#94a3b8') + '20',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      {color: STATUS_COLORS[ms.status] || '#94a3b8'},
                    ]}>
                    {STATUS_LABELS[ms.status] || ms.status}
                  </Text>
                </View>
                {ms.target_date && (
                  <Text
                    style={[styles.dateText, {color: colors.onSurfaceVariant}]}>
                    {new Date(ms.target_date).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: m3Spacing.md},
  title: {...m3Typography.titleSmall, marginBottom: m3Spacing.sm},
  emptyText: {...m3Typography.bodyMedium, fontStyle: 'italic'},
  milestoneRow: {flexDirection: 'row', marginBottom: m3Spacing.md},
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: m3Spacing.sm,
  },
  milestoneContent: {flex: 1},
  milestoneTitle: {...m3Typography.labelLarge, marginBottom: 2},
  milestoneDesc: {...m3Typography.bodySmall, marginBottom: m3Spacing.xs},
  metaRow: {flexDirection: 'row', alignItems: 'center', gap: m3Spacing.sm},
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: m3Shape.small,
  },
  statusText: {...m3Typography.labelSmall, fontWeight: '600'},
  dateText: {...m3Typography.bodySmall},
});
