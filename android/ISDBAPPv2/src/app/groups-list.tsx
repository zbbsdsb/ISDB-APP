import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTheme} from '../hooks/use-theme';
import {useGroups} from '../hooks/use-groups';
import {useGroupStore} from '../store/group-store';
import {Text} from '../components/ui/text';
import {Button, Card, Icon} from '../components/ui';
import {m3Spacing} from '../constants/m3-spacing';
import {m3Shape} from '../constants/m3-shape';
import type {RootStackParamList} from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function GroupsListScreen() {
  const {colors} = useTheme();
  const navigation = useNavigation<NavProp>();
  const {fetchGroups, fetchMyGroupIds} = useGroups();
  const groups = useGroupStore(s => s.groups);
  const joinedIds = useGroupStore(s => s.joinedGroupIds);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchGroups();
      fetchMyGroupIds();
    }
  }, [fetchGroups, fetchMyGroupIds]);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text variant="heading" style={[styles.title, {color: colors.onBackground}]}>Groups</Text>
        <Button
          title="Create"
          onPress={() => navigation.navigate('GroupCreate')}
          variant="filled"
          size="sm"
          icon={<Icon name="plus" size="sm" color={colors.onPrimary} />}
        />
      </View>
      <FlatList
        data={groups}
        keyExtractor={item => item.id}
        contentContainerStyle={
          groups.length === 0 ? styles.emptyContainer : styles.list
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="title" style={[styles.emptyTitle, {color: colors.onSurfaceVariant}]}>
              No groups yet
            </Text>
            <Text variant="body" style={[styles.emptySubtitle, {color: colors.onSurfaceVariant}]}>
              Create or join a group to connect with builders
            </Text>
          </View>
        }
        renderItem={({item}) => {
          const isJoined = joinedIds.has(item.id);
          return (
            <Card
              variant="elevated"
              padding={m3Spacing.md}
              onPress={() =>
                navigation.navigate('GroupDetail', {groupId: item.id})
              }
              style={styles.groupCard}>
              <Text variant="title" style={[styles.groupName, {color: colors.onSurface}]}>
                {item.name}
              </Text>
              {item.description && (
                <Text
                  variant="body"
                  style={[styles.groupDesc, {color: colors.onSurfaceVariant}]}
                  numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              {isJoined && (
                <View
                  style={[
                    styles.joinedBadge,
                    {backgroundColor: colors.primaryContainer},
                  ]}>
                  <Text
                    variant="caption"
                    style={[
                      styles.joinedText,
                      {color: colors.onPrimaryContainer},
                    ]}>
                    Joined
                  </Text>
                </View>
              )}
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: m3Spacing.lg,
    paddingVertical: m3Spacing.md,
  },
  title: {},
  list: {paddingHorizontal: m3Spacing.lg},
  emptyContainer: {flex: 1, justifyContent: 'center'},
  emptyState: {alignItems: 'center', paddingHorizontal: m3Spacing.xl},
  emptyTitle: {marginBottom: m3Spacing.xs},
  emptySubtitle: {textAlign: 'center'},
  groupCard: {
    borderRadius: m3Shape.medium,
    marginBottom: m3Spacing.sm,
  },
  groupName: {marginBottom: 4},
  groupDesc: {},
  joinedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: m3Shape.small,
    marginTop: m3Spacing.sm,
  },
  joinedText: {},
});
