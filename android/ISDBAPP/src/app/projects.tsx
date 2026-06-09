import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { useProjects } from '../hooks/use-projects';
import { useTags } from '../hooks/use-tags';
import { Button, Card } from '../components/ui';
import { ProjectCard } from '../components/projects';
import type { Project, Profile } from '../types';

interface ProjectWithOwner extends Project {
  owner?: Profile;
}

export function ProjectsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { projects, loading, error, fetchProjects } = useProjects(user?.id);
  const { getTagNames } = useTags();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const availableTags = getTagNames();

  useEffect(() => {
    fetchProjects();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesFilter =
      !selectedFilter || (project.tags && project.tags.includes(selectedFilter));

    return matchesSearch && matchesFilter;
  });

  const renderProjectItem = ({ item }: { item: ProjectWithOwner }) => (
    <ProjectCard
      project={item}
      onPress={() => {
        // TODO: Navigate to project detail
      }}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>Projects</Text>
        {user && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              // TODO: Navigate to create project
            }}
          >
            <Text style={styles.createButtonText}>+ New</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="Search projects..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        horizontal
        data={availableTags.slice(0, 10)}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === item && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(selectedFilter === item ? null : item)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === item && styles.filterChipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🚀</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery || selectedFilter ? 'No matching projects' : 'No projects yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery || selectedFilter
          ? 'Try adjusting your filters'
          : 'Be the first to create a project!'}
      </Text>
      {user && !searchQuery && !selectedFilter && (
        <Button
          title="Create Project"
          onPress={() => {
            // TODO: Navigate to create project
          }}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={renderProjectItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  filtersContainer: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#f59e0b',
  },
  filterChipText: {
    color: '#ffffff',
    fontSize: 13,
  },
  filterChipTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
