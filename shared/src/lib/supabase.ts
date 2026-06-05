import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Creates a Supabase client for the given configuration.
 * Platform-specific implementations should wrap this with appropriate
 * storage adapters (Keychain on mobile, electron-store on desktop).
 */
export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.anonKey);
}

/**
 * Default protected routes that require authentication.
 * These mirror the web middleware configuration.
 */
export const PROTECTED_ROUTES = [
  '/profile',
  '/projects/new',
  '/swipe',
  '/matches',
  '/onboarding',
] as const;

/**
 * Auth callback path for OAuth flows.
 */
export const AUTH_CALLBACK_PATH = '/auth/callback';

/**
 * Deep link scheme for mobile/desktop apps.
 */
export const APP_SCHEME = 'isdbapp';

/**
 * Full auth callback URL for the app.
 */
export function getAuthCallbackUrl(baseUrl: string): string {
  return `${APP_SCHEME}://${baseUrl}${AUTH_CALLBACK_PATH}`;
}
