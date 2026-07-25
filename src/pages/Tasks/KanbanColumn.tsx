import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../types';
import { KanbanCard } from './KanbanCard';

interface Props {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
}

export function KanbanColumn({ id, title, color, tasks, onEdit, onView }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-1 min-w-[250px] max-w-[400px] flex flex-col h-full max-h-full shrink-0">
      <div className={`p-3 rounded-t-xl border border-b-0 border-slate-200 flex items-center justify-between ${color}`}>
        <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
        <span className="bg-white text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
          {tasks.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 bg-slate-50/50 border border-slate-200 rounded-b-xl p-3 overflow-y-auto transition-colors ${isOver ? 'bg-slate-100/80 ring-2 ring-[var(--primary)]/20' : ''}`}
      >
        <SortableContext id={id} items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
          <div className="min-h-[200px] h-full pb-10">
            {tasks.map(task => (
              <KanbanCard key={task.id} task={task} onEdit={onEdit} onView={onView} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
