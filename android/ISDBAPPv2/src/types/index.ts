// Re-export types from shared package
export type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Project,
  ProjectFormData,
  ProjectInsert,
  ProjectUpdate,
  ProjectStatus,
  ContactMethod,
  SwipeCard,
  SwipeAction,
  SwipeResult,
  Match,
  MatchInsert,
  MatchUpdate,
  MatchStatus,
  Tag,
  TagInsert,
} from '@isdb/shared';

// React Native specific types
export type User = {
  id: string;
  email?: string;
  username?: string;
  user_metadata?: {
    avatar_url?: string;
    user_name?: string;
    provider?: string;
  };
};
