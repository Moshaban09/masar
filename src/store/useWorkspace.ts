import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import type { Project, Task, Member, Activity, TaskStatus, AppNotification } from '../types';
import { mockProjects, mockTasks, mockMembers, mockActivities, mockNotifications } from '../data/mockData';

interface WorkspaceState {
  activeWorkspaceId: string;
  projects: Project[];
  tasks: Task[];
  members: Member[];
  activities: Activity[];
  notifications: AppNotification[];
  
  // Actions
  switchWorkspace: (workspaceId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'tasksTotal' | 'tasksDone' | 'progress' | 'updatedAt'>) => void;
  addTask: (task: Omit<Task, 'id' | 'subTasks' | 'comments'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleTaskStatus: (taskId: string) => void;
  reorderTask: (activeId: string, overId: string, newStatus?: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  addMember: (member: Omit<Member, 'id' | 'activeTasks'>) => void;
  removeMember: (memberId: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  addSubTask: (taskId: string, title: string) => void;
  addTaskComment: (taskId: string, memberName: string, avatar: string, body: string) => void;
  markNotificationRead: (notificationId: string) => void;
  clearWorkspace: () => void;
}

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeWorkspaceId: 'w1',
      projects: mockProjects,
      tasks: mockTasks,
      members: mockMembers,
      activities: mockActivities,
      notifications: mockNotifications,

      switchWorkspace: (workspaceId) => set({ activeWorkspaceId: workspaceId }),

      addProject: (projectData) => set((state) => {
        const newProject: Project = {
          ...projectData,
          id: `p${Date.now()}`,
          tasksTotal: 0,
          tasksDone: 0,
          progress: 0,
          updatedAt: 'Just now'
        };
        return { projects: [...state.projects, newProject] };
      }),

      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          ...taskData,
          id: `t${Date.now()}`,
          subTasks: [],
          comments: []
        };
        
        // Update project task counts
        const updatedProjects = state.projects.map(p => {
          if (p.id === taskData.projectId) {
            const tasksTotal = p.tasksTotal + 1;
            const progress = tasksTotal === 0 ? 0 : Math.round((p.tasksDone / tasksTotal) * 100);
            return { ...p, tasksTotal, progress, updatedAt: 'Just now' };
          }
          return p;
        });

        const newNotif: AppNotification = {
          id: `n${Date.now()}`,
          title: 'New Task Assigned',
          body: `Task "${taskData.title}" has been created.`,
          time: 'Just now',
          read: false,
          type: 'assign'
        };

        return { 
          tasks: [...state.tasks, newTask], 
          projects: updatedProjects,
          notifications: [newNotif, ...state.notifications] 
        };
      }),

      updateTask: (taskId, updates) => set((state) => {
        const taskIndex = state.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return state;

        const newTasks = [...state.tasks];
        const oldTask = newTasks[taskIndex];
        
        let newProjectName = oldTask.project;
        if (updates.projectId && updates.projectId !== oldTask.projectId) {
           const p = state.projects.find(proj => proj.id === updates.projectId);
           if (p) newProjectName = p.name;
        }

        newTasks[taskIndex] = { ...oldTask, ...updates, project: newProjectName };

        let updatedProjects = state.projects;
        if (updates.projectId && updates.projectId !== oldTask.projectId) {
           updatedProjects = state.projects.map(p => {
             if (p.id === oldTask.projectId) {
                const tasksTotal = Math.max(0, p.tasksTotal - 1);
                const tasksDone = oldTask.status === 'done' ? Math.max(0, p.tasksDone - 1) : p.tasksDone;
                const progress = tasksTotal === 0 ? 0 : Math.round((tasksDone / tasksTotal) * 100);
                return { ...p, tasksTotal, tasksDone, progress, updatedAt: 'Just now' };
             }
             if (p.id === updates.projectId) {
                const tasksTotal = p.tasksTotal + 1;
                const tasksDone = oldTask.status === 'done' ? p.tasksDone + 1 : p.tasksDone;
                const progress = tasksTotal === 0 ? 0 : Math.round((tasksDone / tasksTotal) * 100);
                return { ...p, tasksTotal, tasksDone, progress, updatedAt: 'Just now' };
             }
             return p;
           });
        }
        
        return { tasks: newTasks, projects: updatedProjects };
      }),

      updateTaskStatus: (taskId, status) => set((state) => {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;
        
        const wasDone = task.status === 'done';
        const isDone = status === 'done';
        
        const updatedTasks = state.tasks.map(t => t.id === taskId ? { ...t, status } : t);
        
        let updatedProjects = state.projects;
        if (wasDone !== isDone) {
           updatedProjects = state.projects.map(p => {
             if (p.id === task.projectId) {
                const tasksDone = isDone ? p.tasksDone + 1 : p.tasksDone - 1;
                const progress = p.tasksTotal === 0 ? 0 : Math.round((tasksDone / p.tasksTotal) * 100);
                return { ...p, tasksDone, progress, updatedAt: 'Just now' };
             }
             return p;
           });
        }

        return { tasks: updatedTasks, projects: updatedProjects };
      }),

      toggleTaskStatus: (taskId) => {
        const state = get();
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          const newStatus = task.status === 'done' ? 'todo' : 'done';
          get().updateTaskStatus(taskId, newStatus);
        }
      },

      reorderTask: (activeId, overId, newStatus) => set((state) => {
        const oldIndex = state.tasks.findIndex(t => t.id === activeId);
        const newIndex = state.tasks.findIndex(t => t.id === overId);
        
        if (oldIndex === -1) return state;

        let newTasks = [...state.tasks];
        let updatedProjects = state.projects;
        
        // Handle status change
        if (newStatus && newTasks[oldIndex].status !== newStatus) {
           const wasDone = newTasks[oldIndex].status === 'done';
           const isDone = newStatus === 'done';
           
           newTasks[oldIndex] = { ...newTasks[oldIndex], status: newStatus };
           
           if (wasDone !== isDone) {
             updatedProjects = state.projects.map(p => {
               if (p.id === newTasks[oldIndex].projectId) {
                  const tasksDone = isDone ? p.tasksDone + 1 : p.tasksDone - 1;
                  const progress = p.tasksTotal === 0 ? 0 : Math.round((tasksDone / p.tasksTotal) * 100);
                  return { ...p, tasksDone, progress, updatedAt: 'Just now' };
               }
               return p;
             });
           }
        }

        // Handle reorder
        if (newIndex !== -1 && oldIndex !== newIndex) {
          newTasks = arrayMove(newTasks, oldIndex, newIndex);
        }
        
        return { tasks: newTasks, projects: updatedProjects };
      }),

      deleteTask: (taskId) => set((state) => {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;

        const updatedTasks = state.tasks.filter(t => t.id !== taskId);
        const updatedProjects = state.projects.map(p => {
          if (p.id === task.projectId) {
            const tasksTotal = Math.max(0, p.tasksTotal - 1);
            const tasksDone = task.status === 'done' ? Math.max(0, p.tasksDone - 1) : p.tasksDone;
            const progress = tasksTotal === 0 ? 0 : Math.round((tasksDone / tasksTotal) * 100);
            return { ...p, tasksTotal, tasksDone, progress, updatedAt: 'Just now' };
          }
          return p;
        });

        return { tasks: updatedTasks, projects: updatedProjects };
      }),

      addMember: (memberData) => set((state) => {
        const newMember: Member = {
          ...memberData,
          id: `m${Date.now()}`,
          activeTasks: 0
        };
        return { members: [...state.members, newMember] };
      }),

      removeMember: (memberId) => set((state) => {
        return { members: state.members.filter(m => m.id !== memberId) };
      }),

      addActivity: (activityData) => set((state) => {
        const newActivity: Activity = {
          ...activityData,
          id: `a${Date.now()}`,
          time: 'Just now'
        };
        return { activities: [newActivity, ...state.activities] };
      }),

      addNotification: (data) => set((state) => {
        const newNotif: AppNotification = {
          ...data,
          id: `n${Date.now()}`,
          time: 'Just now',
          read: false
        };
        return { notifications: [newNotif, ...state.notifications] };
      }),

      toggleSubTask: (taskId, subTaskId) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            const updatedSubTasks = t.subTasks.map(st => 
              st.id === subTaskId ? { ...st, done: !st.done } : st
            );
            return { ...t, subTasks: updatedSubTasks };
          }
          return t;
        });
        return { tasks: updatedTasks };
      }),

      addSubTask: (taskId, title) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            return { 
              ...t, 
              subTasks: [...t.subTasks, { id: `st${Date.now()}`, title, done: false }] 
            };
          }
          return t;
        });
        return { tasks: updatedTasks };
      }),

      addTaskComment: (taskId, memberName, avatar, body) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            const newComment = {
              id: `c${Date.now()}`,
              taskId,
              memberName,
              avatar,
              body,
              time: 'Just now'
            };
            return { ...t, comments: [...t.comments, newComment] };
          }
          return t;
        });
        return { tasks: updatedTasks };
      }),

      markNotificationRead: (notificationId) => set((state) => {
        const updated = state.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        );
        return { notifications: updated };
      }),

      clearWorkspace: () => set({
        projects: [],
        tasks: [],
        members: [],
        activities: [],
        notifications: [],
      })
    }),
    {
      name: 'masar-workspace-storage',
    }
  )
);
