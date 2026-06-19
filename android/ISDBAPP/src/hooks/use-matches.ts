import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

export interface ProjectInfo {
  id: string;
  title: string;
  owner_id?: string;
}

export interface ProfileInfo {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  github_username?: string;
}

export interface MatchWithDetails {
  id: string;
  project_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string | null;
  super_match?: boolean;
  created_at: string;
  project?: ProjectInfo | null;
  applicant?: ProfileInfo | null;
  owner?: ProfileInfo | null;
}

interface RawIncomingMatch {
  id: string;
  project_id: string;
  user_id: string;
  status: string;
  message?: string | null;
  super_match?: boolean | null;
  created_at: string;
  project?: ProjectInfo | ProjectInfo[] | null;
  applicant?: ProfileInfo | ProfileInfo[] | null;
}

interface RawOutgoingMatch {
  id: string;
  project_id: string;
  user_id: string;
  status: string;
  message?: string | null;
  super_match?: boolean | null;
  created_at: string;
  project?: ProjectInfo | ProjectInfo[] | null;
  owner?: ProfileInfo | ProfileInfo[] | null;
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

function unwrapProject(p: ProjectInfo | ProjectInfo[] | null | undefined): ProjectInfo | undefined {
  if (!p) return undefined;
  if (Array.isArray(p)) return p[0];
  return p;
}

function unwrapProfile(p: ProfileInfo | ProfileInfo[] | null | undefined): ProfileInfo | undefined {
  if (!p) return undefined;
  if (Array.isArray(p)) return p[0];
  return p;
}

function normalizeStatus(status: string): 'pending' | 'accepted' | 'rejected' {
  if (status === 'accepted' || status === 'rejected') return status;
  return 'pending';
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
            display_name,
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
            display_name,
            avatar_url,
            github_username
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (outgoingError) throw outgoingError;

      const incomingArr = (incoming as unknown as RawIncomingMatch[] || []);
      const outgoingArr = (outgoing as unknown as RawOutgoingMatch[] || []);

      const mapIncoming = (m: RawIncomingMatch): MatchWithDetails => ({
        id: m.id,
        user_id: m.user_id,
        project_id: m.project_id,
        status: normalizeStatus(m.status),
        message: m.message ?? null,
        super_match: m.super_match ?? undefined,
        created_at: m.created_at,
        project: unwrapProject(m.project),
        applicant: unwrapProfile(m.applicant),
        owner: undefined,
      });

      const mapOutgoing = (m: RawOutgoingMatch): MatchWithDetails => ({
        id: m.id,
        user_id: m.user_id,
        project_id: m.project_id,
        status: normalizeStatus(m.status),
        message: m.message ?? null,
        super_match: m.super_match ?? undefined,
        created_at: m.created_at,
        project: unwrapProject(m.project),
        applicant: undefined,
        owner: unwrapProfile(m.owner),
      });

      setIncomingMatches(incomingArr.map(mapIncoming));
      setOutgoingMatches(outgoingArr.map(mapOutgoing));
    } catch (err: unknown) {
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
