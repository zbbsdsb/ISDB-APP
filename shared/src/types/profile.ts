export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  age?: number;
  github_username?: string;
  discord_id?: string;
  discord_username?: string;
  reddit_username?: string;
  skills: string[];
  interests: string[];
  country?: string;
  // Synced from Web 版
  goal?: 'seeking' | 'recruiting' | 'both';
  identity_number?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  signup_channel?: string;
  // ---
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<ProfileInsert>;
