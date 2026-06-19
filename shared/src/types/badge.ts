export type BadgeTier = 'bronze' | 'silver' | 'gold';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  tier: BadgeTier;
  rarity: BadgeRarity;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export const BADGE_TIER_LABELS: Record<BadgeTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
};

export const BADGE_RARITY_LABELS: Record<BadgeRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};
