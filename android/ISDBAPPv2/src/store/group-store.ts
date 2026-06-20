import { create } from 'zustand';
import type { Group } from '@isdb/shared';

interface GroupStore {
  groups: Group[];
  joinedGroupIds: Set<string>;
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  setJoinedGroupIds: (ids: string[]) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  joinedGroupIds: new Set(),

  setGroups: (groups) => set({ groups }),

  addGroup: (group) =>
    set((state) => ({ groups: [group, ...state.groups] })),

  setJoinedGroupIds: (ids) =>
    set({ joinedGroupIds: new Set(ids) }),

  joinGroup: (groupId) =>
    set((state) => {
      const next = new Set(state.joinedGroupIds);
      next.add(groupId);
      return { joinedGroupIds: next };
    }),

  leaveGroup: (groupId) =>
    set((state) => {
      const next = new Set(state.joinedGroupIds);
      next.delete(groupId);
      return { joinedGroupIds: next };
    }),
}));
