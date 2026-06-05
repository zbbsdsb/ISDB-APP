export type ProjectStatus = "looking" | "in_progress" | "completed";

export type ContactMethod = "github" | "discord" | "reddit" | "email";

export interface Project {
  id: string;
  owner_id: string;
  project_number?: number;
  title: string;
  description?: string;

  // Social links
  github_url?: string;
  demo_url?: string;
  discord_url?: string;
  reddit_url?: string;
  twitter_url?: string;
  website_url?: string;
  documentation_url?: string;

  // Images
  cover_image_url?: string;

  // Sponsorship
  sponsorship_enabled: boolean;
  sponsorship_goal?: number;
  sponsorship_current: number;
  sponsorship_description?: string;

  // Swipe card customization
  card_color?: string;
  hook_text?: string;
  featured_tags?: string[];
  custom_badge?: string;

  status: ProjectStatus;
  tags: string[];
  required_skills: string[];
  looking_for?: string;
  contact_method?: string;
  created_at: string;
  updated_at: string;
  owner?: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface ProjectFormData {
  title: string;
  description: string;
  github_url?: string;
  demo_url?: string;
  discord_url?: string;
  reddit_url?: string;
  twitter_url?: string;
  website_url?: string;
  documentation_url?: string;
  tags: string[];
  required_skills: string[];
  looking_for?: string;
  contact_method: ContactMethod;

  // Sponsorship
  sponsorship_enabled: boolean;
  sponsorship_goal?: number;
  sponsorship_description?: string;
}

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectInsert>;
