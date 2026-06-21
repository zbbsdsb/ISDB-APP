import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User as SupabaseUser, Session} from '@supabase/supabase-js';

interface AuthState {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: SupabaseUser | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      session: null,
      loading: true,
      initialized: false,
      setUser: user => set({user, loading: false}),
      setSession: session => set({session}),
      setLoading: loading => set({loading}),
      setInitialized: initialized => set({initialized}),
      signOut: () => set({user: null, session: null, loading: false}),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({user: state.user, session: state.session}),
    },
  ),
);
