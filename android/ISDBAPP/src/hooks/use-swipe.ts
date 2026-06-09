import { useState, useCallback, useRef } from 'react';
import { supabase } from '../services/supabase';
import type { Project } from '../types';

interface SwipeCard {
  project: Project;
  matchScore: number;
  matchReasons: string[];
}

interface SwipeHistory {
  card: SwipeCard;
  action: 'pass' | 'save' | 'match';
  swipeId?: string;
  matchId?: string | null;
}

interface UseSwipeReturn {
  cards: SwipeCard[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
  isTransitioning: boolean;
  canUndo: boolean;
  history: SwipeHistory[];
  fetchCards: () => Promise<void>;
  recordSwipe: (projectId: string, action: 'pass' | 'save' | 'match') => Promise<{ swipeId?: string }>;
  createMatch: (projectId: string) => Promise<string | null>;
  handleSwipe: (direction: 'left' | 'right' | 'down') => Promise<void>;
  undoSwipe: () => Promise<void>;
}

export function useSwipe(
  userId: string,
  userSkills: string[],
  userInterests: string[]
): UseSwipeReturn {
  const [cards, setCards] = useState<SwipeCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [history, setHistory] = useState<SwipeHistory[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateMatchScore = useCallback(
    (project: Project): { score: number; reasons: string[] } => {
      const reasons: string[] = [];
      let totalScore = 0;

      const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
      const normalizedUserInterests = userInterests.map(i => i.toLowerCase().trim());
      const normalizedRequiredSkills = (project.required_skills || []).map(s => s.toLowerCase().trim());
      const normalizedProjectTags = (project.tags || []).map(t => t.toLowerCase().trim());

      const exactSkillMatches = normalizedRequiredSkills.filter(skill =>
        normalizedUserSkills.includes(skill)
      );

      const partialSkillMatches = normalizedRequiredSkills.filter(skill =>
        !normalizedUserSkills.includes(skill) &&
        normalizedUserSkills.some(userSkill =>
          skill.includes(userSkill) || userSkill.includes(skill)
        )
      );

      const exactSkillScore = Math.min(exactSkillMatches.length * 8, 45);
      const partialSkillScore = Math.min(partialSkillMatches.length * 3, 10);
      const totalSkillScore = exactSkillScore + partialSkillScore;

      if (exactSkillMatches.length > 0) {
        reasons.push(`${exactSkillMatches.length} matching skill${exactSkillMatches.length > 1 ? 's' : ''}`);
      }

      const exactInterestMatches = normalizedProjectTags.filter(tag =>
        normalizedUserInterests.includes(tag)
      );

      const partialInterestMatches = normalizedProjectTags.filter(tag =>
        !normalizedUserInterests.includes(tag) &&
        normalizedUserInterests.some(userInterest =>
          tag.includes(userInterest) || userInterest.includes(tag)
        )
      );

      const exactInterestScore = Math.min(exactInterestMatches.length * 6, 28);
      const partialInterestScore = Math.min(partialInterestMatches.length * 2, 7);
      const totalInterestScore = exactInterestScore + partialInterestScore;

      if (exactInterestMatches.length > 0) {
        reasons.push(`${exactInterestMatches.length} matching interest`);
      }

      if (normalizedRequiredSkills.length > 0 &&
          exactSkillMatches.length >= normalizedRequiredSkills.length * 0.7) {
        totalScore += 10;
        reasons.push('Great fit!');
      }

      totalScore = totalSkillScore + totalInterestScore;

      return { score: Math.min(totalScore, 100), reasons };
    },
    [userSkills, userInterests]
  );

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: swipedProjectIds, error: swipedError } = await supabase
        .from('swipes')
        .select('project_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(200);

      if (swipedError) throw swipedError;

      const swipedIds = swipedProjectIds?.map(s => s.project_id) || [];
      const swipedIdSet = new Set(swipedIds);

      let query = supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          tags,
          required_skills,
          github_url,
          owner:profiles!owner_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('status', 'looking')
        .neq('owner_id', userId)
        .limit(20);

      if (swipedIds.length > 0 && swipedIds.length <= 50) {
        query = query.not('id', 'in', `(${swipedIds.join(',')})`);
      }

      const { data: projects, error: projectsError } = await query;

      if (projectsError) throw projectsError;

      const filteredProjects = (projects || []).filter(
        (p: any) => !swipedIdSet.has(p.id)
      );

      if (filteredProjects.length === 0) {
        setCards([]);
        setLoading(false);
        return;
      }

      const cardsWithMatchScores: SwipeCard[] = filteredProjects
        .map((project: any) => {
          const owner = Array.isArray(project.owner) && project.owner.length > 0
            ? project.owner[0]
            : { username: 'unknown', display_name: undefined, avatar_url: undefined };

          const transformedProject = {
            id: project.id,
            title: project.title,
            description: project.description || '',
            tags: project.tags || [],
            required_skills: project.required_skills || [],
            github_url: project.github_url,
            owner_id: userId,
            status: 'looking' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sponsorship_enabled: false,
            sponsorship_current: 0,
            owner: owner as any,
          };

          const { score, reasons } = calculateMatchScore(transformedProject);
          return {
            project: transformedProject,
            matchScore: score,
            matchReasons: reasons,
          };
        })
        .sort((a: SwipeCard, b: SwipeCard) => b.matchScore - a.matchScore);

      setCards(cardsWithMatchScores);
      setCurrentIndex(0);
    } catch (err: any) {
      console.error('Error fetching cards:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, calculateMatchScore]);

  const recordSwipe = useCallback(
    async (projectId: string, action: 'pass' | 'save' | 'match'): Promise<{ swipeId?: string }> => {
      const { data, error } = await supabase
        .from('swipes')
        .insert({
          user_id: userId,
          project_id: projectId,
          action,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error recording swipe:', error);
        return {};
      }

      return { swipeId: data?.id };
    },
    [userId]
  );

  const createMatch = useCallback(
    async (projectId: string): Promise<string | null> => {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          user_id: userId,
          project_id: projectId,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating match:', error);
        return null;
      }

      return data?.id || null;
    },
    [userId]
  );

  const undoSwipe = useCallback(async () => {
    if (history.length === 0 || isTransitioning) return;

    const lastSwipe = history[history.length - 1];

    if (lastSwipe.swipeId) {
      await supabase.from('swipes').delete().eq('id', lastSwipe.swipeId);
    }

    if (lastSwipe.matchId) {
      await supabase.from('matches').delete().eq('id', lastSwipe.matchId);
    }

    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => Math.max(0, prev - 1));

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    if (history.length <= 1) {
      setCanUndo(false);
    }
  }, [history, isTransitioning]);

  const handleSwipe = useCallback(
    async (direction: 'left' | 'right' | 'down') => {
      if (isTransitioning || currentIndex >= cards.length) return;
      setIsTransitioning(true);

      const currentCard = cards[currentIndex];

      const actionMap = {
        left: 'pass',
        right: 'match',
        down: 'save',
      } as const;

      const action = actionMap[direction];
      const { swipeId } = await recordSwipe(currentCard.project.id, action);

      let matchId: string | null = null;
      if (direction === 'right') {
        matchId = await createMatch(currentCard.project.id);
      }

      setHistory(prev => [...prev, { card: currentCard, action, swipeId, matchId }]);

      setCanUndo(true);
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      undoTimeoutRef.current = setTimeout(() => {
        setCanUndo(false);
      }, 10000);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    },
    [currentIndex, cards, isTransitioning, recordSwipe, createMatch]
  );

  return {
    cards,
    currentIndex,
    loading,
    error,
    isTransitioning,
    canUndo,
    history,
    fetchCards,
    recordSwipe,
    createMatch,
    handleSwipe,
    undoSwipe,
  };
}
