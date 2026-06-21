import {useState, useCallback, useRef, useEffect} from 'react';
import {supabase} from '../services/supabase';
import {useAuthStore} from '../store/auth-store';

export interface SwipeProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  required_skills: string[];
  github_url?: string;
  cover_image_url?: string;
  card_color?: string;
  hook_text?: string;
  owner: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export type SwipeActionType = 'pass' | 'save' | 'match';

const PAGE_SIZE = 20;

interface UseSwipeResult {
  projects: SwipeProject[];
  loading: boolean;
  error: string | null;
  currentIndex: number;
  loadProjects: () => Promise<void>;
  submitSwipe: (
    projectId: string,
    action: SwipeActionType,
  ) => Promise<{isMatch: boolean; matchId?: string} | null>;
  undoLastSwipe: () => Promise<void>;
  canUndo: boolean;
  hasMore: boolean;
  loadingMore: boolean;
}

export function useSwipe(): UseSwipeResult {
  const [projects, setProjects] = useState<SwipeProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const user = useAuthStore(s => s.user);
  const lastSwipeRef = useRef<{
    projectId: string;
    swipeId?: string;
    action: SwipeActionType;
  } | null>(null);
  const [canUndo, setCanUndo] = useState(false);

  const loadProjects = useCallback(
    async (pageNum = 0) => {
      if (!user) {return;}
      setLoading(pageNum === 0);
      setLoadingMore(pageNum > 0);
      setError(null);
      try {
        // Get projects the user hasn't swiped on yet
        const {data: swipedIds} = await supabase
          .from('swipes')
          .select('project_id')
          .eq('user_id', user.id);

        const excludeIds = swipedIds?.map(s => s.project_id) || [];

        let query = supabase
          .from('projects')
          .select(
            'id, title, description, tags, required_skills, github_url, cover_image_url, card_color, hook_text, owner:profiles!owner_id(username, display_name, avatar_url)',
          )
          .not('owner_id', 'eq', user.id);

        // Use array-based filter (SQL injection safe)
        if (excludeIds.length > 0) {
          query = query.filter('id', 'not.in', excludeIds);
        }

        const rangeStart = pageNum * PAGE_SIZE;
        const rangeEnd = rangeStart + PAGE_SIZE - 1;
        const {data, error: fetchError} = await query.range(
          rangeStart,
          rangeEnd,
        );

        if (fetchError) {throw fetchError;}
        const fetched = (data || []) as unknown as SwipeProject[];
        if (pageNum === 0) {
          setProjects(fetched);
        } else {
          setProjects(prev => [...prev, ...fetched]);
        }
        setHasMore(fetched.length === PAGE_SIZE);
        if (pageNum === 0) {setCurrentIndex(0);}
      } catch (err: any) {
        console.error('Error loading projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user],
  );

  const submitSwipe = useCallback(
    async (
      projectId: string,
      action: SwipeActionType,
    ): Promise<{isMatch: boolean; matchId?: string} | null> => {
      if (!user) {return null;}
      try {
        const {data, error: insertError} = await supabase
          .from('swipes')
          .insert({user_id: user.id, project_id: projectId, action})
          .select('id')
          .single();

        if (insertError) {throw insertError;}

        lastSwipeRef.current = {projectId, swipeId: data.id, action};
        setCanUndo(true);
        setCurrentIndex(prev => prev + 1);

        // If action is 'match', create a match record
        if (action === 'match') {
          const currentProject = projects[currentIndex];
          const {data: matchData, error: matchError} = await supabase
            .from('matches')
            .insert({
              user1_id: user.id,
              user2_id: (currentProject as any)?.owner_id || null,
              project_id: projectId,
              status: 'pending',
            })
            .select('id')
            .single();

          if (matchError) {throw matchError;}

          return {isMatch: true, matchId: matchData?.id};
        }

        return {isMatch: false};
      } catch (err: any) {
        console.error('Error submitting swipe:', err);
        // Re-throw so the caller (submitAndAnimate) can handle the error
        throw err;
      }
    },
    [user, projects, currentIndex],
  );

  const undoLastSwipe = useCallback(async () => {
    if (!lastSwipeRef.current) {return;}
    const {swipeId, projectId, action} = lastSwipeRef.current;
    try {
      if (swipeId) {
        await supabase.from('swipes').delete().eq('id', swipeId);
      }
      // If the swipe was a 'match', also delete the match record
      if (action === 'match' && user) {
        await supabase
          .from('matches')
          .delete()
          .eq('project_id', projectId)
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      }
      lastSwipeRef.current = null;
      setCanUndo(false);
      setCurrentIndex(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error undoing swipe:', err);
    }
  }, [user]);

  // Auto-load more when nearing the end of the current page
  useEffect(() => {
    const remaining = projects.length - currentIndex;
    if (remaining <= 3 && hasMore && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProjects(nextPage);
    }
  }, [
    currentIndex,
    projects.length,
    hasMore,
    loadingMore,
    loading,
    page,
    loadProjects,
  ]);

  return {
    projects,
    loading,
    error,
    currentIndex,
    loadProjects: () => loadProjects(0),
    submitSwipe,
    undoLastSwipe,
    canUndo,
    hasMore,
    loadingMore,
  };
}
