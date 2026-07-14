import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../ui/text';
import {useTheme} from '../../hooks/use-theme';
import {Card} from '../ui';
import {m3Typography} from '../../constants/m3-typography';
import {m3Spacing} from '../../constants/m3-spacing';
import {m3Shape} from '../../constants/m3-shape';

interface SkillsBlockProps {
  config: Record<string, any>;
}

export default function SkillsBlock({config}: SkillsBlockProps) {
  const {colors} = useTheme();
  const required: string[] = config?.required || [];
  const preferred: string[] = config?.preferred || [];

  return (
    <Card variant="elevated" padding={m3Spacing.md} style={styles.card}>
      <Text variant="title" style={[styles.title, {color: colors.onBackground}]}>Skills</Text>

      {required.length > 0 && (
        <View style={styles.subSection}>
          <Text variant="label" style={[styles.subTitle, {color: colors.onSurfaceVariant}]}>
            Required
          </Text>
          <View style={styles.chipRow}>
            {required.map(s => (
              <View
                key={s}
                style={[
                  styles.chip,
                  {backgroundColor: colors.secondaryContainer},
                ]}>
                <Text
                  variant="label"
                  style={[
                    styles.chipText,
                    {color: colors.onSecondaryContainer},
                  ]}>
                  {s}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {preferred.length > 0 && (
        <View style={styles.subSection}>
          <Text variant="label" style={[styles.subTitle, {color: colors.onSurfaceVariant}]}>
            Preferred
          </Text>
          <View style={styles.chipRow}>
            {preferred.map(s => (
              <View
                key={s}
                style={[
                  styles.chip,
                  {backgroundColor: colors.tertiaryContainer},
                ]}>
                <Text
                  variant="label"
                  style={[
                    styles.chipText,
                    {color: colors.onTertiaryContainer},
                  ]}>
                  {s}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {required.length === 0 && preferred.length === 0 && (
        <Text variant="body" style={[styles.emptyText, {color: colors.onSurfaceVariant}]}>
          No skills specified
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: m3Spacing.md},
  title: {...m3Typography.titleSmall, marginBottom: m3Spacing.sm},
  subSection: {marginBottom: m3Spacing.sm},
  subTitle: {...m3Typography.labelMedium, marginBottom: m3Spacing.xs},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: m3Spacing.xs},
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: m3Shape.small,
  },
  chipText: {...m3Typography.labelSmall},
  emptyText: {...m3Typography.bodyMedium, fontStyle: 'italic'},
});
