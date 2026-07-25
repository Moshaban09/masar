import type { Task, Member } from '../../types';
import { Badge } from '../../components/ui/badge';

interface Props {
  projectTasks: Task[];
  members: Member[];
  toggleTaskStatus: (id: string) => void;
  setTaskToView: (task: Task) => void;
}

export function ProjectTasksTab({ projectTasks, members, toggleTaskStatus, setTaskToView }: Props) {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent': return { badge: 'bg-red-50 text-red-700 border-red-200', border: 'border-l-red-500' };
      case 'high': return { badge: 'bg-orange-50 text-orange-700 border-orange-200', border: 'border-l-orange-500' };
      case 'medium': return { badge: 'bg-blue-50 text-blue-700 border-blue-200', border: 'border-l-blue-500' };
      default: return { badge: 'bg-slate-50 text-slate-700 border-slate-200', border: 'border-l-slate-300' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {projectTasks.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {projectTasks.map((task) => {
            const styles = getPriorityStyles(task.priority);
            return (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group border-l-4 ${styles.border}`}
                onClick={() => setTaskToView(task)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <input 
                    type="checkbox" 
                    checked={task.status === 'done'} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { e.stopPropagation(); toggleTaskStatus(task.id); }} 
                    className="w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer" 
                  />
                  <span className={`text-sm font-medium ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Badge variant="outline" className={`capitalize text-[10px] ${styles.badge}`}>
                    {task.priority}
                  </Badge>
                  {members.find(m => m.id === task.assignee) && (
                    <img 
                      src={members.find(m => m.id === task.assignee)?.avatar} 
                      alt="Assignee" 
                      className="w-6 h-6 rounded-full object-cover border border-slate-200" 
                      title={`Assigned to ${members.find(m => m.id === task.assignee)?.name}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500">
          No tasks found for this project. Add some to track progress.
        </div>
      )}
    </div>
  );
}
