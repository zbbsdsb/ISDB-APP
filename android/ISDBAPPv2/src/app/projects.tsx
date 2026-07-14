import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {supabase} from '../services/supabase';
import {useAuthStore} from '../store/auth-store';
import {useToast} from '../hooks/use-toast';
import {Button, Card, Skeleton} from '../components/ui';
import {Text} from '../components/ui/text';
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

        if (error) {
          throw error;
        }

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
    if (loadingMore || !hasMore) {
      return;
    }
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

  // ── Create project (wired to the "+ New" button) ──
  const user = useAuthStore(s => s.user);
  const {show: showToast, ToastComponent} = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newHook, setNewHook] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');
  const [creating, setCreating] = useState(false);

  const resetCreateForm = () => {
    setNewTitle('');
    setNewHook('');
    setNewDesc('');
    setNewTags('');
  };

  const handleCreateProject = async () => {
    if (!user) {
      showToast('Please log in first', 'error');
      return;
    }
    if (!newTitle.trim()) {
      showToast('Project title is required', 'error');
      return;
    }
    setCreating(true);
    try {
      const tags = newTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      const {data, error} = await supabase
        .from('projects')
        .insert({
          title: newTitle.trim(),
          hook_text: newHook.trim() || null,
          description: newDesc.trim() || null,
          tags: tags.length ? tags : null,
          owner_id: user.id,
        })
        .select('id')
        .single();
      if (error) {
        throw error;
      }
      showToast('Project created!', 'success');
      setShowCreate(false);
      resetCreateForm();
      if (data?.id) {
        navigation.navigate('ProjectDetail', {projectId: data.id});
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to create project', 'error');
    } finally {
      setCreating(false);
    }
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
        <Text variant="title" style={[styles.projectTitle, {color: colors.onSurface}]}>
          {item.title}
        </Text>
        {item.hook_text && (
          <Text variant="label" style={[styles.projectHook, {color: colors.primary}]}>
            {item.hook_text}
          </Text>
        )}
        {item.description && (
          <Text
            variant="body"
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
                  variant="label"
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
          <Text variant="body" style={[styles.ownerText, {color: colors.onSurfaceVariant}]}>
            by {item.owner.display_name || item.owner.username || 'Unknown'}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text variant="body" style={[styles.emptyText, {color: colors.onSurfaceVariant}]}>
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
        <Text variant="heading" style={[styles.headerTitle, {color: colors.onBackground}]}>
          Projects
        </Text>
        <Button
          title="+ New"
          onPress={() => setShowCreate(true)}
          variant="filled"
          size="sm"
        />
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchBar,
          {backgroundColor: colors.surfaceVariant, borderColor: colors.outline},
        ]}>
        <Text variant="body" style={[styles.searchIcon, {color: colors.onSurfaceVariant}]}>
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
              variant="body"
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
              variant="label"
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
                variant="label"
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

      {/* Create Project modal */}
      {showCreate && (
        <View style={[styles.modalBackdrop]}>
          <View
            style={[
              styles.modalCard,
              {backgroundColor: colors.surface, borderColor: colors.outline},
            ]}>
            <Text
              variant="title"
              style={[styles.modalTitle, {color: colors.onSurface}]}>
              New Project
            </Text>

            <Text
              variant="label"
              style={[styles.modalLabel, {color: colors.onSurfaceVariant}]}>
              Title *
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                  borderColor: colors.outline,
                },
              ]}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="My Awesome Project"
              placeholderTextColor={colors.onSurfaceVariant}
              maxLength={120}
            />

            <Text
              variant="label"
              style={[styles.modalLabel, {color: colors.onSurfaceVariant}]}>
              Hook (one-liner)
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                  borderColor: colors.outline,
                },
              ]}
              value={newHook}
              onChangeText={setNewHook}
              placeholder="Why this, why now?"
              placeholderTextColor={colors.onSurfaceVariant}
              maxLength={160}
            />

            <Text
              variant="label"
              style={[styles.modalLabel, {color: colors.onSurfaceVariant}]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                styles.modalTextArea,
                {
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                  borderColor: colors.outline,
                },
              ]}
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder="Tell people what you're building"
              placeholderTextColor={colors.onSurfaceVariant}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text
              variant="label"
              style={[styles.modalLabel, {color: colors.onSurfaceVariant}]}>
              Tags (comma separated)
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                  borderColor: colors.outline,
                },
              ]}
              value={newTags}
              onChangeText={setNewTags}
              placeholder="AI, Mobile, Web"
              placeholderTextColor={colors.onSurfaceVariant}
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowCreate(false);
                  resetCreateForm();
                }}
                variant="text"
              />
              <Button
                title="Create"
                onPress={handleCreateProject}
                variant="filled"
                loading={creating}
                disabled={creating || !newTitle.trim()}
              />
            </View>
          </View>
        </View>
      )}

      {ToastComponent}
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

  // Create modal
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: m3Spacing.lg,
    zIndex: 100,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: m3Spacing.lg,
    gap: m3Spacing.xs,
  },
  modalTitle: {...m3Typography.titleMedium, fontWeight: '700', marginBottom: m3Spacing.sm},
  modalLabel: {marginTop: m3Spacing.sm},
  modalInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: m3Spacing.md,
    paddingVertical: m3Spacing.sm,
  },
  modalTextArea: {minHeight: 72, paddingTop: m3Spacing.sm},
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: m3Spacing.sm,
    marginTop: m3Spacing.md,
  },
});
