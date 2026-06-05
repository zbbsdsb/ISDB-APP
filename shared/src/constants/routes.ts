/**
 * API endpoints for ISDB services.
 * These are relative to the Supabase URL.
 */

export const API_PATHS = {
  // Profiles
  PROFILES: '/rest/v1/profiles',
  PROFILE_BY_ID: (id: string) => `/rest/v1/profiles?id=eq.${id}`,

  // Projects
  PROJECTS: '/rest/v1/projects',
  PROJECT_BY_ID: (id: string) => `/rest/v1/projects?id=eq.${id}`,

  // Swipes
  SWIPES: '/rest/v1/swipes',
  SWIPES_BY_USER: (userId: string) => `/rest/v1/swipes?user_id=eq.${userId}`,

  // Matches
  MATCHES: '/rest/v1/matches',
  MATCHES_BY_USER: (userId: string) => `/rest/v1/matches?user_id=eq.${userId}`,

  // Tags
  TAGS: '/rest/v1/tags',

  // Auth
  AUTH: '/auth/v1',
  AUTH_CALLBACK: '/auth/v1/callback',

  // Storage
  STORAGE: '/storage/v1',
} as const;
