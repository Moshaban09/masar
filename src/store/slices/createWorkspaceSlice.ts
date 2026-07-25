import type { StoreSlice, WorkspaceSlice } from './types';

export const createWorkspaceSlice: StoreSlice<WorkspaceSlice> = (set) => ({
  activeWorkspaceId: 'w1',
  activities: [],
  switchWorkspace: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
  addActivity: (activityData) => set((state) => {
    const newActivity = {
      ...activityData,
      id: `a${Date.now()}`,
      time: new Date().toISOString()
    };
    return { activities: [newActivity, ...state.activities] };
  }),
  clearWorkspace: () => set({
    projects: [],
    tasks: [],
    members: [],
    activities: [],
    notifications: [],
  })
});
