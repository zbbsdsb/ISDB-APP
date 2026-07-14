import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {useAuthStore} from '../store/auth-store';
import {supabase} from '../services/supabase';
import {Button, Card, Text} from '../components/ui';
import {m3Typography} from '../constants/m3-typography';
import {m3Spacing} from '../constants/m3-spacing';

interface MatchItem {
  id: string;
  project_id: string;
  status: string;
  created_at: string;
  project?: {title: string};
  other_user?: {
    display_name?: string;
    username?: string;
    identity_number?: number;
  };
}

export function MatchesScreen() {
  const {colors} = useTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore(s => s.user);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    const {data} = await supabase
      .from('matches')
      .select('*, project:projects!project_id(title)')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('created_at', {ascending: false});
    if (data) {
      setMatches(data as MatchItem[]);
    }
    setLoading(false);
  }, [user]);

  // Fetch on mount (initial load)
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Re-fetch every time this tab gains focus
  useFocusEffect(
    useCallback(() => {
      fetchMatches();
    }, [fetchMatches]),
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="title" style={[styles.emptyTitle, {color: colors.onBackground}]}>
        No Matches Yet
      </Text>
      <Text variant="body" style={[styles.emptySubtitle, {color: colors.onSurfaceVariant}]}>
        Swipe right on projects you're interested in!
      </Text>
      <Button
        title="Start Swiping"
        onPress={() => navigation.navigate('Swipe')}
        style={styles.startButton}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text variant="heading" style={[styles.title, {color: colors.onBackground}]}>
          Matches
        </Text>
      </View>
      <FlatList
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            variant="elevated"
            padding={m3Spacing.md}
            style={styles.matchCard}
            onPress={() =>
              navigation
                .getParent()
                ?.navigate('ProjectDetail', {projectId: item.project_id})
            }>
            <Text variant="title" style={[styles.matchTitle, {color: colors.onSurface}]}>
              {item.project?.title || 'Project'}
            </Text>
            <Text
              variant="body"
              style={[styles.matchStatus, {color: colors.onSurfaceVariant}]}>
              {item.status === 'pending' ? 'Pending Approval' : item.status}
            </Text>
          </Card>
        )}
        ListEmptyComponent={loading ? null : renderEmptyState}
        contentContainerStyle={[
          styles.list,
          matches.length === 0 && styles.emptyList,
        ]}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {padding: m3Spacing.lg},
  title: {...m3Typography.headlineSmall},
  list: {padding: m3Spacing.lg, paddingTop: 0},
  emptyList: {flex: 1},
  matchCard: {marginBottom: m3Spacing.sm},
  matchTitle: {...m3Typography.titleSmall},
  matchStatus: {
    ...m3Typography.bodySmall,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {...m3Typography.titleLarge, marginBottom: 8},
  emptySubtitle: {...m3Typography.bodyMedium, textAlign: 'center'},
  startButton: {marginTop: 16},
});
