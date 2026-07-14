import {useState, useEffect, useCallback} from 'react';
import {APP_SCHEME} from '@isdb/shared';
import {supabase} from '../services/supabase';
import {useAuthStore} from '../store/auth-store';
import type {User as SupabaseUser} from '@supabase/supabase-js';
import logger from '../utils/logger';

type Provider = 'github' | 'discord' | 'google';

export function useAuth() {
  const {
    user,
    session,
    loading,
    initialized,
    setUser,
    setSession,
    setLoading,
    setInitialized,
    signOut,
  } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const initSession = useCallback(async () => {
    try {
      const {
        data: {session: currentSession},
      } = await supabase.auth.getSession();

      if (currentSession) {
        // currentSession.user is Supabase User, matches auth-store's SupabaseUser type
        setUser(currentSession.user as SupabaseUser);
        setSession(currentSession);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      logger.error('Error initializing session:', err);
      setError('Failed to initialize session');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [setUser, setSession, setLoading, setInitialized, setError]);

  // Initialize session on mount
  useEffect(() => {
    if (!initialized) {
      initSession();
    }
  }, [initialized, initSession]);

  const signInWithProvider = async (provider: Provider) => {
    try {
      setLoading(true);
      setError(null);
      const {data, error: signInError} = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${APP_SCHEME}://auth/callback`,
        },
      });

      if (signInError) {
        throw signInError;
      }
      return data;
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      signOut();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    setError,
    initialized,
    signInWithGitHub: () => signInWithProvider('github'),
    signInWithDiscord: () => signInWithProvider('discord'),
    signInWithGoogle: () => signInWithProvider('google'),
    signOut: handleSignOut,
  };
}
