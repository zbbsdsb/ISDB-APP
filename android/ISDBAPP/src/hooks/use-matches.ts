import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { Match } from '@isdb/shared';

interface MatchWithDetails {
  id: string;
  project_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  super_match?: boolean;
  created_at: string;
  project?: {
    id: string;
    title: string;
    owner_id?: string;
  };
  applicant?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    github_username?: string | null;
  };
  owner?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    github_username?: string | null;
  };
}

interface UseMatchesReturn {
  incomingMatches: MatchWithDetails[];
  outgoingMatches: MatchWithDetails[];
  loading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  acceptMatch: (matchId: string) => Promise<boolean>;
  rejectMatch: (matchId: string) => Promise<boolean>;
}

export function useMatches(userId: string): UseMatchesReturn {
  const [incomingMatches, setIncomingMatches] = useState<MatchWithDetails[]>([]);
  const [outgoingMatches, setOutgoingMatches] = useState<MatchWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: incoming, error: incomingError } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          message,
          created_at,
          project:projects!inner (
            id,
            title,
            owner_id
          ),
          applicant:profiles!matches_user_id_fkey (
            id,
            username,
            avatar_url,
            github_username
          )
        `)
        .eq('project.owner_id', userId)
        .order('created_at', { ascending: false });

      if (incomingError) throw incomingError;

      const { data: outgoing, error: outgoingError } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          message,
          created_at,
          project:projects!inner (
            id,
            title
          ),
          owner:profiles!inner (
            id,
            username,
            avatar_url,
            github_username
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (outgoingError) throw outgoingError;

      const mapMatch = (m: any): MatchWithDetails => ({
        id: m.id,
        user_id: m.user_id,
        project_id: m.project_id,
        status: m.status,
        message: m.message,
        created_at: m.created_at,
        project: Array.isArray(m.project) ? m.project[0] : m.project,
        applicant: Array.isArray(m.applicant) ? m.applicant[0] : m.applicant,
        owner: Array.isArray(m.owner) ? m.owner[0] : m.owner,
      });

      setIncomingMatches((incoming || []).map(mapMatch));
      setOutgoingMatches((outgoing || []).map(mapMatch));
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const acceptMatch = useCallback(async (matchId: string): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('matches')
        .update({ status: 'accepted' })
        .eq('id', matchId);

      if (updateError) throw updateError;

      setIncomingMatches(prev =>
        prev.map(m => m.id === matchId ? { ...m, status: 'accepted' } : m)
      );

      return true;
    } catch (err) {
      console.error('Error accepting match:', err);
      return false;
    }
  }, []);

  const rejectMatch = useCallback(async (matchId: string): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('matches')
        .update({ status: 'rejected' })
        .eq('id', matchId);

      if (updateError) throw updateError;

      setIncomingMatches(prev =>
        prev.map(m => m.id === matchId ? { ...m, status: 'rejected' } : m)
      );

      return true;
    } catch (err) {
      console.error('Error rejecting match:', err);
      return false;
    }
  }, []);

  return {
    incomingMatches,
    outgoingMatches,
    loading,
    error,
    fetchMatches,
    acceptMatch,
    rejectMatch,
  };
}
