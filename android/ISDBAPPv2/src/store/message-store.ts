import {create} from 'zustand';
import type {Conversation} from '@isdb/shared';

interface MessageStore {
  conversations: Conversation[];
  unreadCount: number;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateLastMessage: (
    matchId: string,
    message: string,
    timestamp: string,
  ) => void;
  incrementUnread: (matchId: string) => void;
  clearUnread: (matchId: string) => void;
  setUnreadCount: (count: number) => void;
}

export const useMessageStore = create<MessageStore>(set => ({
  conversations: [],
  unreadCount: 0,

  setConversations: conversations =>
    set({
      conversations,
      unreadCount: conversations.reduce((sum, c) => sum + c.unread_count, 0),
    }),

  addConversation: conversation =>
    set(state => ({
      conversations: [conversation, ...state.conversations],
    })),

  updateLastMessage: (matchId, message, timestamp) =>
    set(state => {
      const updated = state.conversations.map(c =>
        c.match_id === matchId
          ? {...c, last_message: message, last_message_at: timestamp}
          : c,
      );
      // Move to top
      const idx = updated.findIndex(c => c.match_id === matchId);
      if (idx > 0) {
        const item = updated.splice(idx, 1)[0];
        updated.unshift(item);
      }
      return {conversations: updated};
    }),

  incrementUnread: matchId =>
    set(state => {
      const updated = state.conversations.map(c =>
        c.match_id === matchId ? {...c, unread_count: c.unread_count + 1} : c,
      );
      return {
        conversations: updated,
        unreadCount: updated.reduce((sum, c) => sum + c.unread_count, 0),
      };
    }),

  clearUnread: matchId =>
    set(state => {
      const updated = state.conversations.map(c =>
        c.match_id === matchId ? {...c, unread_count: 0} : c,
      );
      return {
        conversations: updated,
        unreadCount: updated.reduce((sum, c) => sum + c.unread_count, 0),
      };
    }),

  setUnreadCount: count => set({unreadCount: count}),
}));
