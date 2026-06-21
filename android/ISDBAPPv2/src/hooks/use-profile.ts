import {useState, useCallback} from 'react';
import {supabase} from '../services/supabase';
import type {Profile} from '../types';

/**
 * Hook for managing user profile operations
 */
export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get user profile by user ID
   */
  const getProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      try {
        const {data, error: fetchError} = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError) {throw fetchError;}
        return data;
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        return null;
      }
    },
    [],
  );

  /**
   * Create a new profile
   */
  const createProfile = useCallback(
    async (
      userId: string,
      profileData: {
        username: string;
        display_name?: string;
        bio?: string;
        country?: string;
        skills: string[];
        interests: string[];
      },
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const {error: insertError} = await supabase.from('profiles').insert({
          id: userId,
          username: profileData.username,
          display_name: profileData.display_name || null,
          bio: profileData.bio || null,
          country: profileData.country || null,
          skills: profileData.skills,
          interests: profileData.interests,
        });

        if (insertError) {
          throw insertError;
        }

        return true;
      } catch (err: any) {
        console.error('Error creating profile:', err);
        setError(err.message || 'Failed to create profile');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Update existing profile
   */
  const updateProfile = useCallback(
    async (
      userId: string,
      profileData: Partial<{
        username: string;
        display_name: string;
        bio: string;
        country: string;
        skills: string[];
        interests: string[];
      }>,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const {error: updateError} = await supabase
          .from('profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (updateError) {
          throw updateError;
        }

        return true;
      } catch (err: any) {
        console.error('Error updating profile:', err);
        setError(err.message || 'Failed to update profile');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Check if username is available
   */
  const checkUsernameAvailable = useCallback(
    async (username: string): Promise<boolean> => {
      try {
        const {data, error} = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        return !data;
      } catch (err) {
        console.error('Error checking username:', err);
        return false;
      }
    },
    [],
  );

  /**
   * Check if user profile is complete
   * A profile is complete if it has:
   * - username
   * - at least 1 skill
   * - at least 1 interest
   */
  const checkProfileComplete = useCallback(
    (profile: Profile | null): boolean => {
      if (!profile) {return false;}

      const hasUsername =
        !!profile.username && profile.username.trim().length > 0;
      const hasSkills = profile.skills && profile.skills.length > 0;
      const hasInterests = profile.interests && profile.interests.length > 0;

      return hasUsername && hasSkills && hasInterests;
    },
    [],
  );

  return {
    loading,
    error,
    getProfile,
    createProfile,
    updateProfile,
    checkUsernameAvailable,
    checkProfileComplete,
  };
}
