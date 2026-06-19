export interface ProjectPost {
  id: string;
  project_id: string;
  author_id: string;
  type: 'update' | 'milestone' | 'question' | 'link';
  title?: string | null;
  content: string;
  url?: string | null;
  created_at: string;
  updated_at: string;

  author?: {
    identity_number: number;
    display_name: string | null;
    avatar_url: string | null;
  };
}
