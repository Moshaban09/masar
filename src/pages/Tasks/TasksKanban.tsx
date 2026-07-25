import { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useWorkspace } from '../../store/useWorkspace';
import type { Task, TaskStatus } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface Props {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onView?: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'review', title: 'Review', color: 'bg-amber-50' },
  { id: 'done', title: 'Done', color: 'bg-emerald-50' },
];

export function TasksKanban({ tasks, onEdit, onView }: Props) {
  const { updateTaskStatus, reorderTask } = useWorkspace();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverColumn = COLUMNS.some(c => c.id === overId);
    const activeTaskData = tasks.find(t => t.id === activeId);
    
    if (!activeTaskData) return;

    if (isOverColumn) {
      // Dropped onto an empty column
      if (activeTaskData.status !== overId) {
        updateTaskStatus(activeId, overId as TaskStatus);
      }
    } else {
      // Dropped onto a task (sort/reorder)
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        // We pass the overTask's status. If it's a different column, it changes status and moves above it.
        // If it's the same column, it just moves above it.
        reorderTask(activeId, overId, overTask.status);
      }
    }
  };

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 md:gap-6 w-full h-full items-start">
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.status === column.id);
            return (
              <KanbanColumn 
                key={column.id} 
                id={column.id} 
                title={column.title} 
                color={column.color} 
                tasks={columnTasks} 
                onEdit={onEdit}
                onView={onView}
              />
            );
          })}
        </div>
        
        {/* Visual overlay for the item being dragged */}
        <DragOverlay>
          {activeTask ? (
             <div className="opacity-90 rotate-3 scale-105 transition-transform shadow-xl">
               <KanbanCard task={activeTask} />
             </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
