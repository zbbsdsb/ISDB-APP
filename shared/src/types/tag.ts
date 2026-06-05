export interface Tag {
  id: number;
  name: string;
  category: string;
  icon?: string;
  description?: string;
  created_at: string;
}

export type TagInsert = Omit<Tag, "id" | "created_at">;
