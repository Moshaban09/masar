import type { StoreSlice, ProjectSlice } from './types';
import type { Project, Activity, AppNotification } from '../../types';

export const createProjectSlice: StoreSlice<ProjectSlice> = (set) => ({
  projects: [],
  addProject: (projectData) => set((state) => {
    const newProject: Project = {
      ...projectData,
      id: `p${Date.now()}`,
      tasksTotal: 0,
      tasksDone: 0,
      progress: 0,
      updatedAt: new Date().toISOString()
    };

    const newActivity: Activity = {
      id: `a${Date.now()}`,
      workspaceId: state.activeWorkspaceId,
      member: 'You',
      action: 'created project',
      target: newProject.name,
      time: new Date().toISOString(),
      type: 'create'
    };

    const newNotif: AppNotification = {
      id: `n${Date.now()}`,
      title: 'Project Created',
      body: `Project "${newProject.name}" was successfully created.`,
      time: new Date().toISOString(),
      read: false,
      type: 'system'
    };

    return { 
      projects: [...state.projects, newProject],
      activities: [newActivity, ...state.activities],
      notifications: [newNotif, ...state.notifications]
    };
  }),

  deleteProject: (projectId) => set((state) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return state;

    const updatedProjects = state.projects.filter(p => p.id !== projectId);
    const updatedTasks = state.tasks.filter(t => t.projectId !== projectId);

    const newActivity: Activity = {
      id: `a${Date.now()}`,
      workspaceId: state.activeWorkspaceId,
      member: 'You',
      action: 'deleted project',
      target: project.name,
      time: new Date().toISOString(),
      type: 'update'
    };

    const newNotif: AppNotification = {
      id: `n${Date.now()}`,
      title: 'Project Deleted',
      body: `Project "${project.name}" has been permanently removed.`,
      time: new Date().toISOString(),
      read: false,
      type: 'system'
    };

    return {
      projects: updatedProjects,
      tasks: updatedTasks,
      activities: [newActivity, ...state.activities],
      notifications: [newNotif, ...state.notifications]
    };
  })
});
