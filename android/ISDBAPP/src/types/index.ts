// Re-export types from shared package
export type { Profile, ProfileInsert, ProfileUpdate } from '@isdb/shared';
export type { Project, ProjectFormData, ProjectInsert, ProjectUpdate, ProjectStatus, ContactMethod } from '@isdb/shared';
export type { SwipeCard, SwipeAction, SwipeResult } from '@isdb/shared';
export type { Match, MatchInsert, MatchUpdate, MatchStatus } from '@isdb/shared';
export type { Tag, TagInsert } from '@isdb/shared';

// App-specific types
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    user_name?: string;
    provider?: string;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}
