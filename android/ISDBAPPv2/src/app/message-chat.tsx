import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  type RouteProp,
} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {useMessages} from '../hooks/use-messages';
import {useMessageStore} from '../store/message-store';
import {useAuthStore} from '../store/auth-store';
import {Button, Icon} from '../components/ui';
import {m3Typography} from '../constants/m3-typography';
import {m3Spacing} from '../constants/m3-spacing';
import {m3Shape} from '../constants/m3-shape';
import type {Message} from '@isdb/shared';
import type {RootStackParamList} from '../navigation';

type MessageChatRouteProp = RouteProp<RootStackParamList, 'MessageChat'>;

export function MessageChatScreen() {
  const {colors} = useTheme();
  const route = useRoute<MessageChatRouteProp>();
  const navigation = useNavigation();
  const {matchId, title} = route.params;
  const {fetchMessages, sendMessage} = useMessages();
  const clearUnread = useMessageStore(s => s.clearUnread);
  const user = useAuthStore(s => s.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = useCallback(async () => {
    const msgs = await fetchMessages(matchId);
    setMessages(msgs);
  }, [matchId, fetchMessages]);

  useEffect(() => {
    loadMessages();
    clearUnread(matchId);
  }, [matchId, loadMessages, clearUnread]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) {
      return;
    }
    setSending(true);
    const ok = await sendMessage(matchId, inputText);
    if (ok) {
      setInputText('');
      // Reload messages to show new one
      const msgs = await fetchMessages(matchId);
      setMessages(msgs);
    }
    setSending(false);
  };

  const renderBubble = ({item}: {item: Message}) => {
    const isMine = item.sender_id === user?.id;
    return (
      <View
        style={[
          styles.bubbleRow,
          isMine ? styles.bubbleRowMine : styles.bubbleRowOther,
        ]}>
        <View
          style={[
            styles.bubble,
            isMine
              ? [styles.bubbleMineRadius, {backgroundColor: colors.primary}]
              : [
                  styles.bubbleOtherRadius,
                  {backgroundColor: colors.surfaceVariant},
                ],
          ]}>
          <Text
            style={[
              styles.bubbleText,
              {color: isMine ? colors.onPrimary : colors.onSurface},
            ]}>
            {item.content}
          </Text>
          <Text
            style={[
              styles.bubbleTime,
              {color: isMine ? colors.onPrimary : colors.onSurfaceVariant},
              styles.bubbleTimeOpacity,
            ]}>
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.outlineVariant,
          },
        ]}>
        <Button
          title=""
          onPress={() => navigation.goBack()}
          variant="text"
          icon={<Icon name="back" size="sm" color={colors.onBackground} />}
        />
        <Text
          style={[styles.headerTitle, {color: colors.onBackground}]}
          numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderBubble}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text
                style={[styles.emptyText, {color: colors.onSurfaceVariant}]}>
                No messages yet. Say hello!
              </Text>
            </View>
          }
        />

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.outlineVariant,
            },
          ]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceVariant,
                color: colors.onSurface,
                borderColor: colors.outline,
              },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.onSurfaceVariant}
            multiline
            maxLength={2000}
          />
          <Button
            title=""
            onPress={handleSend}
            variant="filled"
            disabled={!inputText.trim() || sending}
            loading={sending}
            icon={<Icon name="send" size="sm" color={colors.onPrimary} />}
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: m3Spacing.xs,
    height: 56,
    borderBottomWidth: 1,
  },
  headerTitle: {...m3Typography.titleMedium, flex: 1, textAlign: 'center'},
  headerSpacer: {width: 48},
  messageList: {
    padding: m3Spacing.md,
    paddingBottom: m3Spacing.lg,
    flexGrow: 1,
  },
  bubbleRow: {marginVertical: 3, flexDirection: 'row'},
  bubbleRowMine: {justifyContent: 'flex-end'},
  bubbleRowOther: {justifyContent: 'flex-start'},
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: m3Spacing.md,
    paddingVertical: m3Spacing.sm,
    borderRadius: m3Shape.medium,
  },
  bubbleMineRadius: {borderBottomRightRadius: 4},
  bubbleOtherRadius: {borderBottomLeftRadius: 4},
  bubbleText: {...m3Typography.bodyMedium},
  bubbleTime: {...m3Typography.labelSmall, marginTop: 2, textAlign: 'right'},
  bubbleTimeOpacity: {opacity: 0.7},
  emptyChat: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {...m3Typography.bodyLarge},
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: m3Spacing.sm,
    paddingVertical: m3Spacing.sm,
    borderTopWidth: 1,
    gap: m3Spacing.sm,
  },
  input: {
    flex: 1,
    borderRadius: m3Shape.small,
    borderWidth: 1,
    paddingHorizontal: m3Spacing.md,
    paddingVertical: m3Spacing.sm,
    maxHeight: 100,
    ...m3Typography.bodyMedium,
  },
  sendButton: {
    marginBottom: 0,
  },
});
