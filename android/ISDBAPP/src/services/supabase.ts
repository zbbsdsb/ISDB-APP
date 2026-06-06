import 'react-native-gesture-handler';
import { createClient } from '@supabase/supabase-js';
import * as Keychain from 'react-native-keychain';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/supabase';

class SecureStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
    } catch (error) {
      console.error('Error storing credential:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      console.error('Error removing credential:', error);
    }
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: new SecureStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
