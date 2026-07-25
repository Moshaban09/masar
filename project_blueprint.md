# Masar Project Management System - Blueprint & Design Specifications

Masar is a premium, developer-first project management system designed with a high-end, clean, and minimalist aesthetic inspired by tools like **Linear** and **Raycast**. It is optimized for clarity, speed, and focus, featuring a beautiful light mode based on a **Slate + Emerald** palette. 

> [!IMPORTANT]
> The codebase is built strictly using **TypeScript (TS / TSX)** to ensure full static type-safety, clean data interfaces, and compile-time verification across all pages and component states. JavaScript (.js/.jsx) is not used.

---

## 1. Product Vision & Design System (Slate + Emerald)

The theme uses a clean, light-mode background with high contrast slate text, emerald accents for primary interactions, and standard colors for status states.

### 🎨 Color Palette

| Token / Role | Hex Value | Tailwind Equivalent | Description |
| :--- | :--- | :--- | :--- |
| **Primary (Accent)** | *Dynamic* (Emerald: `#059669` / Indigo: `#4F46E5` / Violet: `#7C3AED` / Amber: `#D97706`) | `var(--primary)` | Accent buttons, active states, main branding |
| **Background** | `#F8FAFC` | `slate-50` | Main application background |
| **Surface/Card** | `#FFFFFF` | `white` | Cards, panels, modal boxes, dropdowns |
| **Border** | `#E2E8F0` | `slate-200` | Dividers, borders, input boundaries |
| **Text** | `#0F172A` | `slate-900` | Headings, titles, main reading text |
| **Muted Text** | `#64748B` | `slate-500` | Subtitles, labels, timestamps |
| **Success** | `#16A34A` | `green-600` | Completed status, positive indicators |
| **Warning** | `#D97706` | `amber-600` | In-review status, delays, alerts |
| **Danger** | `#DC2626` | `red-600` | Overdue tasks, blockages, errors |

### ✍️ Typography & Hierarchy
* **UI Font**: `Inter` or `Geist` for modern, clean reading.
* **Arabic Fallback Font**: `Cairo` or `IBM Plex Sans Arabic` for smooth, geometric Arabic presentation.
* **Scale**:
  * Heading 1 (Page Title): `24px` / `text-2xl` · SemiBold
  * Heading 2 (Section Title): `18px` / `text-lg` · SemiBold
  * Body Text: `14px` / `text-sm` · Regular
  * Muted/Labels: `12px` / `text-xs` · Regular or Medium

---

## 2. Core Data Models

Below are the TypeScript interfaces that govern the state of the application.

```typescript
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
  workspaceId: string; // partitions data by workspace
  name: string;
  description: string;
  status: Status;
  progress: number; // percentage (0 - 100)
  dueDate: string;  // YYYY-MM-DD
  members: string[]; // Member IDs
  tasksTotal: number;
  tasksDone: number;
  updatedAt: string;
  color: string; // custom project theme color
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
  time: string; // relative timestamp e.g. "Just now"
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
  dueDate: string;  // YYYY-MM-DD
  subTasks: SubTask[];
  comments: Comment[];
}

export interface Activity {
  id: string;
  workspaceId: string;
  member: string; // Member name
  action: string; // e.g. "completed", "commented on", "created"
  target: string; // Task or project name
  time: string;   // Relative time e.g., "10m ago"
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
```

---

## 3. Local Database & LocalStorage Persistence (Zustand)

To provide a fully interactive system where buttons actually work (adding tasks, updating projects, editing settings, logging in/out) without a backend, we use **Zustand's persistence middleware (`persist`)**. This stores the state in `localStorage` so edits survive page refreshes and functions as a fast local database.

### 📁 Persistent Workspace Database Store (`store/useWorkspace.ts` & Slices)
Manages all active projects, tasks, members, and activity. Seeded with the default initial data on first load. The store is modularized using the **Zustand Slices Pattern** for clean architecture:
* **Slices**:
  * `createWorkspaceSlice`: Manages active workspace and global activities.
  * `createProjectSlice`: Manages projects.
  * `createTaskSlice`: Manages tasks and subtasks.
  * `createMemberSlice`: Manages team members.
  * `createNotificationSlice`: Manages in-app notifications.
* **State Managed**:
  * `projects`: `Project[]`
  * `tasks`: `Task[]`
  * `members`: `Member[]`
  * `activities`: `Activity[]`
  * `activeWorkspaceId`: `string` (default: `"w1"`)
* **Zustand Store Actions (State Logic)**:
  * `addProject(project)`: Generates a new project under the current `activeWorkspaceId` with counters initialized at 0.
  * `addTask(task)`: Inserts a new task under the active workspace, increments the parent project's total task counter, and updates progress percentages.
  * `toggleTaskStatus(taskId)`: Toggles task status between `todo` and `done`, updating the parent project's completed count and progress percentage accordingly.
  * `updateTaskStatus(taskId, status)`: Explicitly sets status and updates parent project progress metrics.
  * `deleteTask(taskId)`: Removes task and decrements parent project counters.
  * `addMember(member)`: Adds a new teammate to the workspace, making them assignable to tasks and visible on the Team directory.
  * `addActivity(activity)`: Adds a log entry to the activity timeline under the active workspace.
  * `switchWorkspace(workspaceId)`: Updates `activeWorkspaceId` causing the UI to filter lists immediately.
  * `toggleSubTask(taskId, subTaskId)`: Toggles a subtask's completion and recalculates overall task progress.
  * `addSubTask(taskId, title)`: Appends a new subtask to the specified task.
  * `addTaskComment(taskId, memberName, avatar, body)`: Appends a comment to the task's thread and pushes a comment creation action to the activities feed.

### 🔑 Persistent Authentication Store (`store/useAuth.ts`)
Handles local authentication. Valid credentials: `ava@masar.io` (password can be anything). It manages:
* `user`: `{ id: string; email: string; name: string; avatar: string; plan: 'free' | 'pro'; accentColor: AccentColor } | null`
* `isAuthenticated`: `boolean`
* `isInitialized`: `boolean`
* `login(email, password)`: Validates credentials, sets user state, and returns success/failure.
* `logout()`: Clears user session.
* `updateProfile(name, email)`: Mutates personal user details, instantly propagating updates (like topbar avatar/name) across the UI.
* `updatePassword(oldPassword, newPassword)`: Matches old password against session, updating stored credentials and firing toasts.
* `upgradePlan()`: Updates user plan to `"pro"`, unlocking workspace limitations.
* `setAccentColor(color)`: Updates the user's color theme preference and updates the CSS custom properties in the DOM.

---

## 4. Form Validation Rules (Zod Schemas)

Enforces input constraints before updating Zustand store states:

1. **Login & Signup Validation Schemas**:
   * **Login**: Email must be a valid email format; Password must be a minimum of 6 characters.
   * **Signup**: Full Name must be at least 2 characters; Email must be a valid email format; Password must be at least 6 characters; Workspace Name must be at least 3 characters.
2. **New Project Schema**:
   * Title must be at least 3 characters.
   * Description must be at least 10 characters.
   * Due date must be a valid, parsed date.
   * Members array must have at least 1 assigned member.
3. **New Task Schema**:
   * Title must be at least 3 characters.
   * Project ID must be a non-empty string.
   * Assignee and due date must be valid and non-empty.
4. **Invite Team Member Schema**:
   * Full Name must be at least 2 characters.
   * Email must be a valid email address.
   * Role must be at least 3 characters (e.g., "Frontend Engineer").
   * Capacity must be a number between 1 and 20 (default workload limit).
   * Status must be one of `active`, `away`, or `offline`.
5. **Change Password Schema (Logged In)**:
   * Old Password: Required, must not be empty.
   * New Password: Must be a minimum of 6 characters.
   * Confirm Password: Must match the New Password exactly.
6. **Task Comment Schema**:
   * Body must be at least 2 characters.
7. **Add Subtask Schema**:
   * Title must be at least 2 characters.

---

## 5. Route Protection & Authentication Flow

To secure user workspace data and ensure clean auth transitions, the system utilizes a centralized client-side authentication guard:

### 🔒 Guard Wrappers (Client-Side)

* **`ProtectedRoute.tsx`**: A wrapper component that checks the authentication state. If the user is unauthenticated, it redirects to the Login page (`Login.tsx`). If authenticated, it renders the child layout via `<Outlet />`.
* **`PublicRoute.tsx`**: A wrapper component for public-only pages (like Login). If the user is already authenticated, it automatically redirects them to `/dashboard`.

---

## 6. Page Specifications

### 🔑 Page 1: Auth Pages (`Login.tsx` @ `/`, `Signup.tsx` @ `/signup`, & `ForgotPassword.tsx` @ `/forgot-password`)

Uses a shared structural authentication layout (`AuthLayout.tsx` which handles the split-screen layout) with a clean, responsive layout:

* **Left Panel (Auth Forms)**:
  * **Login Screen (`Login.tsx` @ `/`)**:
    * Minimalist brand logo with name `Masar`.
    * Heading: "Welcome back" with helper subtitle.
    * **OAuth Social Buttons**: Google and GitHub buttons.
      * *UX Behavior*: Styled as semi-transparent/disabled (`opacity-60 cursor-not-allowed`). Hovering or clicking these buttons triggers a warning Sonner toast: `"Google/GitHub login will be enabled in a future release."`
    * **Form Inputs (Required)**:
      * Email (placeholder: `you@company.com`, pre-filled with: `ava@masar.io` for convenience).
      * Password (placeholder: `••••••••`, pre-filled with: `password`).
    * **Auxiliary Elements**: "Forgot?" password reset link (redirects to `/forgot-password`).
    * **Submit Button**: Sign in button (`bg-[var(--primary)] hover:bg-[var(--primary-dark)]`). Submission delays 900ms, registers session, and routes to `/dashboard`.
    * **Link at bottom**: "Don't have an account? Start free trial" (redirects to `/signup`).
  * **Signup Screen (`Signup.tsx` @ `/signup`)**:
    * Minimalist brand logo with name `Masar`.
    * Heading: "Create your account" with helper subtitle.
    * **Form Inputs (Required)**:
      * Full Name (placeholder: `Your name`).
      * Email (placeholder: `you@company.com`).
      * Password (placeholder: `Min 6 characters`).
      * Workspace Name (placeholder: `e.g. Acme Corp`).
    * **Submit Button**: Sign up button (`bg-[var(--primary)] hover:bg-[var(--primary-dark)]`). Signs up, creates user workspace, and routes to `/dashboard`.
    * **Link at bottom**: "Already have an account? Sign in" (redirects to `/`).
  * **Forgot Password Screen (`ForgotPassword.tsx` @ `/forgot-password`)**:
    * Minimalist brand logo with name `Masar`.
    * Heading: "Reset your password" with helper subtitle: "Enter your email and we'll send you a recovery link."
    * **Form Inputs (Required)**:
      * Email address (placeholder: `you@company.com`).
    * **Submit Button**: Send Recovery Link button (`bg-[var(--primary)] hover:bg-[var(--primary-dark)]`).
      * *UX Behavior*: Submission triggers a success Sonner toast: `"Reset link sent to your email! Please check your inbox."` and redirects the user back to the login page after 2 seconds.
    * **Link at bottom**: "Back to sign in" (redirects to `/`).
* **Right Panel (Product Showcase - Desktop Only)**:
  * Background `bg-[#F8FAFC]` with slate borders.
  * Shows team avatar stacks, a stylized quote ("Masar keeps our team aligned..."), and small statistics grids (e.g. active projects, tasks shipped).

---

### 📊 Page 2: Dashboard Layout (`Dashboard.tsx` @ `/dashboard`)
The central hub displaying metrics, charts, and workloads. Values are filtered dynamically by the active workspace. The layout is cleanly split into sub-components for better maintainability:
* **KPI Metrics Row (`DashboardMetrics.tsx`)**: 4 cards displaying:
  1. *Active Projects*: e.g., "6" (`+2 vs last month`).
  2. *Tasks Completed*: e.g., "148" (`+18% this week`).
  3. *Team Velocity*: e.g., "32" (`+4 pts/sprint`).
  4. *Overdue Tasks*: e.g., "3" (`-2 vs last week`).
* **Charts Grid (`DashboardCharts.tsx`)**:
  * *Project Progress Chart*: Recharts Area Chart displaying Completed vs Planned tasks over time. Linear gradient fill using `var(--primary)` for completed and slate tones for planned.
  * *Task Status Donut Chart*: Pie chart demonstrating task distribution across status states (To Do, In Progress, In Review, Done).
* **Information Feed Grid (`DashboardFeed.tsx`)**:
  * *Recent Projects List*: Grid of cards containing project name, progress bar, and member avatars.
  * *Upcoming Deadlines*: Due tasks sorted by urgency with countdown badges (e.g. "Tomorrow", "In 2 days").
  * *Recent Tasks List*: Log of recently modified tasks.
  * *Activity Timeline*: Linear vertical list of recent teammate actions (e.g. "Elena Frost updated Optimize image pipeline").
  * *Team Workload Capacity*: Linear progress bars showing number of active tasks compared to overall capacity for each engineer.

---

### 📁 Page 3: Projects Page (`ProjectsList.tsx` @ `/projects`)
The project portfolio list:
* **Header**: Page title with action button "New Project" (`bg-[var(--primary)]`).
* **Control Bar**: Search input (`Search` icon, slate border) and status tabs filtering projects by status (`All`, `Active`, `Completed`, `On Hold`, `Planning`).
* **Projects Table / Grid**:
  * Columns: Project Info (Name & Description), Status (styled badges), Progress (percentage text + miniature progress bar), Due Date, Team Members (avatar stack), and Last Updated.

---

### 🔍 Page 4: Project Details (`ProjectDetails.tsx` @ `/projects/:id`)
Detailed view for a single project, utilizing a clean Tabbed interface:
* **Header**: Project name, custom category color indicator, and back to projects link.
* **Layout**:
  * *Overview Tab (`ProjectOverviewTab.tsx`)*: Project description, timeline progress, team directory list, and target completion date.
  * *Tasks Tab (`ProjectTasksTab.tsx`)*: Tasks associated with the current project, grouped by status.

---

### 📋 Page 5: Tasks Page (`Tasks.tsx` @ `/tasks`)
A high-density list optimized for daily workflows, explicitly split into two dedicated views:
* **Search & Filters**: Search field, and tab filters matching task status (`To Do`, `In Progress`, `Review`, `Done`). Toggle to switch between List View and Kanban Board View.
* **Tasks Views**:
  * *List View (`TasksList.tsx`)*: Title, Project Name, Due Date, Assignee, Priority badge, and Status badge. Sorted by priority and filterable by assignee.
  * *Kanban View (`TasksKanban.tsx`)*: Columns for Todo, In-progress, Review, and Done. Move cards by Drag & Drop to update task statuses instantly.

---

### 👥 Page 6: Team Page (`Team.tsx` @ `/team`)
Directory highlighting member availability, capacity, and inviting:
* **Header**: Page title with action button "Invite Member" (`bg-[var(--primary)]`). Opens validation modal.
* **Team Cards Grid**:
  * Cards showing Member Avatar, status badge (green dot for `active`, amber for `away`, grey for `offline`).
  * Name, Role description, and direct mail link.
  * Workload Indicator: A bar comparing current task load against max capacity (e.g., `7/10 tasks`).

---

### 📅 Page 7: Calendar Page (`Calendar.tsx` @ `/calendar`)
A modular planner view with dual grid options:
* **Interface**: Users can toggle between a full **Month Grid (`MonthGrid.tsx`)** and a more granular **Week Grid (`WeekGrid.tsx`)**.
* **Tapping Interactions**: Clicking any empty date cell directly opens the Add Task modal, pre-filling its due date field with the selected day's date.
* **Deadlines**: Renders small badges for tasks on their respective due dates (labeled with task title and styled by priority colors).

---

### 🔔 Page 8: Notifications Feed (`Notifications.tsx` @ `/notifications`)
Unified alert center:
* **Layout**:
  * List items separated by light dividers.
  * Each alert details: Type icon (AtSign for mentions, Clock for deadlines, User for assignments), title, message body, time elapsed, and an unread indicator dot (`bg-[var(--primary)]`).

---

### ⚙️ Page 9: Settings Page (`Settings.tsx` @ `/settings`)
Account and configuration tabs:
* **Tabs**: Profile, Security (Password), Billing.
* **Form Inputs**:
  * *Profile*: Username, Email, Role selection, and **Theme Accent Switcher** (custom buttons to switch application theme between Emerald, Indigo, Violet, Amber).
  * *Security*: Old Password (validation required), New Password, Confirm Password.
  * *Billing*: Upgrade button and resource tracking.
* **Billing Card**: Clean surface panel showing current plan (Free vs Pro), current resources consumed (e.g., "6 of 10 projects used"), and Upgrade button.

---

## 7. Navigation & Transition Flow

Navigation should feel instant, smooth, and predictable.

### 🧭 Sidebar Navigation Behavior
* **Active State styling**: Navigation links (`NavLink`) use exact path matching. Active links should be styled with a distinct background (`bg-slate-100` or `bg-[var(--primary-light)]`) and a text color of `text-slate-900` with a brand-colored icon.
* **Sidebar Expand / Collapse**: On desktop, the sidebar is persistently visible. On mobile, it slides from the left (`-translate-x-full` to `translate-x-0`) using standard CSS transition properties (`transition-transform duration-300 ease-in-out`), controlled via an overlay toggle in the topbar.
* **Layout Structure**:
```
+-------------------------------------------------------------+
|                      TOPBAR (Breadcrumbs / Profile / Bell)  |
+------------+------------------------------------------------+
|            |                                                |
|  SIDEBAR   |   MAIN WORKSPACE (Outlet)                      |
|  (Nav)     |   Page content is rendered here                |
|            |                                                |
|            |                                                |
+------------+------------------------------------------------+
```

### ✨ Micro-Animations & Page Transitions
* **Hover effects**: All interactive elements (buttons, project cards, table rows) must transition smoothly (e.g., `transition-colors duration-200 ease`).
* **Skeletons**: Layout shifts (`CLS`) are prevented by loading dashboard widgets and charts with Tailwind shimmer skeleton panels (`CardSkeleton` / `Skeleton`) while data loads.

---

## 8. Key Components (UI Kit)

1. **Card Component (`Card.tsx`)**: White background (`bg-white`), thin slate border (`border-slate-200`), rounded corners (`rounded-2xl`), subtle drop shadow (`shadow-sm`).
2. **Badge Component (`Badge.tsx`)**: Dynamic sizing and coloring:
   * Status indicators (Emerald bg for Completed, Slate bg for Planning, Amber bg for Review).
   * Priority indicators (Red bg/text for Urgent, Orange for High, Slate for Low).
3. **Button Component (`Button.tsx`)**:
   * *Primary*: `bg-[var(--primary)]` background with white text.
   * *Secondary*: White background, slate border, dark slate text.
   * *Destructive*: Red background, white text.
4. **Sidebar Component (`Sidebar.tsx`)**: Vertical navigation panel with `NavLink` items, logo section, active routes styled with light slate backgrounds, and a minimized plan upgrade prompt at the bottom. Includes the workspace switching dropdown.
5. **Topbar Component (`Topbar.tsx`)**: Layout banner showing site hierarchy breadcrumbs and search input (which triggers CMD+K when clicked). Profile and Notifications are modularized into independent components for cleanliness:
   * *UserDropdown (`UserDropdown.tsx`)*: Handles user avatar display, profile shortcuts, and logout actions.
   * *NotificationsDropdown (`NotificationsDropdown.tsx`)*: Handles the notification bell, dynamic unread indicator badge, and dropdown alerts list.

---

## 9. Interactive Platform Actions

Every button and interaction in the system is fully functional via local state mutation. Changes persist across browser refreshes via `localStorage`.

### 👤 Profile & Settings Mutation (`Settings.tsx` & `store/useAuth.ts`)
* **Personal Info Editing**: Users can edit their profile info (Name, Email, Avatar) on the Settings page (`Settings.tsx`).
* **Zustand Action**: `updateProfile(name, email)` updates the global `user` state. Because all layout components (like `Topbar.tsx` and `Dashboard.tsx`) select their data directly from the `useAuth` store, changing the profile details updates the header name ("Good morning, [Name]") and avatar instantly across the entire application.
* **Password Modification (Security)**: Logged-in users can update their password under the security tab on the settings page.
  * *UX Flow*: The form requires the user to input their **Old Password**, **New Password**, and **Confirm Password**.
  * *State Validation*: The submission logic verifies that the entered Old Password matches their current session password.
  * *Behavior*: If the Old Password is correct, it updates the stored password in Zustand, resets form inputs, and fires a success Sonner toast: `"Password updated successfully!"`. If the Old Password is incorrect, it displays an inline form validation error: `"Incorrect old password"`.
* **Settings & Preferences**: Users can toggle settings (e.g. notifications feed options, default workspace name), mutating the local state.

### ⚡ Interactive UI Button Actions
All buttons trigger specific state mutations:
* **Add Task**: Opens a modal in `Tasks.tsx`, accepts input validated by `TaskSchema`, and updates both the tasks list and the corresponding project's progress indicators (`tasksTotal`, `progress`).
* **Complete Task**: Toggles a checkbox on a task, mutating its status from `todo`/`in-progress` to `done`. This triggers an automatic calculation in `useWorkspace.ts` to adjust the project's completed task count (`tasksDone`) and recalculate the progress bar.
* **Add Project**: Opens a modal in `Projects.tsx`, validates input via `ProjectSchema`, and pushes a new project card onto the portfolio list.
* **Delete Task/Project**: Removes the item from state, prompting an automatic update in the KPI widgets (e.g. active project counters decrement).
* **Invite Team Member**: Opens an "Invite Member" modal on the Team page (`Team.tsx`). Validates input with the Zod schema, adds the teammate to the Zustand store, making them immediately appear in the team directory cards and dynamically populated in all task assignee selection dropdowns.
* **Mark Notifications as Read**: Clicking a notification toggles its `read` boolean. Clicking "Mark all as read" updates all entries, clearing the unread indicator dot in the Topbar.
* **Live Activity Logging**: Whenever any modification occurs (e.g., adding a task, completing a project, inviting a team member), the state actions automatically append a new `Activity` object to the timeline. This instantly updates the Dashboard's Activity Timeline feed, mimicking a live, active production workspace.

### 🌟 Fully Functional Premium Systems
These systems must be **fully active and operational** via state logic, rather than static UI placeholders:

1. **Interactive Command Palette (`CMD + K`)**:
   * *Activation*: Pressing `Cmd + K` or `Ctrl + K` triggers a global event listener, rendering a backdrop-blurred overlay modal.
   * *Active Search*: Typing in the input queries Zustand's projects and tasks list in real-time, displaying grouped search results.
   * *Actions Execution*: Clicking a task/project navigates directly to it. The palette also supports commands (e.g., typing "profile" and hitting Enter routes to `/profile`, or typing "dark" toggles the custom theme settings).
2. **Billing Resource Limits & Upgrade Lock**:
   * *Resource Limit*: The Free plan limits workspace projects to a maximum of 10.
   * *Active Guard*: Inside the project creation modal, if `projects.length >= 10`, the submit handler blocks addition and triggers an error Sonner toast: `"Workspace limit reached! Please upgrade to Pro to create more projects."`
   * *Upgrade Action*: Clicking "Upgrade" in the toast or settings updates the `plan` string in `useAuth` to `"pro"` and triggers a success toast. The project submission is then unlocked.
3. **Workspace Switcher & Partitioning**:
   * *Data Partitioning*: Relational database entities (Projects, Tasks, Activities) must have a `workspaceId` string property.
   * *Active Switching*: Clicking the workspace dropdown in the Sidebar and choosing another workspace (or adding a new one) updates `activeWorkspaceId` in Zustand.
   * *Immediate Updates*: The entire application UI (KPIs, Charts, Tasks table, Projects portfolio, Calendar) dynamically filters lists using `workspaceId === activeWorkspaceId`, showing distinct data sets immediately.
4. **Kanban Board with Drag & Drop**:
   * *View Toggle*: Inside `Tasks.tsx`, users can toggle between "List View" and "Board View" (columns for Todo, In-progress, Review, and Done).
   * *Active Drag & Drop*: Using HTML5 Drag & Drop API handlers (`onDragStart`, `onDragOver`, `onDrop`), dragging a task card to another column updates that task's `status` in the Zustand store. This triggers the automatic parent project progress recalculation instantly.
5. **Interactive Subtasks Checklist**:
   * *Widget*: Inside a task details view/modal, a subtask list renders each checklist item (`SubTask`).
   * *Active Toggle*: Clicking a subtask checkbox fires `toggleSubTask(taskId, subTaskId)`. This updates the subtask state in `localStorage` and automatically updates a task progress bar (e.g. "2 of 4 subtasks completed"). If all subtasks are checked, a Sonner prompt asks if the user wants to mark the main task as "Done".
6. **Calendar Cell Click-to-Add**:
   * *Integration*: Clicking any day square in `Calendar.tsx` intercepts the click handler, opens the standard task creation modal, and sets the default `dueDate` field of the task to the clicked date automatically.
7. **Task Comments & Discussion Thread**:
   * *Discussion Feed*: Inside the task modal, users can view a timeline of `Comment` items and input new text.
   * *Active Submission*: Writing a comment and hitting Send validates input, pushes a new comment block (including user avatar, name, and relative timestamp) to the task comments list in Zustand, and immediately appends a "commented on [Task Title]" activity entry in the timeline.
8. **Dynamic Theme Accent Switcher**:
   * *Customization*: On the Profile Settings page, user can select a theme accent color (Emerald, Indigo, Violet, Amber).
   * *Active DOM styling*: Selecting a color calls `setAccentColor(color)` in Zustand. This store action updates the CSS custom variables (`--primary` and `--primary-dark`) in the `:root` element of the DOM. The entire app's accent colors (buttons, tags, active borders) adapt instantly.

---

## 10. Folder Structure & Clean Architecture (File Splitting)

To prevent code bloat and ensure components do not turn into unreadable monoliths, the project must adhere to strict component splitting and a clean folder layout.

### 📁 Project Folder Directory
Every file must have a single responsibility. We use a **Folder-per-Page** structure to contain page-specific widgets locally rather than scattering them in a global folder:

```
src/
├── App.tsx             # Application router, Shell Layout, and global providers
├── index.css           # Tailwind CSS variable directives
├── main.tsx            # DOM root mounting
├── assets/             # Global CSS, brand icons, and static assets
├── components/         # Global shared UI components
│   ├── ActivityTimeline.tsx
│   ├── CommandPalette.tsx
│   ├── layout/         # Structural wrappers
│   │   ├── AppLayout.tsx
│   │   ├── NotificationsDropdown.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── UserDropdown.tsx
│   ├── routes/         # Router guards
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   └── ui/             # Headless radix primitives (avatar, badge, button, etc.)
├── lib/
│   └── utils.ts        # Tailwind merging and generic helpers
├── pages/              # Encapsulated Page Folders
│   ├── Auth/
│   │   ├── AuthLayout.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── Calendar/
│   │   ├── Calendar.tsx
│   │   ├── MonthGrid.tsx
│   │   └── WeekGrid.tsx
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── DashboardCharts.tsx
│   │   ├── DashboardFeed.tsx
│   │   └── DashboardMetrics.tsx
│   ├── NotFound/
│   │   └── NotFound.tsx
│   ├── Notifications/
│   │   └── Notifications.tsx
│   ├── Projects/
│   │   ├── NewProjectModal.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectDetails.tsx
│   │   ├── ProjectOverviewTab.tsx
│   │   ├── ProjectsList.tsx
│   │   └── ProjectTasksTab.tsx
│   ├── Settings/
│   │   └── Settings.tsx
│   ├── Tasks/
│   │   ├── KanbanCard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── NewTaskModal.tsx
│   │   ├── TaskComments.tsx
│   │   ├── TaskDetailsModal.tsx
│   │   ├── Tasks.tsx
│   │   ├── TasksKanban.tsx
│   │   ├── TasksList.tsx
│   │   └── TaskSubtasks.tsx
│   └── Team/
│       ├── InviteMemberModal.tsx
│       └── Team.tsx
├── store/              # Zustand global states
│   ├── useAuth.ts
│   ├── useWorkspace.ts
│   └── slices/         # Modular Zustand Slices
│       ├── createMemberSlice.ts
│       ├── createNotificationSlice.ts
│       ├── createProjectSlice.ts
│       ├── createTaskSlice.ts
│       ├── createWorkspaceSlice.ts
│       └── types.ts
├── types/              # Type-safe TypeScript interfaces
│   └── index.ts
└── utils/              # Pure utility functions
    └── dateUtils.ts
```

### 📏 File Splitting & Code Quality Standards

* **Folder-per-Page encapsulation (Recommended)**: Create a folder for each page. Any component, utility, or type that is ONLY used by that page must live inside its respective page folder. If it is reused across 2 or more pages, move it to the global `components/`, `utils/`, or `types/` directories. This prevents global folders from becoming bloated.
* **Single Responsibility Principle**: One file, one export, one job. Keep logical operations separated from UI presentation.
* **Component Size Constraints**: No component file should exceed **150 lines of code**. If it gets larger, it must be broken down into local sub-components inside its page folder.
* **State & Action separation**: Avoid placing complex state logic or calculations in component render loops. Write them as state actions inside the Zustand store (`store/useWorkspace.ts`) or wrap them in custom react hooks (`hooks/`).
* **Imports Order**: Organize imports cleanly to improve readability:
  1. React & external npm packages.
  2. Router, stores, and hooks.
  3. Shared UI components and layout.
  4. Local styles, types, and constants.

---

## 11. Modern Tech Stack & Recommended Libraries (Latest & Stable)

This stack ensures high performance, clean structures, typescript safety, and follows current production-ready best practices.

### 🛠️ Core Infrastructure
* **React 19.x**: Uses the latest React features and hooks for high performance.
* **Vite 8.x**: Blazing-fast Single Page Application (SPA) building and dev server tools.
* **TypeScript 6.x**: Explicit types for data fetching, components, and state management.

### 🎨 Styling & Component Libraries
* **Tailwind CSS v4.0**: The newest version of Tailwind CSS. Relies on native CSS variables, simplifies builds, and removes massive configuration files.
* **Radix UI Primitives (Radix UI / shadcn/ui)**: Radix provides headless, WAI-ARIA compliant components (modals, dropdowns, popovers) which are styled locally with Tailwind. Highly recommended to build custom widgets quickly.
* **Lucide React**: Comprehensive and lightweight iconography matching the design system of Linear + Raycast.

### 📦 Logic & State Management
* **Zustand (v5.x)**: Modularized state management using Slices Pattern and LocalStorage persistence. Bypasses Redux boilerplate and renders efficiently.
* **React Router v7**: The latest routing definitions and standard hooks for deep linking and protected routes.
* **React Hook Form (v7.x)** & **Zod (v4.x)**: Form controller combined with schemas to ensure front-end validation is fully type-safe and declarative.
* **@dnd-kit (v10)**: Core drag-and-drop primitives used for the Kanban board view.
* **date-fns (v4.x)**: Modern, lightweight modular utility functions for formatting and counting task due dates.
* **Sonner**: An elegant, accessible, and fast toast notification library that fits cleanly into the viewport corner.
* **Recharts (v3.x)**: Declarative React chart components built on SVG, styled with Tailwind Slate/Emerald tokens for smooth custom tooltips.

---

## 12. Simplified Coding Practices (No Over-engineering)

To keep development fast, highly readable, and easily maintainable, the codebase strictly avoids unnecessary complexities:

* **No Redux or Context Boilerplate**: Use Zustand as the single source of truth for global states. No custom providers, dispatchers, action creators, or reducers.
* **Flat Helper Logic**: Utility functions (like date formatting or task sorting) must be written as simple, pure TypeScript functions in `utils/` rather than complex class abstractions.
* **No Premature Optimization**: Do not wrap every callback or value in `useCallback` or `useMemo`. React 19's compiler automatically handles rendering optimizations. Only add memoization if a profiling tool proves a rendering bottleneck.
* **Inline Tailwind Styles**: Define colors and layouts directly inside components using clean Tailwind utility classes. Do not use `@apply` in CSS files unless absolutely necessary for external package styling overrides.

---

## 13. Scalability & Performance Best Practices

The blueprint is built to seamlessly scale from a local client-side application to a production application backed by a real database:


* **Relational Data Normalization**: Entities refer to each other by ID, not by nesting full objects. For example:
  * A `Task` contains an `assigneeId: string` and `projectId: string`.
  * To render details, the UI resolves these relations at render time (e.g., using a quick lookup function like `memberById(id)`).
  * This structure directly mirrors database relations, making it trivial to replace the Zustand local stores with real API queries (using TanStack Query `fetch` calls) when transitioning to a remote production database.
* **Type-Safe Strict Mode**: All code files must use explicit TypeScript types (zero use of `any` or `unknown`). All props must have defined interfaces, which prevents runtime crashes.
