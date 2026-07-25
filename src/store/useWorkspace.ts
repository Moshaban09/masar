import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Task, Member, Activity, TaskStatus } from '../types';
import { mockProjects, mockTasks, mockMembers, mockActivities } from '../data/mockData';

interface WorkspaceState {
  activeWorkspaceId: string;
  projects: Project[];
  tasks: Task[];
  members: Member[];
  activities: Activity[];
  
  // Actions
  switchWorkspace: (workspaceId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'tasksTotal' | 'tasksDone' | 'progress' | 'updatedAt'>) => void;
  addTask: (task: Omit<Task, 'id' | 'subTasks' | 'comments'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleTaskStatus: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  addMember: (member: Omit<Member, 'id' | 'activeTasks'>) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  addSubTask: (taskId: string, title: string) => void;
  addTaskComment: (taskId: string, memberName: string, avatar: string, body: string) => void;
}

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeWorkspaceId: 'w1',
      projects: mockProjects,
      tasks: mockTasks,
      members: mockMembers,
      activities: mockActivities,

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

        return { tasks: [...state.tasks, newTask], projects: updatedProjects };
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

      addActivity: (activityData) => set((state) => {
        const newActivity: Activity = {
          ...activityData,
          id: `a${Date.now()}`,
          time: 'Just now'
        };
        return { activities: [newActivity, ...state.activities] };
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
      })
    }),
    {
      name: 'masar-workspace-storage',
    }
  )
);
