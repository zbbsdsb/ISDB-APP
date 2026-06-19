import type { Tag } from '../types';

/**
 * Offline-first tag library used by onboarding and project listing
 * screens when the Supabase `tags` table is unreachable (or simply
 * not yet populated). Structurally compatible with the shared type.
 */
const DEFAULT_TAGS: Tag[] = [
  { id: 1, name: 'JavaScript', category: 'Languages', created_at: '' },
  { id: 2, name: 'TypeScript', category: 'Languages', created_at: '' },
  { id: 3, name: 'Python', category: 'Languages', created_at: '' },
  { id: 4, name: 'Go', category: 'Languages', created_at: '' },
  { id: 5, name: 'Rust', category: 'Languages', created_at: '' },
  { id: 6, name: 'Java', category: 'Languages', created_at: '' },
  { id: 7, name: 'Kotlin', category: 'Languages', created_at: '' },
  { id: 8, name: 'Swift', category: 'Languages', created_at: '' },
  { id: 9, name: 'C#', category: 'Languages', created_at: '' },
  { id: 10, name: 'C++', category: 'Languages', created_at: '' },
  { id: 11, name: 'Ruby', category: 'Languages', created_at: '' },

  { id: 12, name: 'React', category: 'Frameworks', created_at: '' },
  { id: 13, name: 'React Native', category: 'Frameworks', created_at: '' },
  { id: 14, name: 'Next.js', category: 'Frameworks', created_at: '' },
  { id: 15, name: 'Node.js', category: 'Frameworks', created_at: '' },
  { id: 16, name: 'Django', category: 'Frameworks', created_at: '' },
  { id: 17, name: 'FastAPI', category: 'Frameworks', created_at: '' },
  { id: 18, name: 'Spring', category: 'Frameworks', created_at: '' },

  { id: 19, name: 'UI/UX', category: 'Design', created_at: '' },
  { id: 20, name: 'Figma', category: 'Design', created_at: '' },
  { id: 21, name: 'Tailwind', category: 'Frontend', created_at: '' },
  { id: 22, name: 'CSS', category: 'Frontend', created_at: '' },

  { id: 23, name: 'iOS', category: 'Mobile', created_at: '' },
  { id: 24, name: 'Android', category: 'Mobile', created_at: '' },
  { id: 25, name: 'Flutter', category: 'Mobile', created_at: '' },

  { id: 26, name: 'PostgreSQL', category: 'Database', created_at: '' },
  { id: 27, name: 'MongoDB', category: 'Database', created_at: '' },
  { id: 28, name: 'Redis', category: 'Database', created_at: '' },
  { id: 29, name: 'Supabase', category: 'Backend', created_at: '' },
  { id: 30, name: 'Firebase', category: 'Backend', created_at: '' },
  { id: 31, name: 'AWS', category: 'Cloud', created_at: '' },
  { id: 32, name: 'Docker', category: 'DevOps', created_at: '' },
  { id: 33, name: 'Kubernetes', category: 'DevOps', created_at: '' },

  { id: 34, name: 'AI', category: 'AI/ML', created_at: '' },
  { id: 35, name: 'Machine Learning', category: 'AI/ML', created_at: '' },
  { id: 36, name: 'LLMs', category: 'AI/ML', created_at: '' },
  { id: 37, name: 'LLM Integration', category: 'AI/ML', created_at: '' },

  { id: 38, name: 'Backend', category: 'Role', created_at: '' },
  { id: 39, name: 'Frontend', category: 'Role', created_at: '' },
  { id: 40, name: 'Full-Stack', category: 'Role', created_at: '' },
  { id: 41, name: 'Mobile Dev', category: 'Role', created_at: '' },
  { id: 42, name: 'Product', category: 'Role', created_at: '' },
  { id: 43, name: 'Design', category: 'Role', created_at: '' },

  { id: 44, name: 'Open Source', category: 'Interests', created_at: '' },
  { id: 45, name: 'Startups', category: 'Interests', created_at: '' },
  { id: 46, name: 'Indie Hacking', category: 'Interests', created_at: '' },
  { id: 47, name: 'SaaS', category: 'Interests', created_at: '' },
  { id: 48, name: 'Mentoring', category: 'Interests', created_at: '' },
];

interface UseTagsReturn {
  tags: Tag[];
  loading: boolean;
  getTagNames: () => string[];
  getTagByCategory: (category: string) => Tag[];
}

export function useTags(): UseTagsReturn {
  return {
    tags: DEFAULT_TAGS,
    loading: false,
    getTagNames: () => DEFAULT_TAGS.map((t) => t.name),
    getTagByCategory: (category: string) =>
      DEFAULT_TAGS.filter((t) => t.category === category),
  };
}
