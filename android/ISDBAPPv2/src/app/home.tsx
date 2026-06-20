import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Button, Card } from '../components/ui';

export function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.onBackground }]}>
            Welcome back!
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Ready to build something insane?
          </Text>
        </View>

        <Card style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
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
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Your Stats
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>
                Projects
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>
                Matches
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>---</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>
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
