import type { StoreSlice, MemberSlice } from './types';
import type { Member, Activity, AppNotification } from '../../types';

export const createMemberSlice: StoreSlice<MemberSlice> = (set) => ({
  members: [],

  addMember: (memberData) => set((state) => {
    const newMember: Member = {
      ...memberData,
      id: `m${Date.now()}`,
      activeTasks: 0
    };

    const newActivity: Activity = {
      id: `a${Date.now()}`,
      workspaceId: state.activeWorkspaceId,
      member: 'You',
      action: 'added team member',
      target: newMember.name,
      time: new Date().toISOString(),
      type: 'assign'
    };

    const newNotif: AppNotification = {
      id: `n${Date.now()}`,
      title: 'New Team Member',
      body: `${newMember.name} joined the workspace.`,
      time: new Date().toISOString(),
      read: false,
      type: 'system'
    };

    return { 
      members: [...state.members, newMember],
      activities: [newActivity, ...state.activities],
      notifications: [newNotif, ...state.notifications]
    };
  }),

  removeMember: (memberId) => set((state) => {
    const member = state.members.find(m => m.id === memberId);
    if (!member) return state;

    const newActivity: Activity = {
      id: `a${Date.now()}`,
      workspaceId: state.activeWorkspaceId,
      member: 'You',
      action: 'removed team member',
      target: member.name,
      time: new Date().toISOString(),
      type: 'update'
    };

    const newNotif: AppNotification = {
      id: `n${Date.now()}`,
      title: 'Member Removed',
      body: `${member.name} has been removed from the workspace.`,
      time: new Date().toISOString(),
      read: false,
      type: 'system'
    };

    return { 
      members: state.members.filter(m => m.id !== memberId),
      activities: [newActivity, ...state.activities],
      notifications: [newNotif, ...state.notifications]
    };
  })
});
