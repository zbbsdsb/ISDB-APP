export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;

  sender?: {
    identity_number: number;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function normalizeMessageSender(message: any): Message {
  const normalized = { ...message };
  if (normalized.sender && Array.isArray(normalized.sender)) {
    normalized.sender = normalized.sender[0] || null;
  }
  return normalized as Message;
}

export interface Conversation {
  match_id: string;
  project_id: string;
  project_title: string;
  other_user: {
    id: string;
    identity_number: number;
    display_name: string | null;
    avatar_url: string | null;
  };
  last_message: string;
  last_message_at: string;
  unread_count: number;
}
