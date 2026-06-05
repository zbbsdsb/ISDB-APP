export interface SwipeCard {
  project: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    required_skills: string[];
    github_url?: string;
    cover_image_url?: string;
    // Swipe card customization (author-controlled)
    card_color?: string;
    hook_text?: string;
    featured_tags?: string[];
    custom_badge?: string;
    owner: {
      username: string;
      display_name?: string;
      avatar_url?: string;
    };
  };
  matchScore: number;
  matchReasons: string[];
}

export interface SwipeAction {
  projectId: string;
  action: 'pass' | 'save' | 'match';
  superSwipe?: boolean;
}

export interface SwipeResult {
  success: boolean;
  isMatch?: boolean;
  matchId?: string;
}
