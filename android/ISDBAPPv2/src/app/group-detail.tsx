import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  type RouteProp,
} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {useGroups} from '../hooks/use-groups';
import {useGroupStore} from '../store/group-store';
import {Text} from '../components/ui/text';
import {Button, Card, Icon} from '../components/ui';
import {m3Spacing} from '../constants/m3-spacing';
import type {GroupWithDetails, GroupMember} from '@isdb/shared';
import type {RootStackParamList} from '../navigation';

type GroupDetailRouteProp = RouteProp<RootStackParamList, 'GroupDetail'>;

export function GroupDetailScreen() {
  const {colors} = useTheme();
  const route = useRoute<GroupDetailRouteProp>();
  const navigation = useNavigation();
  const {groupId} = route.params;
  const {fetchGroupDetail, fetchGroupMembers, joinGroup, leaveGroup} =
    useGroups();
  const joinedIds = useGroupStore(s => s.joinedGroupIds);

  const [group, setGroup] = useState<GroupWithDetails | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'members'>('info');
  const [actionLoading, setActionLoading] = useState(false);

  const loadGroup = useCallback(async () => {
    const g = await fetchGroupDetail(groupId);
    if (g) {
      setGroup(g);
    }
    const m = await fetchGroupMembers(groupId);
    setMembers(m);
  }, [groupId, fetchGroupDetail, fetchGroupMembers]);

  useEffect(() => {
    loadGroup();
  }, [groupId, loadGroup]);

  const isJoined = joinedIds.has(groupId);

  const handleJoinToggle = async () => {
    setActionLoading(true);
    if (isJoined) {
      const ok = await leaveGroup(groupId);
      if (ok) {
        loadGroup();
      }
    } else {
      const ok = await joinGroup(groupId);
      if (ok) {
        loadGroup();
      }
    }
    setActionLoading(false);
  };

  if (!group) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {borderBottomColor: colors.outlineVariant}]}>
        <Button
          title=""
          onPress={() => navigation.goBack()}
          variant="text"
          icon={<Icon name="back" size="sm" color={colors.onBackground} />}
        />
        <Text variant="title" style={[styles.headerTitle, {color: colors.onBackground}]}>
          Group
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Name + Description */}
        <Text variant="heading" style={[styles.groupName, {color: colors.onBackground}]}>
          {group.name}
        </Text>
        {group.description && (
          <Text variant="body" style={[styles.desc, {color: colors.onSurfaceVariant}]}>
            {group.description}
          </Text>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card variant="elevated" padding={m3Spacing.md} style={styles.statCard}>
            <Text variant="heading" style={[styles.statNumber, {color: colors.primary}]}>
              {group.member_count}
            </Text>
            <Text variant="caption" style={[styles.statLabel, {color: colors.onSurfaceVariant}]}>
              Members
            </Text>
          </Card>
          <Card variant="elevated" padding={m3Spacing.md} style={styles.statCard}>
            <Text variant="heading" style={[styles.statNumber, {color: colors.primary}]}>
              {group.is_public ? 'Public' : 'Private'}
            </Text>
            <Text variant="caption" style={[styles.statLabel, {color: colors.onSurfaceVariant}]}>
              Type
            </Text>
          </Card>
        </View>

        {/* Join/Leave Button */}
        <Button
          title={isJoined ? 'Leave Group' : 'Join Group'}
          onPress={handleJoinToggle}
          variant={isJoined ? 'outlined' : 'filled'}
          fullWidth
          loading={actionLoading}
        />

        {/* Tabs: Info / Members */}
        <View style={styles.tabRow}>
          <Button
            title="Info"
            onPress={() => setActiveTab('info')}
            variant={activeTab === 'info' ? 'filled' : 'text'}
            size="sm"
          />
          <Button
            title={`Members (${members.length})`}
            onPress={() => setActiveTab('members')}
            variant={activeTab === 'members' ? 'filled' : 'text'}
            size="sm"
          />
        </View>

        {activeTab === 'info' && (
          <View style={styles.tabContent}>
            <Card variant="outlined" padding={m3Spacing.md}>
              <Text
                variant="label"
                style={[styles.infoLabel, {color: colors.onSurfaceVariant}]}>
                Created
              </Text>
              <Text variant="body" style={[styles.infoValue, {color: colors.onSurface}]}>
                {new Date(group.created_at).toLocaleDateString()}
              </Text>
              {group.owner && (
                <>
                  <Text
                    variant="label"
                    style={[
                      styles.infoLabel,
                      {color: colors.onSurfaceVariant, marginTop: m3Spacing.sm},
                    ]}>
                    Owner
                  </Text>
                  <Text variant="body" style={[styles.infoValue, {color: colors.onSurface}]}>
                    {group.owner.display_name || group.owner.username}
                  </Text>
                </>
              )}
            </Card>
          </View>
        )}

        {activeTab === 'members' && (
          <View style={styles.tabContent}>
            {members.map(member => (
              <Card
                key={member.id}
                variant="outlined"
                padding={m3Spacing.md}
                style={styles.memberCard}>
                <View style={styles.memberRow}>
                  <View
                    style={[
                      styles.memberAvatar,
                      {backgroundColor: colors.secondaryContainer},
                    ]}>
                    <Text
                      variant="label"
                      style={[
                        styles.memberAvatarText,
                        {color: colors.onSecondaryContainer},
                      ]}>
                      {member.user_id.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      variant="label"
                      style={[styles.memberRole, {color: colors.onSurface}]}>
                      {member.role}
                    </Text>
                    <Text
                      variant="caption"
                      style={[
                        styles.memberId,
                        {color: colors.onSurfaceVariant},
                      ]}>
                      {member.user_id.slice(0, 8)}...
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: m3Spacing.xs,
    height: 56,
    borderBottomWidth: 1,
  },
  headerTitle: {},
  headerSpacer: {width: 48},
  scroll: {padding: m3Spacing.lg, paddingBottom: m3Spacing.xxl},
  groupName: {marginBottom: m3Spacing.xs},
  desc: {marginBottom: m3Spacing.lg},
  statsRow: {
    flexDirection: 'row',
    gap: m3Spacing.sm,
    marginBottom: m3Spacing.lg,
  },
  statCard: {flex: 1, alignItems: 'center'},
  statNumber: {},
  statLabel: {},
  tabRow: {
    flexDirection: 'row',
    gap: m3Spacing.xs,
    marginVertical: m3Spacing.lg,
  },
  tabContent: {gap: m3Spacing.sm},
  infoLabel: {marginBottom: 2},
  infoValue: {},
  memberCard: {},
  memberRow: {flexDirection: 'row', alignItems: 'center'},
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: m3Spacing.sm,
  },
  memberAvatarText: {},
  memberRole: {textTransform: 'capitalize'},
  memberId: {},
});
