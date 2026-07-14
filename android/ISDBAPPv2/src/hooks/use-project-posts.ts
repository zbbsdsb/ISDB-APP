import {useState, useEffect, useCallback} from 'react';
import {supabase} from '../services/supabase';
import {useAuthStore} from '../store/auth-store';
import type {ProjectPost} from '@isdb/shared';
import logger from '../utils/logger';

interface UseProjectPostsResult {
  posts: ProjectPost[];
  loading: boolean;
  error: string | null;
  createPost: (content: string, type: string) => Promise<boolean>;
}

export function useProjectPosts(projectId: string): UseProjectPostsResult {
  const [posts, setPosts] = useState<ProjectPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    const load = async () => {
      setLoading(true);
      setError(null);
      const {data, error: fetchError} = await supabase
        .from('project_posts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', {ascending: false});
      if (fetchError) {
        logger.error('[useProjectPosts] fetch failed:', fetchError);
        setError(fetchError.message);
      } else if (data) {
        setPosts(data as ProjectPost[]);
      }
      setLoading(false);
    };
    load();
  }, [projectId]);

  const createPost = useCallback(
    async (content: string, type: string = 'update'): Promise<boolean> => {
      if (!user || !projectId) {
        return false;
      }
      const {error: insertError} = await supabase
        .from('project_posts')
        .insert({
          project_id: projectId,
          user_id: user.id,
          content,
          type,
      });
      if (insertError) {
        logger.error('Error creating post:', insertError);
        return false;
      }
      // Refetch
      const {data} = await supabase
        .from('project_posts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', {ascending: false});
      if (data) {
        setPosts(data as ProjectPost[]);
      }
      return true;
    },
    [user, projectId],
  );

  return {posts, loading, error, createPost};
}
