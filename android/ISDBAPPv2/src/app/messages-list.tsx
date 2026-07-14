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
import {useMessages} from '../hooks/use-messages';
import {useMessageStore} from '../store/message-store';
import {Text} from '../components/ui/text';
import {Card} from '../components/ui';
import {m3Spacing} from '../constants/m3-spacing';
import {m3Shape} from '../constants/m3-shape';
import type {RootStackParamList} from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function MessagesListScreen() {
  const {colors} = useTheme();
  const navigation = useNavigation<NavProp>();
  const {fetchConversations} = useMessages();
  const conversations = useMessageStore(s => s.conversations);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchConversations();
    }
  }, [fetchConversations]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) {
      return 'now';
    }
    if (diffMins < 60) {
      return `${diffMins}m`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h`;
    }
    return d.toLocaleDateString();
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text variant="heading" style={[styles.title, {color: colors.onBackground}]}>
          Messages
        </Text>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={item => item.match_id}
        contentContainerStyle={
          conversations.length === 0 ? styles.emptyContainer : styles.list
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="title" style={[styles.emptyTitle, {color: colors.onSurfaceVariant}]}>
              No messages yet
            </Text>
            <Text variant="body" style={[styles.emptySubtitle, {color: colors.onSurfaceVariant}]}>
              Match with a project to start chatting
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <Card
            variant="elevated"
            padding={m3Spacing.md}
            onPress={() =>
              navigation.navigate('MessageChat', {
                matchId: item.match_id,
                title:
                  item.other_user.display_name ||
                  `#${item.other_user.identity_number}`,
              })
            }
            style={styles.conversationCard}>
            <View
              style={[
                styles.avatar,
                {backgroundColor: colors.secondaryContainer},
              ]}>
              <Text
                variant="title"
                style={[
                  styles.avatarText,
                  {color: colors.onSecondaryContainer},
                ]}>
                {(item.other_user.display_name || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.conversationInfo}>
              <View style={styles.conversationTop}>
                <Text
                  variant="title"
                  style={[styles.conversationName, {color: colors.onSurface}]}
                  numberOfLines={1}>
                  {item.other_user.display_name ||
                    `Builder #${item.other_user.identity_number}`}
                </Text>
                <Text
                  variant="caption"
                  style={[styles.timeText, {color: colors.onSurfaceVariant}]}>
                  {formatTime(item.last_message_at)}
                </Text>
              </View>
              <Text
                variant="body"
                style={[styles.lastMessage, {color: colors.onSurfaceVariant}]}
                numberOfLines={1}>
                {item.last_message}
              </Text>
              {item.unread_count > 0 && (
                <View
                  style={[
                    styles.unreadBadge,
                    {backgroundColor: colors.primary},
                  ]}>
                  <Text variant="caption" style={[styles.unreadText, {color: colors.onPrimary}]}>
                    {item.unread_count > 99 ? '99+' : item.unread_count}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    paddingHorizontal: m3Spacing.lg,
    paddingVertical: m3Spacing.md,
  },
  title: {},
  list: {paddingHorizontal: m3Spacing.lg},
  emptyContainer: {flex: 1, justifyContent: 'center'},
  emptyState: {alignItems: 'center', paddingHorizontal: m3Spacing.xl},
  emptyTitle: {marginBottom: m3Spacing.xs},
  emptySubtitle: {textAlign: 'center'},
  conversationCard: {
    flexDirection: 'row',
    borderRadius: m3Shape.medium,
    marginBottom: m3Spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: m3Spacing.md,
  },
  avatarText: {},
  conversationInfo: {flex: 1, justifyContent: 'center'},
  conversationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationName: {
    flex: 1,
    marginRight: m3Spacing.xs,
  },
  timeText: {},
  lastMessage: {marginTop: 2},
  unreadBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {fontWeight: '700'},
});
