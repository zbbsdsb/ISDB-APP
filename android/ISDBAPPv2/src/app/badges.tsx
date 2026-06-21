import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Modal, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useBadges, TIER_COLORS } from '../hooks/use-badges';
import { Button, Icon, Skeleton } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import { m3Shape } from '../constants/m3-shape';

export function BadgesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { badges, userBadges, loading } = useBadges();

  const unlockedCount = badges.filter((b) => userBadges.has(b.id)).length;

  // ── Celebration modal state ──
  const [prevCount, setPrevCount] = useState(-1);
  const [celebratingBadge, setCelebratingBadge] = useState<any>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) return;

    // First load — just record the count
    if (prevCount === -1) {
      setPrevCount(unlockedCount);
      return;
    }

    // Count increased — find the newly unlocked badge
    if (unlockedCount > prevCount) {
      const currentUnlocked = badges.filter((b) => userBadges.has(b.id));
      // Find a badge that was not in the previous set: assume it's the last one sorted
      const newlyUnlocked = currentUnlocked[currentUnlocked.length - 1];
      if (newlyUnlocked) {
        setCelebratingBadge(newlyUnlocked);
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
      }
      setPrevCount(unlockedCount);
    }
  }, [unlockedCount, loading]);

  const closeCelebration = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setCelebratingBadge(null);
    });
  };

  // Auto-close after 3 seconds
  useEffect(() => {
    if (!celebratingBadge) return;
    const timer = setTimeout(closeCelebration, 3000);
    return () => clearTimeout(timer);
  }, [celebratingBadge]);

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
          <Skeleton variant="rectangular" width={120} height={32} style={{ marginBottom: m3Spacing.lg }} />
          <View style={styles.grid}>
            <Skeleton variant="rectangular" width={150} height={180} />
            <Skeleton variant="rectangular" width={150} height={180} />
            <Skeleton variant="rectangular" width={150} height={180} />
            <Skeleton variant="rectangular" width={150} height={180} />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.statsText, { color: colors.onSurfaceVariant }]}>
            Unlocked {unlockedCount} / {badges.length} badges
          </Text>

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

      {/* ── Celebration Modal ── */}
      <Modal visible={!!celebratingBadge} transparent animationType="none" onRequestClose={closeCelebration}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeCelebration}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={[styles.celebrationTitle, { color: colors.onBackground }]}>
              New Badge Unlocked!
            </Text>

            {celebratingBadge && (
              <>
                <View style={[styles.celebrationBadgeIcon, { backgroundColor: TIER_COLORS[celebratingBadge.tier] || colors.primary }]}>
                  <Text style={styles.celebrationBadgeEmoji}>🏆</Text>
                </View>
                <Text style={[styles.celebrationBadgeName, { color: colors.onBackground }]}>
                  {celebratingBadge.name}
                </Text>
                <Text style={[styles.celebrationBadgeDesc, { color: colors.onSurfaceVariant }]}>
                  {celebratingBadge.description}
                </Text>
                <TouchableOpacity
                  style={[styles.celebrationButton, { backgroundColor: colors.primary }]}
                  onPress={closeCelebration}
                >
                  <Text style={[styles.celebrationButtonText, { color: colors.onPrimary }]}>
                    Awesome!
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
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

  // Celebration Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: m3Spacing.lg,
  },
  modalContent: {
    alignItems: 'center',
    borderRadius: m3Shape.large,
    padding: m3Spacing.xl,
    width: '100%',
    maxWidth: 320,
  },
  celebrationEmoji: { fontSize: 48, marginBottom: m3Spacing.sm },
  celebrationTitle: { ...m3Typography.titleLarge, fontWeight: '700', marginBottom: m3Spacing.lg },
  celebrationBadgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: m3Spacing.md,
  },
  celebrationBadgeEmoji: { fontSize: 40 },
  celebrationBadgeName: { ...m3Typography.titleMedium, fontWeight: '600', marginBottom: m3Spacing.sm, textAlign: 'center' },
  celebrationBadgeDesc: { ...m3Typography.bodyMedium, textAlign: 'center', marginBottom: m3Spacing.lg },
  celebrationButton: {
    borderRadius: m3Shape.small,
    paddingHorizontal: m3Spacing.xl,
    paddingVertical: m3Spacing.sm,
  },
  celebrationButtonText: { ...m3Typography.labelLarge, fontWeight: '600' },
});