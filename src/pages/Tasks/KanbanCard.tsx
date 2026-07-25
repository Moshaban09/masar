import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { Badge } from '../../components/ui/badge';
import { Clock, Edit2 } from 'lucide-react';
import { useWorkspace } from '../../store/useWorkspace';

interface Props {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function KanbanCard({ task, onEdit }: Props) {
  const { members } = useWorkspace();
  const assignee = members.find(m => m.id === task.assignee);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:border-[var(--primary)] hover:shadow-md cursor-grab active:cursor-grabbing group mb-3 flex flex-col gap-2 transition-colors relative z-10"
    >
      <div className="flex justify-between items-start gap-2 relative">
        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug pr-6">{task.title}</h4>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onEdit?.(task); 
          }} 
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 rounded opacity-0 group-hover:opacity-100 transition-all absolute right-0 top-0 z-20 cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-xs text-slate-500 line-clamp-1">{task.project}</p>
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
        <Badge variant="outline" className={`text-[9px] uppercase px-1.5 py-0 rounded ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </Badge>
        <div className="flex items-center gap-2">
          {assignee && (
            <img 
              src={assignee.avatar} 
              alt={assignee.name} 
              className="w-5 h-5 rounded-full object-cover border border-slate-200" 
              title={`Assigned to ${assignee.name}`}
            />
          )}
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
            <Clock className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}
