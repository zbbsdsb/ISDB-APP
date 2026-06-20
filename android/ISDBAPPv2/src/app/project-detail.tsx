import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useProject } from '../hooks/use-project';
import { Button, Card, Icon } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import type { RootStackParamList } from '../navigation';

type ProjectDetailRouteProp = RouteProp<RootStackParamList, 'ProjectDetail'>;

export function ProjectDetailScreen() {
  const { colors } = useTheme();
  const route = useRoute<ProjectDetailRouteProp>();
  const navigation = useNavigation();
  const { projectId } = route.params;
  const { project, loading, error } = useProject(projectId);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !project) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <Icon name="close" size="lg" color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'Project not found'}
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="text"
          />
        </View>
      </SafeAreaView>
    );
  }

  const ownerName = project.owner?.display_name || project.owner?.username || 'Unknown';
  const progressRatio = project.sponsorship_goal
    ? Math.min(project.sponsorship_current / project.sponsorship_goal, 1)
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Button
          title=""
          onPress={() => navigation.goBack()}
          variant="text"
          icon={<Icon name="back" size="sm" color={colors.onBackground} />}
        />
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>
          Project
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title + Status */}
        <Text style={[styles.projectTitle, { color: colors.onBackground }]}>
          {project.title}
        </Text>
        {project.description && (
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
            {project.description}
          </Text>
        )}

        {/* Owner info card */}
        <Card variant="filled" padding={m3Spacing.md} style={styles.ownerCard}>
          <View style={styles.ownerRow}>
            <View style={[styles.ownerAvatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.ownerAvatarText, { color: colors.onPrimary }]}>
                {ownerName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={[styles.ownerName, { color: colors.onSurface }]}>
                {ownerName}
              </Text>
              {project.owner?.username && (
                <Text style={[styles.ownerUsername, { color: colors.onSurfaceVariant }]}>
                  @{project.owner.username}
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Tags */}
        {project.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
              Tags
            </Text>
            <View style={styles.chipRow}>
              {project.tags.map((tag) => (
                <View key={tag} style={[styles.chip, { backgroundColor: colors.secondaryContainer }]}>
                  <Text style={[styles.chipText, { color: colors.onSecondaryContainer }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Required Skills */}
        {project.required_skills.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
              Required Skills
            </Text>
            <View style={styles.chipRow}>
              {project.required_skills.map((skill) => (
                <View key={skill} style={[styles.chip, { backgroundColor: colors.tertiaryContainer }]}>
                  <Text style={[styles.chipText, { color: colors.onTertiaryContainer }]}>
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Looking for */}
        {project.looking_for && (
          <Card variant="elevated" padding={m3Spacing.md} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
              Looking For
            </Text>
            <Text style={[styles.bodyText, { color: colors.onSurfaceVariant }]}>
              {project.looking_for}
            </Text>
          </Card>
        )}

        {/* Sponsorship progress */}
        {project.sponsorship_enabled && project.sponsorship_goal && (
          <Card variant="elevated" padding={m3Spacing.md} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
              Sponsorship
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressRatio * 100}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.onSurfaceVariant }]}>
              ${project.sponsorship_current} / ${project.sponsorship_goal} raised
            </Text>
          </Card>
        )}

        {/* GitHub URL */}
        {project.github_url && (
          <Card variant="outlined" padding={m3Spacing.md} style={styles.section}>
            <View style={styles.linkRow}>
              <Icon name="github" size="sm" color={colors.onSurfaceVariant} />
              <Text style={[styles.linkText, { color: colors.primary }]}>
                {project.github_url}
              </Text>
            </View>
          </Card>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <Button
            title="Request to Collaborate"
            onPress={() => Alert.alert('Coming Soon', 'Collab request will be available soon')}
            variant="filled"
            size="lg"
            fullWidth
          />
          <Button
            title="Share"
            onPress={() => Alert.alert('Coming Soon', 'Sharing will be available soon')}
            variant="outlined"
            size="md"
            fullWidth
            icon={<Icon name="share" size="sm" color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: m3Spacing.md,
  },
  errorText: { ...m3Typography.bodyLarge, textAlign: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: m3Spacing.xs,
    height: 56,
  },
  headerTitle: { ...m3Typography.titleMedium },
  scrollContent: { padding: m3Spacing.lg, paddingBottom: m3Spacing.xxl },
  projectTitle: { ...m3Typography.headlineSmall, marginBottom: m3Spacing.xs },
  description: { ...m3Typography.bodyLarge, marginBottom: m3Spacing.lg },

  ownerCard: { marginBottom: m3Spacing.lg },
  ownerRow: { flexDirection: 'row', alignItems: 'center' },
  ownerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: m3Spacing.sm,
  },
  ownerAvatarText: { ...m3Typography.titleMedium, fontWeight: '700' },
  ownerInfo: { flex: 1 },
  ownerName: { ...m3Typography.labelLarge },
  ownerUsername: { ...m3Typography.bodySmall },

  section: { marginBottom: m3Spacing.lg },
  sectionTitle: { ...m3Typography.titleSmall, marginBottom: m3Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: m3Spacing.xs },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: { ...m3Typography.labelMedium },
  bodyText: { ...m3Typography.bodyMedium },

  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: m3Spacing.xs,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { ...m3Typography.bodySmall },

  linkRow: { flexDirection: 'row', alignItems: 'center', gap: m3Spacing.sm },
  linkText: { ...m3Typography.bodyMedium },

  actions: { gap: m3Spacing.sm, marginTop: m3Spacing.md },
});
