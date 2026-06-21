import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useAuthStore } from '../store/auth-store';
import { useProfile } from '../hooks/use-profile';
import { useBadges } from '../hooks/use-badges';
import { supabase } from '../services/supabase';
import { Button, Card, Avatar, Skeleton, Badge } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import { m3Shape } from '../constants/m3-shape';

interface ActivityItem {
  id: string;
  type: 'project_created' | 'match' | 'badge' | 'member_joined';
  text: string;
  timestamp: string;
}

export function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const { getProfile } = useProfile();

  // Stats
  const [projectCount, setProjectCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);

  // Profile
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Data
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Badges
  const { badges, userBadges, loading: badgesLoading } = useBadges();
  const unlockedBadges = badges.filter((b) => userBadges.has(b.id));
  const topBadges = unlockedBadges.slice(0, 4);

  // Stats card press animations
  const statsScale = React.useRef(new Animated.Value(1)).current;

  const animateStats = () => {
    Animated.sequence([
      Animated.spring(statsScale, { toValue: 1.02, useNativeDriver: true, speed: 40 }),
      Animated.spring(statsScale, { toValue: 1, useNativeDriver: true, speed: 40 }),
    ]).start();
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);

    try {
      // Stats
      const { count: pCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      if (pCount !== null) setProjectCount(pCount);

      const { count: mCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      if (mCount !== null) setMatchCount(mCount);

      // Online count (try/catch — table may not exist)
      try {
        const { count: oCount } = await supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());
        if (oCount !== null) setOnlineCount(oCount);
      } catch {
        // presence table might not exist, silently skip
      }

      // Recent projects
      const { data: recent } = await supabase
        .from('projects')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      if (recent) setRecentProjects(recent);

      // Recommended projects (randomized by fetching latest and shuffling)
      const { data: recs } = await supabase
        .from('projects')
        .select('id, title, hook_text, description')
        .order('created_at', { ascending: false })
        .limit(6);
      if (recs) {
        const shuffled = [...recs].sort(() => Math.random() - 0.5).slice(0, 3);
        setRecommendedProjects(shuffled);
      }

      // Activity feed — recent projects + matches
      const activitiesList: ActivityItem[] = [];

      if (recent) {
        recent.slice(0, 3).forEach((p: any) => {
          activitiesList.push({
            id: `p-${p.id}`,
            type: 'project_created',
            text: `Created project "${p.title}"`,
            timestamp: p.created_at,
          });
        });
      }

      const { data: recentMatches } = await supabase
        .from('matches')
        .select('id, created_at, project:projects!project_id(title)')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentMatches) {
        recentMatches.forEach((m: any) => {
          if (m.project?.title) {
            activitiesList.push({
              id: `m-${m.id}`,
              type: 'match',
              text: `Matched with project "${m.project.title}"`,
              timestamp: m.created_at,
            });
          }
        });
      }

      // Sort by timestamp descending
      activitiesList.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      setActivities(activitiesList.slice(0, 5));
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reload profile
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      setProfileLoading(true);
      getProfile(user.id).then((data) => {
        setProfile(data);
        setProfileLoading(false);
      });
    }, [user?.id, getProfile]),
  );

  const userName = profile?.display_name || user?.user_metadata?.user_name || 'Builder';
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const bio = profile?.bio;
  const skills = profile?.skills || [];
  const builderId = user?.id?.slice(0, 4).toUpperCase() || '---';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.onBackground }]}>
              Welcome, {userName}!
            </Text>
            <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
              Ready to build something insane?
            </Text>
          </View>
          {onlineCount !== null && (
            <View style={styles.onlineBadge}>
              <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.onlineText, { color: colors.onSurfaceVariant }]}>
                {onlineCount} online
              </Text>
            </View>
          )}
        </View>

        {/* ── Stats Row ── */}
        <TouchableOpacity activeOpacity={1} onPress={animateStats}>
          <Animated.View style={[styles.statsRow, { transform: [{ scale: statsScale }] }]}>
            <Card variant="filled" padding={m3Spacing.md} style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{projectCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Projects</Text>
            </Card>
            <Card variant="filled" padding={m3Spacing.md} style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{matchCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Matches</Text>
            </Card>
            <Card variant="filled" padding={m3Spacing.md} style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>#{builderId}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Builder ID</Text>
            </Card>
          </Animated.View>
        </TouchableOpacity>

        {/* ── Builder Identity Card ── */}
        <Card variant="elevated" padding={m3Spacing.lg} style={styles.identityCard}>
          {profileLoading ? (
            <View style={styles.identitySkeleton}>
              <Skeleton variant="circular" width={60} height={60} />
              <View style={{ flex: 1, marginLeft: m3Spacing.md }}>
                <Skeleton width="60%" height={18} style={{ marginBottom: 6 }} />
                <Skeleton width="40%" height={14} />
              </View>
            </View>
          ) : (
            <View style={styles.identityContent}>
              <Avatar source={userAvatar ? { uri: userAvatar } : null} size={60} />
              <View style={styles.identityInfo}>
                <Text style={[styles.identityName, { color: colors.onSurface }]}>
                  {userName}
                </Text>
                {profile?.username && (
                  <Text style={[styles.identityUsername, { color: colors.onSurfaceVariant }]}>
                    @{profile.username}
                  </Text>
                )}
                {bio && (
                  <Text
                    style={[styles.identityBio, { color: colors.onSurfaceVariant }]}
                    numberOfLines={2}
                  >
                    {bio}
                  </Text>
                )}
                {/* Badge preview */}
                {!badgesLoading && topBadges.length > 0 && (
                  <View style={styles.badgeRow}>
                    {topBadges.map((b) => {
                      const badgeColor: 'warning' | 'secondary' | 'primary' | 'tertiary' =
                        b.tier === 'gold' ? 'warning' :
                        b.tier === 'silver' ? 'secondary' : 'tertiary';
                      return (
                        <Badge
                          key={b.id}
                          label={b.name}
                          size="sm"
                          color={badgeColor}
                        />
                      );
                    })}
                    {unlockedBadges.length > 4 && (
                      <Text style={[styles.moreBadges, { color: colors.onSurfaceVariant }]}>
                        +{unlockedBadges.length - 4}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}
        </Card>

        {/* ── Today's Stack (Recommended) ── */}
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Today's Stack</Text>
        {dataLoading ? (
          <View style={styles.recSkeletonRow}>
            <Skeleton width="48%" height={120} borderRadius={m3Shape.medium} />
            <Skeleton width="48%" height={120} borderRadius={m3Shape.medium} />
          </View>
        ) : recommendedProjects.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recScroll}>
            {recommendedProjects.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() =>
                  navigation.getParent()?.navigate('ProjectDetail', { projectId: p.id })
                }
              >
                <Card variant="elevated" padding={m3Spacing.md} style={styles.recCard}>
                  <Text
                    style={[styles.recTitle, { color: colors.onSurface }]}
                    numberOfLines={2}
                  >
                    {p.title}
                  </Text>
                  {p.hook_text && (
                    <Text
                      style={[styles.recHook, { color: colors.primary }]}
                      numberOfLines={1}
                    >
                      {p.hook_text}
                    </Text>
                  )}
                  <Text
                    style={[styles.recDesc, { color: colors.onSurfaceVariant }]}
                    numberOfLines={2}
                  >
                    {p.description}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            No recommendations yet
          </Text>
        )}

        {/* ── Activity Feed ── */}
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Recent Activity</Text>
        {dataLoading ? (
          <View>
            <Skeleton width="100%" height={48} style={{ marginBottom: m3Spacing.sm }} />
            <Skeleton width="100%" height={48} style={{ marginBottom: m3Spacing.sm }} />
            <Skeleton width="100%" height={48} />
          </View>
        ) : activities.length > 0 ? (
          <Card variant="filled" padding={m3Spacing.md} style={styles.activityCard}>
            {activities.map((item, idx) => (
              <View key={item.id}>
                <View style={styles.activityRow}>
                  <View
                    style={[
                      styles.activityDot,
                      {
                        backgroundColor:
                          item.type === 'project_created'
                            ? colors.primary
                            : item.type === 'match'
                            ? colors.tertiary
                            : colors.secondary,
                      },
                    ]}
                  />
                  <Text style={[styles.activityText, { color: colors.onSurface }]}>
                    {item.text}
                  </Text>
                </View>
                {idx < activities.length - 1 && (
                  <View style={[styles.activityDivider, { backgroundColor: colors.outlineVariant }]} />
                )}
              </View>
            ))}
          </Card>
        ) : (
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            No recent activity
          </Text>
        )}

        {/* ── Quick Actions ── */}
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <Button
            title="Discover Projects"
            onPress={() => navigation.navigate('Swipe')}
            variant="filled"
            size="md"
            style={styles.actionBtn}
          />
          <Button
            title="My Groups"
            onPress={() => navigation.getParent()?.navigate('GroupCreate')}
            variant="tonal"
            size="md"
            style={styles.actionBtn}
          />
          <Button
            title="Gathering"
            onPress={() => navigation.getParent()?.navigate('Gathering')}
            variant="outlined"
            size="md"
            style={styles.actionBtn}
          />
        </View>

        {/* ── Recent Projects ── */}
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Recent Projects</Text>
        {dataLoading ? (
          <View>
            <Skeleton width="100%" height={72} style={{ marginBottom: m3Spacing.sm }} />
            <Skeleton width="100%" height={72} style={{ marginBottom: m3Spacing.sm }} />
          </View>
        ) : recentProjects.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            No projects yet. Be the first to create one!
          </Text>
        ) : (
          recentProjects.map((p) => (
            <Card
              key={p.id}
              variant="elevated"
              padding={m3Spacing.md}
              style={styles.recentCard}
              onPress={() =>
                navigation.getParent()?.navigate('ProjectDetail', { projectId: p.id })
              }
            >
              <Text style={[styles.recentTitle, { color: colors.onSurface }]}>{p.title}</Text>
              <Text style={[styles.recentDate, { color: colors.onSurfaceVariant }]}>
                {new Date(p.created_at).toLocaleDateString()}
              </Text>
            </Card>
          ))
        )}

        {/* Bottom spacer */}
        <View style={{ height: m3Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: m3Spacing.lg },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: m3Spacing.lg,
  },
  greeting: { ...m3Typography.headlineSmall },
  subtitle: { ...m3Typography.bodyLarge, marginTop: m3Spacing.xs },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  onlineText: { ...m3Typography.labelSmall },

  // Stats
  statsRow: { flexDirection: 'row', gap: m3Spacing.sm, marginBottom: m3Spacing.lg },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { ...m3Typography.headlineSmall, fontWeight: '700' },
  statLabel: { ...m3Typography.bodySmall, marginTop: 2 },

  // Identity Card
  identityCard: { marginBottom: m3Spacing.lg },
  identitySkeleton: { flexDirection: 'row', alignItems: 'center' },
  identityContent: { flexDirection: 'row' },
  identityInfo: { flex: 1, marginLeft: m3Spacing.md },
  identityName: { ...m3Typography.titleMedium, fontWeight: '700' },
  identityUsername: { ...m3Typography.bodySmall, marginTop: 2 },
  identityBio: { ...m3Typography.bodySmall, marginTop: 4 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: m3Spacing.sm },
  moreBadges: { ...m3Typography.labelSmall, alignSelf: 'center' },

  // Today's Stack
  sectionTitle: { ...m3Typography.titleMedium, marginBottom: m3Spacing.sm, marginTop: m3Spacing.sm },
  recScroll: { marginBottom: m3Spacing.md },
  recSkeletonRow: { flexDirection: 'row', gap: m3Spacing.sm, marginBottom: m3Spacing.md },
  recCard: {
    width: 180,
    marginRight: m3Spacing.sm,
  },
  recTitle: { ...m3Typography.labelLarge, marginBottom: 4 },
  recHook: { ...m3Typography.labelSmall, fontStyle: 'italic', marginBottom: 4 },
  recDesc: { ...m3Typography.bodySmall },

  // Activity
  activityCard: { marginBottom: m3Spacing.md },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: m3Spacing.sm },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: m3Spacing.sm,
  },
  activityText: { ...m3Typography.bodySmall, flex: 1 },
  activityDivider: { height: 1, marginLeft: m3Spacing.md + 8 },

  // Quick Actions
  actionGrid: { flexDirection: 'row', gap: m3Spacing.sm, marginBottom: m3Spacing.lg },
  actionBtn: { flex: 1 },

  // Recent Projects
  emptyText: { ...m3Typography.bodyMedium, marginBottom: m3Spacing.md },
  recentCard: { marginBottom: m3Spacing.sm },
  recentTitle: { ...m3Typography.labelLarge },
  recentDate: { ...m3Typography.bodySmall, marginTop: 2 },
});