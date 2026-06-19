import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { useProjects } from '../hooks/use-projects';
import { useMatches } from '../hooks/use-matches';
import { Button, Card } from '../components/ui';

export function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { getProfile } = useProfile();
  const { projects, fetchProjects } = useProjects(user?.id || '');
  const { outgoingMatches, fetchMatches } = useMatches(user?.id || '');

  const [builderId, setBuilderId] = useState<string>('---');
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
      fetchMatches();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      getProfile(user.id).then(profile => {
        if (profile) {
          const id = (profile as any)?.identity_number;
          setBuilderId(id ? `#${String(id).padStart(5, '0')}` : '---');
          setDisplayName((profile as any)?.display_name || user.email?.split('@')[0] || 'Builder');
        }
      });
    }
  }, [user?.id]);

  const greeting = displayName
    ? `Hi ${displayName}!`
    : 'Welcome back!';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            {greeting}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ready to build something insane?
          </Text>
        </View>

        <Card style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionGrid}>
            <Button
              title="Find Projects"
              onPress={() => {}}
              variant="primary"
            />
            <Button
              title="My Profile"
              onPress={() => {}}
              variant="outline"
            />
          </View>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Stats
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {projects.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Projects
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {outgoingMatches.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Matches
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {builderId}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Builder ID
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  quickActions: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
