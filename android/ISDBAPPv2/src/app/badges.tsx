import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Share, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useBadges, TIER_COLORS } from '../hooks/use-badges';
import { Button, Icon } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import { m3Shape } from '../constants/m3-shape';

export function BadgesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { badges, userBadges, loading } = useBadges();

  const unlockedCount = badges.filter((b) => userBadges.has(b.id)).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title=""
          onPress={() => navigation.goBack()}
          variant="text"
          icon={<Icon name="back" size="sm" color={colors.onBackground} />}
        />
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Badges</Text>
        <View style={{ width: 48 }} />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Stats */}
          <Text style={[styles.statsText, { color: colors.onSurfaceVariant }]}>
            Unlocked {unlockedCount} / {badges.length} badges
          </Text>

          {/* Badge grid */}
          <View style={styles.grid}>
            {badges.map((badge) => {
              const unlocked = userBadges.has(badge.id);
              return (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    {
                      backgroundColor: unlocked ? colors.surface : colors.surfaceVariant,
                      opacity: unlocked ? 1 : 0.5,
                      borderColor: unlocked ? TIER_COLORS[badge.tier] || colors.outline : colors.outline,
                    },
                  ]}
                >
                  {badge.image_url ? (
                    <Image source={{ uri: badge.image_url }} style={styles.badgeImage} />
                  ) : (
                    <View style={[styles.badgePlaceholder, { backgroundColor: TIER_COLORS[badge.tier] || colors.primary }]}>
                      <Text style={styles.badgePlaceholderText}>🏆</Text>
                    </View>
                  )}
                  <Text
                    style={[styles.badgeName, { color: unlocked ? colors.onBackground : colors.onSurfaceVariant }]}
                    numberOfLines={2}
                  >
                    {badge.name}
                  </Text>
                  <Text style={[styles.badgeDesc, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                    {badge.description}
                  </Text>
                  <Text style={[styles.badgeTier, { color: TIER_COLORS[badge.tier] || colors.onSurfaceVariant }]}>
                    {badge.tier?.toUpperCase()}
                  </Text>
                </View>
              );
            })}
          </View>

          {badges.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
              No badges available yet
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: m3Spacing.xs, height: 56,
  },
  headerTitle: { ...m3Typography.titleMedium },
  scrollContent: { padding: m3Spacing.lg },
  statsText: { ...m3Typography.bodyLarge, textAlign: 'center', marginBottom: m3Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: m3Spacing.md, justifyContent: 'center' },
  badgeCard: {
    width: '45%', maxWidth: 160,
    borderWidth: 2, borderRadius: m3Shape.medium,
    padding: m3Spacing.md, alignItems: 'center',
  },
  badgeImage: { width: 64, height: 64, borderRadius: 32, marginBottom: m3Spacing.sm },
  badgePlaceholder: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: m3Spacing.sm },
  badgePlaceholderText: { fontSize: 32 },
  badgeName: { ...m3Typography.labelLarge, textAlign: 'center', marginBottom: m3Spacing.xs },
  badgeDesc: { ...m3Typography.bodySmall, textAlign: 'center', marginBottom: m3Spacing.xs },
  badgeTier: { ...m3Typography.labelSmall, fontWeight: '700' },
  emptyText: { ...m3Typography.bodyLarge, textAlign: 'center', marginTop: m3Spacing.xl },
});