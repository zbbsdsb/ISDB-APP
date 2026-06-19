export type BlockType =
  | 'readme'
  | 'roadmap'
  | 'team'
  | 'skills'
  | 'github_stats'
  | 'activity'
  | 'badge'
  | 'cta';

export interface ProjectBlock {
  id: string;
  project_id: string;
  block_type: BlockType;
  sort_order: number;
  config: Record<string, any>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  target_date: string | null;
}

export interface ReadmeConfig {
  content: string;
}

export interface RoadmapConfig {
  milestones: Milestone[];
}

export interface TeamConfig {
  show_roles: boolean;
  max_display: number;
}

export interface SkillsConfig {
  required: string[];
  preferred: string[];
}

export interface GithubStatsConfig {
  repo_url: string;
}

export interface CtaConfig {
  text: string;
  url: string;
}
