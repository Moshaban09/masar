import type { StateCreator } from 'zustand';
import type { Project, Task, Member, Activity, AppNotification, TaskStatus } from '../../types';

export interface WorkspaceSlice {
  activeWorkspaceId: string;
  activities: Activity[];
  switchWorkspace: (workspaceId: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
  clearWorkspace: () => void;
}

export interface ProjectSlice {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'tasksTotal' | 'tasksDone' | 'progress' | 'updatedAt'>) => void;
  deleteProject: (projectId: string) => void;
}

export interface TaskSlice {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'subTasks' | 'comments'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleTaskStatus: (taskId: string) => void;
  reorderTask: (activeId: string, overId: string, newStatus?: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  addSubTask: (taskId: string, title: string) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  updateSubTask: (taskId: string, subTaskId: string, title: string) => void;
  addTaskComment: (taskId: string, memberName: string, avatar: string, body: string) => void;
  deleteTaskComment: (taskId: string, commentId: string) => void;
  updateTaskComment: (taskId: string, commentId: string, body: string) => void;
}

export interface MemberSlice {
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'activeTasks'>) => void;
  removeMember: (memberId: string) => void;
}

export interface NotificationSlice {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
}

export type StoreState = WorkspaceSlice & ProjectSlice & TaskSlice & MemberSlice & NotificationSlice;

export type StoreSlice<T> = StateCreator<
  StoreState,
  [],
  [],
  T
>;
