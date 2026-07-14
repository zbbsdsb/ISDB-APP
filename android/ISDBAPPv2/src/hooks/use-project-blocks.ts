import {useState, useEffect} from 'react';
import {supabase} from '../services/supabase';
import type {ProjectBlock} from '@isdb/shared';
import logger from '../utils/logger';

interface UseProjectBlocksResult {
  blocks: ProjectBlock[];
  loading: boolean;
  error: string | null;
}

export function useProjectBlocks(projectId: string): UseProjectBlocksResult {
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    const load = async () => {
      setLoading(true);
      setError(null);
      const {data, error: fetchError} = await supabase
        .from('project_blocks')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_visible', true)
        .order('sort_order', {ascending: true});
      if (fetchError) {
        logger.error('[useProjectBlocks] fetch failed:', fetchError);
        setError(fetchError.message);
      } else if (data) {
        setBlocks(data as ProjectBlock[]);
      }
      setLoading(false);
    };
    load();
  }, [projectId]);

  return {blocks, loading, error};
}
