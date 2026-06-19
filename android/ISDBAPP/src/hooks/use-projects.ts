import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { Project, Profile } from '../types';

interface ProjectOwner {
  username?: string;
  display_name?: string;
  avatar_url?: string;
}

interface RawProject extends Omit<Project, 'owner'> {
  owner?: ProjectOwner | ProjectOwner[] | null;
}

interface ProjectWithOwner extends Project {
  owner?: Profile;
}

interface UseProjectsReturn {
  projects: ProjectWithOwner[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<string | null>;
  updateProject: (projectId: string, projectData: Partial<Project>) => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<boolean>;
}

function unwrapOwner(
  owner: ProjectOwner | ProjectOwner[] | null | undefined
): Profile | undefined {
  if (!owner) return undefined;
  const raw = Array.isArray(owner) ? owner[0] : owner;
  if (!raw) return undefined;
  return {
    username: raw.username || '',
    display_name: raw.display_name,
    avatar_url: raw.avatar_url,
  } as Profile;
}

export function useProjects(userId?: string): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectWithOwner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          owner:profiles!owner_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .neq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      const rawData = (data as unknown as RawProject[] || []);
      const projectsWithOwner: ProjectWithOwner[] = rawData.map((p) => ({
        ...p,
        sponsorship_enabled: p.sponsorship_enabled ?? false,
        sponsorship_current: p.sponsorship_current ?? 0,
        owner: unwrapOwner(p.owner),
      }));

      setProjects(projectsWithOwner);
    } catch (err: unknown) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (projectData: Partial<Project>): Promise<string | null> => {
      if (!userId) {
        setError('User not authenticated');
        return null;
      }

      try {
        const { data, error: insertError } = await supabase
          .from('projects')
          .insert({
            ...projectData,
            owner_id: userId,
            status: 'looking',
          })
          .select('id')
          .single();

        if (insertError) throw insertError;

        return (data as unknown as { id: string } | null)?.id || null;
      } catch (err: unknown) {
        console.error('Error creating project:', err);
        setError('Failed to create project');
        return null;
      }
    },
    [userId]
  );

  const updateProject = useCallback(
    async (projectId: string, projectData: Partial<Project>): Promise<boolean> => {
      try {
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            ...projectData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId);

        if (updateError) throw updateError;

        setProjects(prev =>
          prev.map(p =>
            p.id === projectId
              ? ({ ...p, ...projectData, updated_at: new Date().toISOString() } as ProjectWithOwner)
              : p
          )
        );

        return true;
      } catch (err: unknown) {
        console.error('Error updating project:', err);
        setError('Failed to update project');
        return false;
      }
    },
    []
  );

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (deleteError) throw deleteError;

      setProjects(prev => prev.filter(p => p.id !== projectId));

      return true;
    } catch (err: unknown) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
      return false;
    }
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
