export type MatchStatus = "pending" | "accepted" | "rejected";

export interface Match {
  id: string;
  project_id: string;
  user_id: string;
  status: MatchStatus;
  message?: string;
  super_match?: boolean;
  created_at: string;
  project?: {
    id: string;
    title: string;
    owner_id: string;
  };
  user?: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export type MatchInsert = Omit<Match, "id" | "created_at">;
export type MatchUpdate = Partial<MatchInsert>;
