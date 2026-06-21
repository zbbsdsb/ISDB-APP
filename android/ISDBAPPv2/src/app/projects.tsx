import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {supabase} from '../services/supabase';
import {Button, Card, Skeleton} from '../components/ui';
import {m3Typography} from '../constants/m3-typography';
import {m3Spacing} from '../constants/m3-spacing';
import {m3Shape} from '../constants/m3-shape';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const PAGE_SIZE = 10;

export function ProjectsScreen() {
  const {colors} = useTheme();
  const navigation = useNavigation<NavProp>();

  // Data
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProjects = useCallback(
    async (pageNum: number, isRefresh = false) => {
      try {
        let query = supabase
          .from('projects')
          .select(
            'id, title, description, hook_text, tags, created_at, owner:profiles!owner_id(username, display_name, avatar_url)',
          )
          .order('created_at', {ascending: false});

        // Tag filter
        if (selectedTag) {
          query = query.contains('tags', [selectedTag]);
        }

        // Search
        if (searchQuery.trim()) {
          query = query.ilike('title', `%${searchQuery.trim()}%`);
        }

        // Pagination
        const from = pageNum * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);

        const {data, error} = await query;

        if (error) {throw error;}

        if (isRefresh) {
          setProjects(data || []);
        } else {
          setProjects(prev => [...prev, ...(data || [])]);
        }

        setHasMore((data?.length || 0) >= PAGE_SIZE);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    },
    [selectedTag, searchQuery],
  );

  const loadTags = useCallback(async () => {
    try {
      const {data} = await supabase.from('tags').select('name').limit(30);
      if (data) {
        setAvailableTags(data.map(t => t.name));
      }
    } catch {
      // Silent fail — tags table might not exist
    }
  }, []);

  // Initial load
  useEffect(() => {
    setLoading(true);
    setPage(0);
    Promise.all([fetchProjects(0, true), loadTags()]).finally(() =>
      setLoading(false),
    );
  }, [selectedTag, searchQuery, fetchProjects, loadTags]);

  // Refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    await fetchProjects(0, true);
    setRefreshing(false);
  }, [fetchProjects]);

  // Load more
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) {return;}
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchProjects(nextPage);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page, fetchProjects]);

  // Filter change handlers
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setPage(0);
    setProjects([]);
    setLoading(true);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setPage(0);
    setProjects([]);
    setLoading(true);
  };

  const renderProject = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProjectDetail', {projectId: item.id})
      }>
      <Card
        variant="elevated"
        padding={m3Spacing.md}
        style={styles.projectCard}>
        <Text style={[styles.projectTitle, {color: colors.onSurface}]}>
          {item.title}
        </Text>
        {item.hook_text && (
          <Text style={[styles.projectHook, {color: colors.primary}]}>
            {item.hook_text}
          </Text>
        )}
        {item.description && (
          <Text
            style={[styles.projectDesc, {color: colors.onSurfaceVariant}]}
            numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagRow}>
            {item.tags.slice(0, 3).map((tag: string) => (
              <View
                key={tag}
                style={[
                  styles.tagChip,
                  {backgroundColor: colors.secondaryContainer},
                ]}>
                <Text
                  style={[
                    styles.tagText,
                    {color: colors.onSecondaryContainer},
                  ]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
        {item.owner && (
          <Text style={[styles.ownerText, {color: colors.onSurfaceVariant}]}>
            by {item.owner.display_name || item.owner.username || 'Unknown'}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) {return null;}
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {return null;}
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, {color: colors.onSurfaceVariant}]}>
          {searchQuery || selectedTag
            ? 'No projects match your filters'
            : 'No projects yet. Be the first to create one!'}
        </Text>
      </View>
    );
  };

  const headerContent = (
    <View>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, {color: colors.onBackground}]}>
          Projects
        </Text>
        <Button title="+ New" onPress={() => {}} variant="filled" size="sm" />
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchBar,
          {backgroundColor: colors.surfaceVariant, borderColor: colors.outline},
        ]}>
        <Text style={[styles.searchIcon, {color: colors.onSurfaceVariant}]}>
          🔍
        </Text>
        <TextInput
          style={[styles.searchInput, {color: colors.onBackground}]}
          placeholder="Search projects..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text
              style={[styles.clearSearch, {color: colors.onSurfaceVariant}]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tag filter row */}
      {availableTags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagScroll}
          contentContainerStyle={styles.tagScrollContent}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: !selectedTag
                  ? colors.primary
                  : colors.surfaceVariant,
              },
            ]}
            onPress={() => handleTagSelect(null)}>
            <Text
              style={[
                styles.filterChipText,
                {
                  color: !selectedTag
                    ? colors.onPrimary
                    : colors.onSurfaceVariant,
                },
              ]}>
              All
            </Text>
          </TouchableOpacity>
          {availableTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedTag === tag
                      ? colors.primary
                      : colors.surfaceVariant,
                },
              ]}
              onPress={() => handleTagSelect(tag)}>
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedTag === tag
                        ? colors.onPrimary
                        : colors.onSurfaceVariant,
                  },
                ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {loading ? (
        <View style={styles.loadingContent}>
          {headerContent}
          <View style={styles.skeletonList}>
            <Skeleton
              width="100%"
              height={120}
              style={{marginBottom: m3Spacing.md}}
            />
            <Skeleton
              width="100%"
              height={120}
              style={{marginBottom: m3Spacing.md}}
            />
            <Skeleton width="100%" height={120} />
          </View>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={item => item.id}
          ListHeaderComponent={headerContent}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  loadingContent: {flex: 1, padding: m3Spacing.lg},
  skeletonList: {marginTop: m3Spacing.md},

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: m3Spacing.md,
  },
  headerTitle: {...m3Typography.headlineSmall, fontWeight: '700'},

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: m3Shape.small,
    paddingHorizontal: m3Spacing.sm,
    marginBottom: m3Spacing.sm,
  },
  searchIcon: {fontSize: 16, marginRight: m3Spacing.xs},
  searchInput: {flex: 1, fontSize: 16, paddingVertical: 10},
  clearSearch: {fontSize: 16, paddingLeft: m3Spacing.xs},

  // Tag filter
  tagScroll: {marginBottom: m3Spacing.md},
  tagScrollContent: {gap: m3Spacing.xs},
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipText: {...m3Typography.labelMedium},

  // List
  listContent: {padding: m3Spacing.lg},

  // Project card
  projectCard: {marginBottom: m3Spacing.sm},
  projectTitle: {...m3Typography.titleSmall, fontWeight: '600'},
  projectHook: {...m3Typography.labelSmall, fontStyle: 'italic', marginTop: 2},
  projectDesc: {...m3Typography.bodySmall, marginTop: 4},
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: m3Spacing.sm,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: m3Shape.small,
  },
  tagText: {...m3Typography.labelSmall},
  ownerText: {...m3Typography.bodySmall, marginTop: m3Spacing.xs},

  // Pagination footer
  footer: {paddingVertical: m3Spacing.md},

  // Empty
  emptyContainer: {paddingVertical: m3Spacing.xl, alignItems: 'center'},
  emptyText: {...m3Typography.bodyLarge, textAlign: 'center'},
});
