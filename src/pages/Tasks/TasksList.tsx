import type { Task } from '../../types';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { useWorkspace } from '../../store/useWorkspace';
import { CheckSquare, MessageSquare } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

interface Props {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
}

export function TasksList({ tasks, onView }: Props) {
  const { toggleTaskStatus, members } = useWorkspace();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('-', ' ');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full">
      <div className="overflow-x-auto h-full">
        <table className="w-full text-sm text-left min-w-[700px]">
          <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase sticky top-0">
            <tr>
              <th className="px-6 py-4 font-medium w-12"></th>
              <th className="px-6 py-4 font-medium">Task</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Priority</th>
              <th className="px-6 py-4 font-medium">Assignee</th>
              <th className="px-6 py-4 font-medium">Project ID</th>
              <th className="px-6 py-4 font-medium text-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tasks.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onView?.(t)}>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={t.status === 'done'} 
                    onCheckedChange={() => toggleTaskStatus(t.id)} 
                  />
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  <div className="flex flex-col gap-1.5">
                    <div className={`line-clamp-1 ${t.status === 'done' ? 'text-slate-400 line-through' : ''}`}>
                      {t.title}
                    </div>
                    {(t.subTasks?.length > 0 || t.comments?.length > 0) && (
                      <div className="flex items-center gap-3">
                        {t.subTasks && t.subTasks.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium" title="Subtasks">
                            <CheckSquare className="w-3 h-3" />
                            {t.subTasks.filter(st => st.done).length}/{t.subTasks.length}
                          </div>
                        )}
                        {t.comments && t.comments.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium" title="Comments">
                            <MessageSquare className="w-3 h-3" />
                            {t.comments.length}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 capitalize text-slate-600">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200">
                    {getStatusLabel(t.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 rounded ${getPriorityColor(t.priority)}`}>
                    {t.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {members.find(m => m.id === t.assignee) ? (
                    <img 
                      src={members.find(m => m.id === t.assignee)?.avatar} 
                      alt="Assignee" 
                      className="w-6 h-6 rounded-full object-cover border border-slate-200" 
                      title={`Assigned to ${members.find(m => m.id === t.assignee)?.name}`}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                  {t.projectId}
                </td>
                <td className="px-6 py-4 text-right text-slate-500 text-xs">
                  {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={CheckSquare}
                    title="No tasks yet"
                    description="You haven't created any tasks matching this criteria."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
