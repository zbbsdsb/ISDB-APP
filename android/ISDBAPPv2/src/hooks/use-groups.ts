import {useState, useCallback} from 'react';
import {supabase} from '../services/supabase';
import {useAuthStore} from '../store/auth-store';
import {useGroupStore} from '../store/group-store';
import type {Group, GroupMember, GroupWithDetails} from '@isdb/shared';

interface UseGroupsResult {
  loading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  fetchMyGroupIds: () => Promise<void>;
  fetchGroupDetail: (groupId: string) => Promise<GroupWithDetails | null>;
  fetchGroupMembers: (groupId: string) => Promise<GroupMember[]>;
  createGroup: (data: {
    name: string;
    description?: string;
    tags?: string[];
  }) => Promise<string | null>;
  joinGroup: (groupId: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
}

export function useGroups(): UseGroupsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(s => s.user);
  const {
    setGroups,
    setJoinedGroupIds,
    joinGroup: storeJoin,
    leaveGroup: storeLeave,
  } = useGroupStore();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const {data, error: fetchError} = await supabase
        .from('groups')
        .select('*')
        .order('created_at', {ascending: false});

      if (fetchError) {throw fetchError;}
      if (data) {setGroups(data as Group[]);}
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setGroups]);

  const fetchMyGroupIds = useCallback(async () => {
    if (!user) {return;}
    try {
      const {data, error: fetchError} = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (fetchError) {throw fetchError;}
      if (data) {setJoinedGroupIds(data.map(m => m.group_id));}
    } catch (err: any) {
      console.error('Error fetching my groups:', err);
    }
  }, [user, setJoinedGroupIds]);

  const fetchGroupDetail = useCallback(
    async (groupId: string): Promise<GroupWithDetails | null> => {
      try {
        const {data, error: fetchError} = await supabase
          .from('groups')
          .select(
            '*, owner:profiles!owner_id(id, username, display_name, avatar_url, identity_number)',
          )
          .eq('id', groupId)
          .single();

        if (fetchError) {throw fetchError;}

        // Get member count
        const {count} = await supabase
          .from('group_members')
          .select('*', {count: 'exact', head: true})
          .eq('group_id', groupId);

        const isMember = !!user && (await checkMembership(groupId));
        const userRole = isMember ? await getUserRole(groupId) : null;

        return {
          ...data,
          member_count: count || 0,
          is_member: isMember,
          user_role: userRole,
        } as GroupWithDetails;
      } catch (err: any) {
        console.error('Error fetching group detail:', err);
        return null;
      }
    },
    [user, checkMembership, getUserRole],
  );

  const checkMembership = useCallback(async (groupId: string): Promise<boolean> => {
    if (!user) {return false;}
    const {data} = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .maybeSingle();
    return !!data;
  }, [user]);

  const getUserRole = useCallback(async (
    groupId: string,
  ): Promise<'owner' | 'admin' | 'member' | null> => {
    if (!user) {return null;}
    const {data} = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();
    return data?.role || null;
  }, [user]);

  const fetchGroupMembers = useCallback(
    async (groupId: string): Promise<GroupMember[]> => {
      try {
        const {data, error: fetchError} = await supabase
          .from('group_members')
          .select('*')
          .eq('group_id', groupId);

        if (fetchError) {throw fetchError;}
        return data || [];
      } catch (err: any) {
        console.error('Error fetching members:', err);
        return [];
      }
    },
    [],
  );

  const createGroup = useCallback(
    async (data: {
      name: string;
      description?: string;
      tags?: string[];
    }): Promise<string | null> => {
      if (!user) {return null;}
      setLoading(true);
      try {
        const {data: newGroup, error: insertError} = await supabase
          .from('groups')
          .insert({
            name: data.name,
            description: data.description || null,
            owner_id: user.id,
            is_public: true,
          })
          .select()
          .single();

        if (insertError) {throw insertError;}

        // Auto-join as owner
        await supabase.from('group_members').insert({
          group_id: newGroup.id,
          user_id: user.id,
          role: 'owner',
        });

        storeJoin(newGroup.id);
        return newGroup.id;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, storeJoin],
  );

  const joinGroup = useCallback(
    async (groupId: string): Promise<boolean> => {
      if (!user) {return false;}
      try {
        const {error: joinError} = await supabase.from('group_members').insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
        });

        if (joinError) {throw joinError;}
        storeJoin(groupId);
        return true;
      } catch (err: any) {
        setError(err.message);
        return false;
      }
    },
    [user, storeJoin],
  );

  const leaveGroup = useCallback(
    async (groupId: string): Promise<boolean> => {
      if (!user) {return false;}
      try {
        const {error: leaveError} = await supabase
          .from('group_members')
          .delete()
          .eq('group_id', groupId)
          .eq('user_id', user.id);

        if (leaveError) {throw leaveError;}
        storeLeave(groupId);
        return true;
      } catch (err: any) {
        setError(err.message);
        return false;
      }
    },
    [user, storeLeave],
  );

  return {
    loading,
    error,
    fetchGroups,
    fetchMyGroupIds,
    fetchGroupDetail,
    fetchGroupMembers,
    createGroup,
    joinGroup,
    leaveGroup,
  };
}
