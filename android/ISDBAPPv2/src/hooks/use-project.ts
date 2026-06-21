import {useState, useEffect, useCallback} from 'react';
import {supabase} from '../services/supabase';
import type {Project} from '@isdb/shared';

interface UseProjectResult {
  project: Project | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useProject(projectId: string): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {data, error: fetchError} = await supabase
        .from('projects')
        .select(
          '*, owner:profiles!owner_id(username, display_name, avatar_url)',
        )
        .eq('id', projectId)
        .single();

      if (fetchError) {
        throw fetchError;
      }
      setProject(data as unknown as Project);
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

  return {project, loading, error, refresh: fetchProject};
}
