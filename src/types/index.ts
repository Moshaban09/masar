export type Status = 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type UserStatus = 'active' | 'away' | 'offline';
export type AccentColor = 'emerald' | 'indigo' | 'violet' | 'amber';

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: UserStatus;
  activeTasks: number;
  capacity: number;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: Status;
  progress: number;
  dueDate: string;
  members: string[]; // Member IDs
  tasksTotal: number;
  tasksDone: number;
  updatedAt: string;
  color: string;
}

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  memberName: string;
  avatar: string;
  body: string;
  time: string;
}

export interface Task {
  id: string;
  projectId: string;
  workspaceId: string;
  title: string;
  project: string; // parent project name cache
  status: TaskStatus;
  priority: Priority;
  assignee: string; // Member ID
  dueDate: string;
  subTasks: SubTask[];
  comments: Comment[];
}

export interface Activity {
  id: string;
  workspaceId: string;
  member: string; // Member name
  action: string;
  target: string;
  time: string;
  type: 'comment' | 'complete' | 'create' | 'update' | 'assign';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'mention' | 'deadline' | 'assign' | 'system';
}
