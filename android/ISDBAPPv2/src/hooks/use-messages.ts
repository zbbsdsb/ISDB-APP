import {useState, useEffect, useCallback, useRef} from 'react';
import {supabase} from '../services/supabase';
import {useMessageStore} from '../store/message-store';
import {useAuthStore} from '../store/auth-store';
import type {Message, Conversation} from '@isdb/shared';
import type {RealtimePostgresChangesPayload} from '@supabase/supabase-js';

interface UseMessagesResult {
  loading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  fetchMessages: (matchId: string) => Promise<Message[]>;
  sendMessage: (matchId: string, content: string) => Promise<boolean>;
}

export function useMessages(): UseMessagesResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {setConversations, incrementUnread} = useMessageStore();
  const user = useAuthStore(s => s.user);
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(
    null,
  );

  const fetchConversations = useCallback(async () => {
    if (!user) {return;}
    setLoading(true);
    try {
      const {data, error: fetchError} = await supabase
        .from('matches')
        .select(
          `
          match_id:id,
          project_id,
          project_title:projects!inner(title),
          other_user:profiles!matches_user2_id_fkey(
            id, identity_number, display_name, avatar_url
          ),
          last_message,
          last_message_at,
          unread_count
        `,
        )
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .not('last_message', 'is', null)
        .order('last_message_at', {ascending: false});

      if (fetchError) {throw fetchError;}
      if (data) {setConversations(data as unknown as Conversation[]);}
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, setConversations]);

  const fetchMessages = useCallback(
    async (matchId: string): Promise<Message[]> => {
      try {
        const {data, error: fetchError} = await supabase
          .from('messages')
          .select(
            '*, sender:profiles!sender_id(identity_number, display_name, avatar_url)',
          )
          .eq('match_id', matchId)
          .order('created_at', {ascending: true});

        if (fetchError) {throw fetchError;}
        return (data as unknown as Message[]) || [];
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        return [];
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (matchId: string, content: string): Promise<boolean> => {
      if (!user || !content.trim()) {return false;}
      try {
        const {error: insertError} = await supabase.from('messages').insert({
          match_id: matchId,
          sender_id: user.id,
          content: content.trim(),
        });

        if (insertError) {throw insertError;}

        // Update match with last message
        await supabase
          .from('matches')
          .update({
            last_message: content.trim(),
            last_message_at: new Date().toISOString(),
          })
          .eq('id', matchId);

        return true;
      } catch (err: any) {
        console.error('Error sending message:', err);
        return false;
      }
    },
    [user],
  );

  // Subscribe to new messages
  useEffect(() => {
    if (!user) {return;}

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Message>) => {
          const newMsg = payload.new as Message;
          incrementUnread(newMsg.match_id);
        },
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, incrementUnread]);

  return {loading, error, fetchConversations, fetchMessages, sendMessage};
}
