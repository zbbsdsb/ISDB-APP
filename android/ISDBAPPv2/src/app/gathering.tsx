import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {Text} from '../components/ui/text';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {supabase} from '../services/supabase';
import {Card, Skeleton} from '../components/ui';
import {m3Typography} from '../constants/m3-typography';
import {m3Spacing} from '../constants/m3-spacing';
import {m3Shape} from '../constants/m3-shape';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface ActivityItem {
  id: string;
  type: 'project_updated' | 'match' | 'member_joined';
  text: string;
  projectId?: string;
  timestamp: string;
}

interface ActiveProject {
  id: string;
  title: string;
  hook_text?: string;
  updated_at: string;
}

export function GatheringScreen() {
  const {colors} = useTheme();
  const navigation = useNavigation<NavProp>();

  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Online count
      try {
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const {count} = await supabase
          .from('sessions')
          .select('*', {count: 'exact', head: true})
          .gte('created_at', fiveMinAgo);
        if (count !== null) {
          setOnlineCount(count);
        }
      } catch {
        // sessions table may not exist
      }

      // Recent activities — mix of project updates and matches
      const activityItems: ActivityItem[] = [];

      const {data: recentProjects} = await supabase
        .from('projects')
        .select('id, title, updated_at')
        .order('updated_at', {ascending: false})
        .limit(5);

      if (recentProjects) {
        recentProjects.forEach(p => {
          activityItems.push({
            id: `p-${p.id}`,
            type: 'project_updated',
            text: `Project updated: "${p.title}"`,
            projectId: p.id,
            timestamp: p.updated_at,
          });
        });
      }

      const {data: recentMatches} = await supabase
        .from('matches')
        .select('id, created_at, project:projects!project_id(title)')
        .order('created_at', {ascending: false})
        .limit(5);

      if (recentMatches) {
        recentMatches.forEach((m: any) => {
          if (m.project?.title) {
            activityItems.push({
              id: `m-${m.id}`,
              type: 'match',
              text: `Matched with "${m.project.title}"`,
              timestamp: m.created_at,
            });
          }
        });
      }

      // Sort by timestamp descending
      activityItems.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      setActivities(activityItems.slice(0, 10));

      // Active projects (recently updated)
      if (recentProjects) {
        setActiveProjects(recentProjects.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching gathering data:', err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="heading" style={[styles.title, {color: colors.onBackground}]}>
            Gathering
          </Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text variant="label" style={[styles.refreshBtn, {color: colors.primary}]}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Online count ── */}
        <Card
          variant="elevated"
          padding={m3Spacing.lg}
          style={styles.onlineCard}>
          {loading ? (
            <View style={styles.loadingCenter}>
              <Skeleton width={80} height={36} />
              <Skeleton
                width={120}
                height={16}
                style={{marginTop: m3Spacing.xs}}
              />
            </View>
          ) : (
            <>
              <View style={styles.onlineDotsRow}>
                {Array.from({length: Math.min(onlineCount || 0, 5)}).map(
                  (_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.onlineDot,
                        {backgroundColor: colors.primary, opacity: 1 - i * 0.1},
                      ]}
                    />
                  ),
                )}
              </View>
              <Text variant="heading" style={[styles.onlineCount, {color: colors.onBackground}]}>
                {onlineCount ?? '—'}
              </Text>
              <Text variant="body"
                style={[styles.onlineLabel, {color: colors.onSurfaceVariant}]}>
                Builders Online Now
              </Text>
            </>
          )}
        </Card>

        {/* ── Recent Activity ── */}
        <Text variant="title" style={[styles.sectionTitle, {color: colors.onBackground}]}>
          Recent Activity
        </Text>
        {loading ? (
          <View>
            <Skeleton
              width="100%"
              height={48}
              style={{marginBottom: m3Spacing.sm}}
            />
            <Skeleton
              width="100%"
              height={48}
              style={{marginBottom: m3Spacing.sm}}
            />
            <Skeleton width="100%" height={48} />
          </View>
        ) : activities.length > 0 ? (
          <Card
            variant="filled"
            padding={m3Spacing.md}
            style={styles.activityCard}>
            {activities.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.projectId) {
                    navigation.navigate('ProjectDetail', {
                      projectId: item.projectId,
                    });
                  }
                }}>
                <View style={styles.activityRow}>
                  <Text variant="body" style={styles.activityIcon}>
                    {item.type === 'project_updated'
                      ? '📋'
                      : item.type === 'match'
                      ? '🤝'
                      : '👤'}
                  </Text>
                  <Text variant="body"
                    style={[styles.activityText, {color: colors.onSurface}]}>
                    {item.text}
                  </Text>
                </View>
                {idx < activities.length - 1 && (
                  <View
                    style={[
                      styles.activityDivider,
                      {backgroundColor: colors.outlineVariant},
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </Card>
        ) : (
          <Text variant="body" style={[styles.emptyText, {color: colors.onSurfaceVariant}]}>
            No recent activity
          </Text>
        )}

        {/* ── Active Projects ── */}
        <Text variant="title" style={[styles.sectionTitle, {color: colors.onBackground}]}>
          Active Projects
        </Text>
        {loading ? (
          <View style={styles.projectsSkeletonRow}>
            <Skeleton width="48%" height={100} borderRadius={m3Shape.medium} />
            <Skeleton width="48%" height={100} borderRadius={m3Shape.medium} />
          </View>
        ) : activeProjects.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.projectsScroll}>
            {activeProjects.map(p => (
              <TouchableOpacity
                key={p.id}
                onPress={() =>
                  navigation.navigate('ProjectDetail', {projectId: p.id})
                }>
                <Card
                  variant="elevated"
                  padding={m3Spacing.md}
                  style={styles.projectCard}>
                  <Text variant="label"
                    style={[styles.projectTitle, {color: colors.onSurface}]}
                    numberOfLines={2}>
                    {p.title}
                  </Text>
                  <Text variant="caption"
                    style={[
                      styles.projectTime,
                      {color: colors.onSurfaceVariant},
                    ]}>
                    {new Date(p.updated_at).toLocaleDateString()}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text variant="body" style={[styles.emptyText, {color: colors.onSurfaceVariant}]}>
            No active projects
          </Text>
        )}

        {/* Bottom spacer */}
        <View style={{height: m3Spacing.xl}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {padding: m3Spacing.lg},
  loadingCenter: {alignItems: 'center'},

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: m3Spacing.lg,
  },
  title: {...m3Typography.headlineSmall, fontWeight: '700'},
  refreshBtn: {...m3Typography.labelLarge, fontWeight: '600'},

  // Online count
  onlineCard: {alignItems: 'center', marginBottom: m3Spacing.lg},
  onlineDotsRow: {flexDirection: 'row', gap: 6, marginBottom: m3Spacing.sm},
  onlineDot: {width: 12, height: 12, borderRadius: 6},
  onlineCount: {...m3Typography.displaySmall, fontWeight: '700'},
  onlineLabel: {...m3Typography.bodyLarge, marginTop: m3Spacing.xs},

  // Activity
  sectionTitle: {
    ...m3Typography.titleMedium,
    marginBottom: m3Spacing.sm,
    marginTop: m3Spacing.sm,
  },
  activityCard: {marginBottom: m3Spacing.md},
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: m3Spacing.sm,
  },
  activityIcon: {fontSize: 16, marginRight: m3Spacing.sm},
  activityText: {...m3Typography.bodySmall, flex: 1},
  activityDivider: {height: 1, marginLeft: 28},
  emptyText: {...m3Typography.bodyMedium, marginBottom: m3Spacing.md},

  // Projects
  projectsSkeletonRow: {
    flexDirection: 'row',
    gap: m3Spacing.sm,
    marginBottom: m3Spacing.md,
  },
  projectsScroll: {marginBottom: m3Spacing.md},
  projectCard: {width: 160, marginRight: m3Spacing.sm},
  projectTitle: {...m3Typography.labelLarge, fontWeight: '600'},
  projectTime: {...m3Typography.bodySmall, marginTop: m3Spacing.xs},
});
