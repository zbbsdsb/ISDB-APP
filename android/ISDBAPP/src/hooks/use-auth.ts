import { useState, useEffect } from 'react';
import { APP_SCHEME } from '@isdb/shared';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/auth-store';
import type { User } from '../types';

export function useAuth() {
  const { user, session, loading, initialized, setUser, setSession, setLoading, setInitialized, signOut } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    if (!initialized) {
      initSession();
    }
  }, [initialized]);

  const initSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        const user = currentSession.user as User;
        setUser(user);
        setSession(currentSession);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.error('Error initializing session:', err);
      setError('Failed to initialize session');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const signInWithGitHub = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${APP_SCHEME}://auth/callback`,
        },
      });
      
      if (signInError) throw signInError;
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with GitHub');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithDiscord = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${APP_SCHEME}://auth/callback`,
        },
      });
      
      if (signInError) throw signInError;
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Discord');
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
    initialized,
    signInWithGitHub,
    signInWithDiscord,
    signOut: handleSignOut,
  };
}
