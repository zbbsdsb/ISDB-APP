import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/use-theme';
import { useGroups } from '../hooks/use-groups';
import { useGroupStore } from '../store/group-store';
import { Button, Icon } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import { m3Shape } from '../constants/m3-shape';
import type { RootStackParamList } from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function GroupsListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { fetchGroups, fetchMyGroupIds } = useGroups();
  const groups = useGroupStore((s) => s.groups);
  const joinedIds = useGroupStore((s) => s.joinedGroupIds);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchGroups();
      fetchMyGroupIds();
    }
  }, [fetchGroups, fetchMyGroupIds]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.onBackground }]}>Groups</Text>
        <Button
          title="Create"
          onPress={() => (navigation.navigate as any)('GroupCreate')}
          size="sm"
          icon={<Icon name="plus" size="sm" color={colors.onPrimary} />}
        />
      </View>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={groups.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.onSurfaceVariant }]}>No groups yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              Create or join a group to connect with builders
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isJoined = joinedIds.has(item.id);
          return (
            <TouchableOpacity
              style={[styles.groupCard, { backgroundColor: colors.surface }]}
              onPress={() => (navigation.navigate as any)('GroupDetail', { groupId: item.id })}
            >
              <Text style={[styles.groupName, { color: colors.onSurface }]}>{item.name}</Text>
              {item.description && (
                <Text
                  style={[styles.groupDesc, { color: colors.onSurfaceVariant }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              )}
              {isJoined && (
                <View style={[styles.joinedBadge, { backgroundColor: colors.primaryContainer }]}>
                  <Text style={[styles.joinedText, { color: colors.onPrimaryContainer }]}>Joined</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: m3Spacing.lg,
    paddingVertical: m3Spacing.md,
  },
  title: { ...m3Typography.headlineSmall },
  list: { paddingHorizontal: m3Spacing.lg },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingHorizontal: m3Spacing.xl },
  emptyTitle: { ...m3Typography.titleMedium, marginBottom: m3Spacing.xs },
  emptySubtitle: { ...m3Typography.bodyMedium, textAlign: 'center' },
  groupCard: {
    padding: m3Spacing.md,
    borderRadius: m3Shape.medium,
    marginBottom: m3Spacing.sm,
  },
  groupName: { ...m3Typography.titleSmall, marginBottom: 4 },
  groupDesc: { ...m3Typography.bodyMedium },
  joinedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: m3Shape.small,
    marginTop: m3Spacing.sm,
  },
  joinedText: { ...m3Typography.labelSmall },
});
