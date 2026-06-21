import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useAuthStore } from '../store/auth-store';
import { supabase } from '../services/supabase';
import { Button, Card } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';

export function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);

  const [projectCount, setProjectCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { count: pCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      if (pCount !== null) setProjectCount(pCount);

      if (user) {
        const { count: mCount } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true })
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
        if (mCount !== null) setMatchCount(mCount);
      }

      const { data } = await supabase
        .from('projects')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setRecentProjects(data);
    };
    fetchStats();
  }, [user]);

  const userName = user?.user_metadata?.user_name || 'Builder';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.onBackground }]}>
            Welcome, {userName}!
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Ready to build something insane?
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card variant="filled" padding={m3Spacing.md} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{projectCount}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Projects</Text>
          </Card>
          <Card variant="filled" padding={m3Spacing.md} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{matchCount}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Matches</Text>
          </Card>
          <Card variant="filled" padding={m3Spacing.md} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>#{user?.id?.slice(0, 4).toUpperCase() || '---'}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Builder ID</Text>
          </Card>
        </View>

        {/* Quick Actions */}
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
        </View>

        {/* Recent Projects */}
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Recent Projects</Text>
        {recentProjects.length === 0 ? (
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
              onPress={() => navigation.getParent()?.navigate('ProjectDetail', { projectId: p.id })}
            >
              <Text style={[styles.recentTitle, { color: colors.onSurface }]}>{p.title}</Text>
              <Text style={[styles.recentDate, { color: colors.onSurfaceVariant }]}>
                {new Date(p.created_at).toLocaleDateString()}
              </Text>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: m3Spacing.lg },
  header: { marginBottom: m3Spacing.lg },
  greeting: { ...m3Typography.headlineSmall },
  subtitle: { ...m3Typography.bodyLarge, marginTop: m3Spacing.xs },
  statsRow: { flexDirection: 'row', gap: m3Spacing.sm, marginBottom: m3Spacing.lg },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { ...m3Typography.headlineSmall, fontWeight: '700' },
  statLabel: { ...m3Typography.bodySmall, marginTop: 2 },
  sectionTitle: { ...m3Typography.titleMedium, marginBottom: m3Spacing.sm },
  actionGrid: { flexDirection: 'row', gap: m3Spacing.sm, marginBottom: m3Spacing.lg },
  actionBtn: { flex: 1 },
  emptyText: { ...m3Typography.bodyMedium, marginBottom: m3Spacing.md },
  recentCard: { marginBottom: m3Spacing.sm },
  recentTitle: { ...m3Typography.labelLarge },
  recentDate: { ...m3Typography.bodySmall, marginTop: 2 },
});
