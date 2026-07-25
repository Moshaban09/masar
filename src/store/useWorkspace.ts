import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoreState } from './slices/types';
import { createWorkspaceSlice } from './slices/createWorkspaceSlice';
import { createProjectSlice } from './slices/createProjectSlice';
import { createTaskSlice } from './slices/createTaskSlice';
import { createMemberSlice } from './slices/createMemberSlice';
import { createNotificationSlice } from './slices/createNotificationSlice';

export const useWorkspace = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createWorkspaceSlice(set, get, api),
      ...createProjectSlice(set, get, api),
      ...createTaskSlice(set, get, api),
      ...createMemberSlice(set, get, api),
      ...createNotificationSlice(set, get, api),
    }),
    {
      name: 'masar-workspace-storage',
    }
  )
);
