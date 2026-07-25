import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import type { Project, Task, Member, Activity, TaskStatus, AppNotification } from '../types';

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
  deleteProject: (projectId: string) => void;
  addMember: (member: Omit<Member, 'id' | 'activeTasks'>) => void;
  removeMember: (memberId: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  addSubTask: (taskId: string, title: string) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  updateSubTask: (taskId: string, subTaskId: string, title: string) => void;
  addTaskComment: (taskId: string, memberName: string, avatar: string, body: string) => void;
  deleteTaskComment: (taskId: string, commentId: string) => void;
  updateTaskComment: (taskId: string, commentId: string, body: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  clearWorkspace: () => void;
}

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeWorkspaceId: 'w1',
      projects: [],
      tasks: [],
      members: [],
      activities: [],
      notifications: [],

      switchWorkspace: (workspaceId) => set({ activeWorkspaceId: workspaceId }),

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
            return { ...p, tasksTotal, progress, updatedAt: new Date().toISOString() };
          }
          return p;
        });

        const newNotif: AppNotification = {
          id: `n${Date.now()}`,
          title: 'New Task Created',
          body: `Task "${taskData.title}" has been created in ${taskData.project}.`,
          time: new Date().toISOString(),
          read: false,
          type: 'assign'
        };

        const newActivity: Activity = {
          id: `a${Date.now()}`,
          workspaceId: state.activeWorkspaceId,
          member: 'You',
          action: 'created task',
          target: taskData.title,
          time: new Date().toISOString(),
          type: 'create'
        };

        return { 
          tasks: [...state.tasks, newTask], 
          projects: updatedProjects,
          activities: [newActivity, ...state.activities],
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
                return { ...p, tasksTotal, tasksDone, progress, updatedAt: new Date().toISOString() };
             }
             if (p.id === updates.projectId) {
                const tasksTotal = p.tasksTotal + 1;
                const tasksDone = oldTask.status === 'done' ? p.tasksDone + 1 : p.tasksDone;
                const progress = tasksTotal === 0 ? 0 : Math.round((tasksDone / tasksTotal) * 100);
                return { ...p, tasksTotal, tasksDone, progress, updatedAt: new Date().toISOString() };
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
                return { ...p, tasksDone, progress, updatedAt: new Date().toISOString() };
             }
             return p;
           });
        }

        let newActivities = state.activities;
        let newNotifications = state.notifications;

        if (wasDone !== isDone) {
          const actionText = isDone ? 'completed task' : 'reopened task';
          const newActivity: Activity = {
            id: `a${Date.now()}`,
            workspaceId: state.activeWorkspaceId,
            member: 'You',
            action: actionText,
            target: task.title,
            time: new Date().toISOString(),
            type: isDone ? 'complete' : 'update'
          };
          newActivities = [newActivity, ...state.activities];

          if (isDone) {
            const newNotif: AppNotification = {
              id: `n${Date.now()}`,
              title: 'Task Completed 🎉',
              body: `Task "${task.title}" has been completed!`,
              time: new Date().toISOString(),
              read: false,
              type: 'system'
            };
            newNotifications = [newNotif, ...state.notifications];
          }
        }

        return { 
          tasks: updatedTasks, 
          projects: updatedProjects,
          activities: newActivities,
          notifications: newNotifications
        };
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
                  return { ...p, tasksDone, progress, updatedAt: new Date().toISOString() };
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
            return { ...p, tasksTotal, tasksDone, progress, updatedAt: new Date().toISOString() };
          }
          return p;
        });

        const newActivity: Activity = {
          id: `a${Date.now()}`,
          workspaceId: state.activeWorkspaceId,
          member: 'You',
          action: 'deleted task',
          target: task.title,
          time: new Date().toISOString(),
          type: 'update'
        };

        const newNotif: AppNotification = {
          id: `n${Date.now()}`,
          title: 'Task Deleted',
          body: `Task "${task.title}" has been removed.`,
          time: new Date().toISOString(),
          read: false,
          type: 'system'
        };

        return { 
          tasks: updatedTasks, 
          projects: updatedProjects,
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
      }),

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
      }),

      addActivity: (activityData) => set((state) => {
        const newActivity: Activity = {
          ...activityData,
          id: `a${Date.now()}`,
          time: new Date().toISOString()
        };
        return { activities: [newActivity, ...state.activities] };
      }),

      addNotification: (data) => set((state) => {
        const newNotif: AppNotification = {
          ...data,
          id: `n${Date.now()}`,
          time: new Date().toISOString(),
          read: false
        };
        return { notifications: [newNotif, ...state.notifications] };
      }),

      toggleSubTask: (taskId, subTaskId) => set((state) => {
        let actionMsg = 'updated subtask';
        let taskTitle = 'a task';

        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            taskTitle = t.title;
            const updatedSubTasks = t.subTasks.map(st => {
              if (st.id === subTaskId) {
                actionMsg = !st.done ? 'completed a subtask in' : 'uncompleted a subtask in';
                return { ...st, done: !st.done };
              }
              return st;
            });
            return { ...t, subTasks: updatedSubTasks };
          }
          return t;
        });

        const newActivity: Activity = {
          id: `a${Date.now()}`,
          workspaceId: state.activeWorkspaceId,
          member: 'You',
          action: actionMsg,
          target: taskTitle,
          time: new Date().toISOString(),
          type: 'update'
        };

        return { 
          tasks: updatedTasks,
          activities: [newActivity, ...state.activities]
        };
      }),

      addSubTask: (taskId, title) => set((state) => {
        let taskTitle = 'a task';
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            taskTitle = t.title;
            return { 
              ...t, 
              subTasks: [...t.subTasks, { id: `st${Date.now()}`, title, done: false }] 
            };
          }
          return t;
        });

        const newNotif: AppNotification = {
          id: `n${Date.now()}`,
          title: 'Subtask Added',
          body: `New subtask "${title}" added to "${taskTitle}".`,
          time: new Date().toISOString(),
          read: false,
          type: 'update'
        };

        return { tasks: updatedTasks, notifications: [newNotif, ...state.notifications] };
      }),

      deleteSubTask: (taskId, subTaskId) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, subTasks: t.subTasks.filter(st => st.id !== subTaskId) };
          }
          return t;
        });
        return { tasks: updatedTasks };
      }),

      updateSubTask: (taskId, subTaskId, title) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            const updatedSubTasks = t.subTasks.map(st => 
              st.id === subTaskId ? { ...st, title } : st
            );
            return { ...t, subTasks: updatedSubTasks };
          }
          return t;
        });
        return { tasks: updatedTasks };
      }),

      addTaskComment: (taskId, memberName, avatar, body) => set((state) => {
        let taskTitle = 'a task';

        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            taskTitle = t.title;
            const newComment = {
              id: `c${Date.now()}`,
              taskId,
              memberName,
              avatar,
              body,
              time: new Date().toISOString()
            };
            return { ...t, comments: [...t.comments, newComment] };
          }
          return t;
        });

        const newActivity: Activity = {
          id: `a${Date.now()}`,
          workspaceId: state.activeWorkspaceId,
          member: memberName,
          action: 'commented on',
          target: taskTitle,
          time: new Date().toISOString(),
          type: 'comment'
        };

        const newNotif: AppNotification = {
          id: `n${Date.now()}`,
          title: 'New Comment',
          body: `${memberName} commented on "${taskTitle}": ${body.substring(0, 20)}...`,
          time: new Date().toISOString(),
          read: false,
          type: 'comment'
        };

        return { 
          tasks: updatedTasks,
          activities: [newActivity, ...state.activities],
          notifications: [newNotif, ...state.notifications]
        };
      }),

      deleteTaskComment: (taskId, commentId) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, comments: t.comments.filter(c => c.id !== commentId) };
          }
          return t;
        });
        return { tasks: updatedTasks };
      }),

      updateTaskComment: (taskId, commentId, body) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            const updatedComments = t.comments.map(c => 
              c.id === commentId ? { ...c, body } : c
            );
            return { ...t, comments: updatedComments };
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

      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),

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
