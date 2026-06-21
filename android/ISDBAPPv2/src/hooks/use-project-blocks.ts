import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { ProjectBlock } from '@isdb/shared';

interface UseProjectBlocksResult {
  blocks: ProjectBlock[];
  loading: boolean;
}

export function useProjectBlocks(projectId: string): UseProjectBlocksResult {
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('project_blocks')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (data) setBlocks(data as ProjectBlock[]);
      setLoading(false);
    };
    load();
  }, [projectId]);

  return { blocks, loading };
}