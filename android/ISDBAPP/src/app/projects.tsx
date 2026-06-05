import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Button, Card } from '../components/ui';
import type { Project } from '../types';

export function ProjectsScreen() {
  const { colors } = useTheme();

  const projects: Project[] = [];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Projects Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Create your first project to get started
      </Text>
      <Button
        title="Create Project"
        onPress={() => {}}
        style={{ marginTop: 16 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Projects
        </Text>
        <Button
          title="+ New"
          onPress={() => {}}
          size="sm"
        />
      </View>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.projectCard}>
            <Text style={[styles.projectTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text
              style={[styles.projectDesc, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  projectCard: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 14,
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
