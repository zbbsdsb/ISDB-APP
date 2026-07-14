import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Text} from '../ui/text';
import {useTheme} from '../../hooks/use-theme';
import {Card} from '../ui';
import {m3Typography} from '../../constants/m3-typography';
import {m3Spacing} from '../../constants/m3-spacing';

interface ReadmeBlockProps {
  config: Record<string, any>;
}

export default function ReadmeBlock({config}: ReadmeBlockProps) {
  const {colors} = useTheme();
  const content: string = config?.content || '';

  return (
    <Card variant="elevated" padding={m3Spacing.md} style={styles.card}>
      <Text variant="title" style={[styles.title, {color: colors.onBackground}]}>README</Text>
      <ScrollView style={styles.contentScroll} nestedScrollEnabled>
        <Text
          variant="body"
          style={[styles.content, {color: colors.onSurfaceVariant}]}
          selectable>
          {content || 'No README content yet'}
        </Text>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: m3Spacing.md, maxHeight: 300},
  title: {...m3Typography.titleSmall, marginBottom: m3Spacing.sm},
  contentScroll: {maxHeight: 240},
  content: {...m3Typography.bodyMedium},
});
