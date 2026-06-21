import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/auth-store';
import type { Badge, UserBadge } from '@isdb/shared';

interface UseBadgesResult {
  badges: Badge[];
  userBadges: Set<string>;
  loading: boolean;
}

export function useBadges(): UseBadgesResult {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: allBadges }, { data: myBadges }] = await Promise.all([
        supabase.from('badges').select('*').order('tier', { ascending: true }),
        user ? supabase.from('user_badges').select('badge_id').eq('user_id', user.id) : Promise.resolve({ data: [] }),
      ]);
      if (allBadges) setBadges(allBadges as Badge[]);
      if (myBadges) setUserBadges(new Set(myBadges.map((b: any) => b.badge_id)));
      setLoading(false);
    };
    load();
  }, [user]);

  return { badges, userBadges, loading };
}

// Tier color mapping
export const TIER_COLORS: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
};