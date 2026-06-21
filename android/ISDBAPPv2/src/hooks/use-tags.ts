import {useState, useEffect} from 'react';
import {supabase} from '../services/supabase';
import type {Tag} from '../types';

/**
 * Hook for fetching and managing available tags
 */
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all tags from database
   */
  const fetchTags = async (): Promise<Tag[]> => {
    setLoading(true);
    setError(null);

    try {
      const {data, error: fetchError} = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      setTags(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      setError(err.message || 'Failed to fetch tags');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search tags by name
   */
  const searchTags = (query: string): Tag[] => {
    if (!query.trim()) {
      return tags;
    }

    const lowerQuery = query.toLowerCase();
    return tags.filter(tag => tag.name.toLowerCase().includes(lowerQuery));
  };

  /**
   * Get tags by category
   */
  const getTagsByCategory = (): Record<string, Tag[]> => {
    const grouped: Record<string, Tag[]> = {};

    tags.forEach(tag => {
      const category = tag.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(tag);
    });

    return grouped;
  };

  /**
   * Get tag names as string array
   */
  const getTagNames = (): string[] => {
    return tags.map(tag => tag.name);
  };

  // Fetch tags on mount
  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    fetchTags,
    searchTags,
    getTagsByCategory,
    getTagNames,
  };
}
