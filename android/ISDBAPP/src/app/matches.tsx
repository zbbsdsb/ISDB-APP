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
} from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { useMatches } from '../hooks/use-matches';
import type { MatchWithDetails } from '../hooks/use-matches';
import { Avatar, Button, Card } from '../components/ui';
import type { Match } from '@isdb/shared';

export function MatchesScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const {
    incomingMatches,
    outgoingMatches,
    loading,
    error,
    fetchMatches,
    acceptMatch,
    rejectMatch,
  } = useMatches(user?.id || '');

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const handleAccept = async (matchId: string) => {
    const success = await acceptMatch(matchId);
    if (success) {
      fetchMatches();
    }
  };

  const handleReject = async (matchId: string) => {
    const success = await rejectMatch(matchId);
    if (success) {
      fetchMatches();
    }
  };

  const renderIncomingItem = ({ item }: { item: MatchWithDetails }) => (
    <Card style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Avatar
          source={item.applicant?.avatar_url ? { uri: item.applicant.avatar_url } : null}
          size={48}
        />
        <View style={styles.matchInfo}>
          <Text style={[styles.matchName, { color: colors.text }]}>
            @{item.applicant?.username || 'Unknown'}
          </Text>
          <Text style={[styles.matchHandle, { color: colors.textSecondary }]}>
            {item.applicant?.github_username && `GitHub: ${item.applicant.github_username}`}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          item.status === 'pending' && styles.pendingBadge,
          item.status === 'accepted' && styles.acceptedBadge,
          item.status === 'rejected' && styles.rejectedBadge,
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.projectInfo}>
        <Text style={[styles.projectLabel, { color: colors.textSecondary }]}>
          Applied to:
        </Text>
        <Text style={[styles.projectTitle, { color: colors.text }]}>
          {item.project?.title || 'Unknown Project'}
        </Text>
      </View>

      {item.message && (
        <View style={styles.messageContainer}>
          <Text style={[styles.messageLabel, { color: colors.textSecondary }]}>
            Message:
          </Text>
          <Text style={[styles.messageText, { color: colors.text }]}>
            {item.message}
          </Text>
        </View>
      )}

      {item.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.rejectButton]}
            onPress={() => handleReject(item.id)}
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton]}
            onPress={() => handleAccept(item.id)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  const renderOutgoingItem = ({ item }: { item: MatchWithDetails }) => (
    <Card style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Avatar
          source={item.owner?.avatar_url ? { uri: item.owner.avatar_url } : null}
          size={48}
        />
        <View style={styles.matchInfo}>
          <Text style={[styles.matchName, { color: colors.text }]}>
            @{item.owner?.username || 'Unknown'}
          </Text>
          <Text style={[styles.matchHandle, { color: colors.textSecondary }]}>
            {item.owner?.github_username && `GitHub: ${item.owner.github_username}`}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          item.status === 'pending' && styles.pendingBadge,
          item.status === 'accepted' && styles.acceptedBadge,
          item.status === 'rejected' && styles.rejectedBadge,
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.projectInfo}>
        <Text style={[styles.projectLabel, { color: colors.textSecondary }]}>
          Applied to:
        </Text>
        <Text style={[styles.projectTitle, { color: colors.text }]}>
          {item.project?.title || 'Unknown Project'}
        </Text>
      </View>

      {item.message && (
        <View style={styles.messageContainer}>
          <Text style={[styles.messageLabel, { color: colors.textSecondary }]}>
            Your message:
          </Text>
          <Text style={[styles.messageText, { color: colors.text }]}>
            {item.message}
          </Text>
        </View>
      )}
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>💬</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {activeTab === 'incoming' ? 'No applications yet' : 'No outgoing applications'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {activeTab === 'incoming'
          ? 'When builders apply to your projects, they will appear here'
          : 'Start swiping to apply for projects you\'re interested in'}
      </Text>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Matches</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Sign in required
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Please sign in to view your matches
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const currentMatches = activeTab === 'incoming' ? incomingMatches : outgoingMatches;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Matches</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'incoming' && [styles.activeTab, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('incoming')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'incoming' ? colors.primary : colors.textSecondary },
          ]}>
            Incoming
          </Text>
          {incomingMatches.length > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{incomingMatches.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'outgoing' && [styles.activeTab, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('outgoing')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'outgoing' ? colors.primary : colors.textSecondary },
          ]}>
            Outgoing
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentMatches}
        keyExtractor={(item) => item.id}
        renderItem={activeTab === 'incoming' ? renderIncomingItem : renderOutgoingItem}
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
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
  matchCard: {
    marginBottom: 12,
    padding: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
  },
  matchHandle: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  acceptedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  rejectedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#ffffff',
  },
  projectInfo: {
    marginTop: 12,
  },
  projectLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  messageLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  rejectButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
