import type { Member, Project, Task, Activity, AppNotification } from '../types';

export const mockMembers: Member[] = [
  {
    id: 'm1',
    name: 'Ava Sinclair',
    role: 'Product Lead',
    email: 'ava@masar.io',
    avatar: 'https://i.pravatar.cc/150?u=ava',
    status: 'active',
    activeTasks: 4,
    capacity: 10,
  },
  {
    id: 'm2',
    name: 'Elena Frost',
    role: 'Frontend Engineer',
    email: 'elena@masar.io',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    status: 'away',
    activeTasks: 6,
    capacity: 8,
  },
  {
    id: 'm3',
    name: 'Marcus Reed',
    role: 'Backend Engineer',
    email: 'marcus@masar.io',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    status: 'active',
    activeTasks: 2,
    capacity: 10,
  }
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    workspaceId: 'w1',
    name: 'Website Redesign',
    description: 'Overhaul the marketing site with the new brand guidelines.',
    status: 'in-progress',
    progress: 45,
    dueDate: '2026-08-15',
    members: ['m1', 'm2'],
    tasksTotal: 20,
    tasksDone: 9,
    updatedAt: '2 hours ago',
    color: 'emerald',
  },
  {
    id: 'p2',
    workspaceId: 'w1',
    name: 'Mobile App Beta',
    description: 'Prepare the React Native build for TestFlight distribution.',
    status: 'planning',
    progress: 10,
    dueDate: '2026-09-01',
    members: ['m1', 'm3'],
    tasksTotal: 10,
    tasksDone: 1,
    updatedAt: '1 day ago',
    color: 'indigo',
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    workspaceId: 'w1',
    title: 'Design system tokens',
    project: 'Website Redesign',
    status: 'done',
    priority: 'high',
    assignee: 'm1',
    dueDate: '2026-07-20',
    subTasks: [
      { id: 'st1', title: 'Color palette', done: true },
      { id: 'st2', title: 'Typography', done: true }
    ],
    comments: [
      { id: 'c1', taskId: 't1', memberName: 'Ava Sinclair', avatar: 'https://i.pravatar.cc/150?u=ava', body: 'Tokens are merged.', time: '3 days ago' }
    ]
  },
  {
    id: 't2',
    projectId: 'p1',
    workspaceId: 'w1',
    title: 'Build Hero Section',
    project: 'Website Redesign',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'm2',
    dueDate: '2026-07-26',
    subTasks: [
      { id: 'st3', title: 'Markup', done: true },
      { id: 'st4', title: 'Animations', done: false }
    ],
    comments: []
  },
  {
    id: 't3',
    projectId: 'p2',
    workspaceId: 'w1',
    title: 'Setup API Gateway',
    project: 'Mobile App Beta',
    status: 'todo',
    priority: 'urgent',
    assignee: 'm3',
    dueDate: '2026-07-28',
    subTasks: [],
    comments: []
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    workspaceId: 'w1',
    member: 'Elena Frost',
    action: 'started working on',
    target: 'Build Hero Section',
    time: '2 hours ago',
    type: 'update'
  },
  {
    id: 'a2',
    workspaceId: 'w1',
    member: 'Ava Sinclair',
    action: 'completed',
    target: 'Design system tokens',
    time: '3 days ago',
    type: 'complete'
  }
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Task Assigned',
    body: 'You were assigned to "Setup API Gateway".',
    time: '1 hour ago',
    read: false,
    type: 'assign'
  }
];
