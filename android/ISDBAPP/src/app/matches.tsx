import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Button } from '../components/ui';
import type { Match } from '../types';

export function MatchesScreen() {
  const { colors } = useTheme();

  const matches: Match[] = [];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Matches Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Start swiping to find your perfect collaborators
      </Text>
      <Button
        title="Start Swiping"
        onPress={() => {}}
        style={{ marginTop: 16 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Matches
        </Text>
      </View>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.matchCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.matchTitle, { color: colors.text }]}>
              {item.project?.title || 'Project'}
            </Text>
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
  matchCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
