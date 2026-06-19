import { useState, useEffect, useRef, useCallback } from 'react';
import { APP_SCHEME } from '@isdb/shared';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/auth-store';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Provider = 'github' | 'discord';

export function useAuth() {
  const { user, session, loading, initialized, setUser, setSession, setLoading, setInitialized, signOut } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const hasStartedRef = useRef(false);

  // Initialize session on mount — runs exactly once, even across re-renders
  useEffect(() => {
    if (initialized || hasStartedRef.current) return;
    hasStartedRef.current = true;

    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession) {
          setUser(currentSession.user as SupabaseUser);
          setSession(currentSession);
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Error initializing session:', err);
        setError('Failed to initialize session');
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initSession();

    // Subscribe to auth state changes — keeps App in sync with token expiry /异地登录
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setSession(null);
        } else if (session?.user) {
          setUser(session.user as SupabaseUser);
          setSession(session);
        }
        setLoading(false);
        setInitialized(true);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized, setUser, setSession, setLoading, setInitialized]);

  const signInWithProvider = useCallback(async (provider: Provider) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${APP_SCHEME}://auth/callback`,
        },
      });

      if (signInError) throw signInError;
      return data;
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const handleSignOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      signOut();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, signOut]);

  return {
    user,
    session,
    loading,
    error,
    setError,
    initialized,
    signInWithGitHub: () => signInWithProvider('github'),
    signInWithDiscord: () => signInWithProvider('discord'),
    signOut: handleSignOut,
  };
}
