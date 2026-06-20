import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/use-theme';
import { supabase } from '../services/supabase';
import { Button, Card } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import type { Project } from '@isdb/shared';
import type { RootStackParamList } from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function ProjectsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*, owner:profiles!owner_id(username, display_name, avatar_url)')
          .order('created_at', { ascending: false });
        if (data) setProjects(data as unknown as Project[]);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.onBackground }]}>
        No Projects Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
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
        <Text style={[styles.title, { color: colors.onBackground }]}>
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
          <Card
            style={styles.projectCard}
            padding={m3Spacing.md}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
          >
            <Text style={[styles.projectTitle, { color: colors.onBackground }]}>
              {item.title}
            </Text>
            <Text
              style={[styles.projectDesc, { color: colors.onSurfaceVariant }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </Card>
        )}
        ListEmptyComponent={loading ? null : renderEmptyState}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => {}}
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
    paddingHorizontal: m3Spacing.lg,
    paddingVertical: m3Spacing.md,
  },
  title: {
    ...m3Typography.headlineSmall,
  },
  list: {
    padding: m3Spacing.lg,
    paddingTop: 0,
    flexGrow: 1,
  },
  projectCard: {
    marginBottom: 12,
  },
  projectTitle: {
    ...m3Typography.titleMedium,
    marginBottom: 4,
  },
  projectDesc: {
    ...m3Typography.bodyMedium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    ...m3Typography.titleLarge,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...m3Typography.bodyMedium,
    textAlign: 'center',
  },
});
