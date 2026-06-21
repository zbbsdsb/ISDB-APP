import { useState, useCallback, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/auth-store';

export interface SwipeProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  required_skills: string[];
  github_url?: string;
  card_color?: string;
  hook_text?: string;
  owner: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export type SwipeActionType = 'pass' | 'save' | 'match';

interface UseSwipeResult {
  projects: SwipeProject[];
  loading: boolean;
  error: string | null;
  currentIndex: number;
  loadProjects: () => Promise<void>;
  submitSwipe: (projectId: string, action: SwipeActionType) => Promise<{ isMatch: boolean; matchId?: string } | null>;
  undoLastSwipe: () => Promise<void>;
  canUndo: boolean;
}

export function useSwipe(): UseSwipeResult {
  const [projects, setProjects] = useState<SwipeProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = useAuthStore((s) => s.user);
  const lastSwipeRef = useRef<{ projectId: string; swipeId?: string; action: SwipeActionType } | null>(null);
  const [canUndo, setCanUndo] = useState(false);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Get projects the user hasn't swiped on yet
      const { data: swipedIds } = await supabase
        .from('swipes')
        .select('project_id')
        .eq('user_id', user.id);

      const excludeIds = swipedIds?.map((s) => s.project_id) || [];

      let query = supabase
        .from('projects')
        .select('id, title, description, tags, required_skills, github_url, card_color, hook_text, owner:profiles!owner_id(username, display_name, avatar_url)')
        .not('owner_id', 'eq', user.id);

      if (excludeIds.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`);
      }

      const { data, error: fetchError } = await query.limit(20);

      if (fetchError) throw fetchError;
      setProjects((data || []) as unknown as SwipeProject[]);
      setCurrentIndex(0);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const submitSwipe = useCallback(async (
    projectId: string,
    action: SwipeActionType
  ): Promise<{ isMatch: boolean; matchId?: string } | null> => {
    if (!user) return null;
    try {
      const { data, error: insertError } = await supabase
        .from('swipes')
        .insert({ user_id: user.id, project_id: projectId, action })
        .select('id')
        .single();

      if (insertError) throw insertError;

      lastSwipeRef.current = { projectId, swipeId: data.id, action };
      setCanUndo(true);
      setCurrentIndex((prev) => prev + 1);

      // If action is 'match', create a match record
      if (action === 'match') {
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .insert({
            user1_id: user.id,
            user2_id: (projects[currentIndex] as any).owner_id || null, // project owner
            project_id: projectId,
            status: 'pending',
          })
          .select('id')
          .single();

        if (matchError) throw matchError;

        return { isMatch: true, matchId: matchData?.id };
      }

      return { isMatch: false };
    } catch (err: any) {
      console.error('Error submitting swipe:', err);
      return null;
    }
  }, [user, projects, currentIndex]);

  const undoLastSwipe = useCallback(async () => {
    if (!lastSwipeRef.current) return;
    const { swipeId } = lastSwipeRef.current;
    try {
      if (swipeId) {
        await supabase.from('swipes').delete().eq('id', swipeId);
      }
      lastSwipeRef.current = null;
      setCanUndo(false);
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error undoing swipe:', err);
    }
  }, []);

  return {
    projects,
    loading,
    error,
    currentIndex,
    loadProjects,
    submitSwipe,
    undoLastSwipe,
    canUndo,
  };
}
