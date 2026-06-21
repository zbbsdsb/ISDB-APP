import {createClient} from '@supabase/supabase-js';
import {
  getGenericPassword,
  setGenericPassword,
  resetGenericPassword,
} from 'react-native-keychain';
import type {SupabaseConfig} from '@isdb/shared';
import {SUPABASE_URL, SUPABASE_ANON_KEY} from '../config/supabase';

class SecureStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      const credentials = await getGenericPassword({service: key});
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (_e) {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await setGenericPassword(key, value, {service: key});
    } catch (error) {
      console.error('Error storing credential:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await resetGenericPassword({service: key});
    } catch (error) {
      console.error('Error removing credential:', error);
    }
  }
}

const config: SupabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
};

export const supabase = createClient(config.url, config.anonKey, {
  auth: {
    storage: new SecureStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
