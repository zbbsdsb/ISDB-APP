import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Button } from '../ui';
import { m3Typography } from '../../constants/m3-typography';
import { m3Spacing } from '../../constants/m3-spacing';
import { m3Shape } from '../../constants/m3-shape';

interface PostCreateProps {
  onSubmit: (content: string) => Promise<void>;
}

export default function PostCreate({ onSubmit }: PostCreateProps) {
  const { colors } = useTheme();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    await onSubmit(content.trim());
    setContent('');
    setSubmitting(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
      <TextInput
        style={[styles.input, { color: colors.onBackground, backgroundColor: colors.surfaceVariant }]}
        value={content}
        onChangeText={setContent}
        placeholder="Share an update..."
        placeholderTextColor={colors.onSurfaceVariant}
        multiline
        numberOfLines={3}
      />
      <Button
        title="Post"
        onPress={handleSubmit}
        variant="filled"
        size="sm"
        disabled={!content.trim() || submitting}
        loading={submitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: m3Spacing.md, borderWidth: 1, borderRadius: m3Shape.medium, padding: m3Spacing.sm },
  input: {
    ...m3Typography.bodyMedium,
    borderRadius: m3Shape.small,
    padding: m3Spacing.sm,
    marginBottom: m3Spacing.sm,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});