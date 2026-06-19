export type GroupRole = 'owner' | 'admin' | 'member';

export interface Group {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  avatar_url: string | null;
  is_public: boolean;
  discord_webhook_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupRole;
  joined_at: string;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  invited_by: string;
  invite_code: string;
  expires_at: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

export interface GroupWithDetails extends Group {
  member_count: number;
  is_member: boolean;
  user_role: GroupRole | null;
  owner?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    identity_number: number;
  };
  member_role?: GroupRole;
}
