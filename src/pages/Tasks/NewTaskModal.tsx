import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { useWorkspace } from '../../store/useWorkspace';
import { toast } from 'sonner';
import type { Task } from '../../types';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  projectId: z.string().min(1, 'Please select a project'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().min(1, 'Due date is required'),
  assignee: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string;
  taskToEdit?: Task | null;
}

export function NewTaskModal({ isOpen, onClose, initialProjectId, taskToEdit }: Props) {
  const { addTask, updateTask, projects, members, activeWorkspaceId } = useWorkspace();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { 
      title: taskToEdit?.title || '', 
      projectId: taskToEdit?.projectId || initialProjectId || '', 
      priority: (taskToEdit?.priority as any) || 'medium', 
      dueDate: taskToEdit?.dueDate || '',
      assignee: taskToEdit?.assignee || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ 
        title: taskToEdit?.title || '', 
        projectId: taskToEdit?.projectId || initialProjectId || '', 
        priority: (taskToEdit?.priority as any) || 'medium', 
        dueDate: taskToEdit?.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
        assignee: taskToEdit?.assignee || '',
      });
    }
  }, [isOpen, initialProjectId, taskToEdit, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Mock network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    if (taskToEdit) {
      updateTask(taskToEdit.id, data);
      toast.success('Task updated successfully!');
    } else {
      const p = projects.find(proj => proj.id === data.projectId);
      addTask({
        ...data,
        project: p?.name || 'Unknown Project',
        status: 'todo',
        assignee: data.assignee || 'm1',
        workspaceId: activeWorkspaceId,
      });
      toast.success('Task created successfully!');
    }
    
    setIsSubmitting(false);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Task Title</label>
            <input
              type="text"
              {...register('title')}
              className={`h-10 rounded-md border ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} px-3 text-sm focus:outline-none focus:ring-2`}
              placeholder="e.g. Design Landing Page"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Project</label>
            <select
              {...register('projectId')}
              className={`h-10 rounded-md border ${errors.projectId ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} px-3 text-sm focus:outline-none focus:ring-2 bg-white`}
            >
              <option value="">Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Priority</label>
            <select
              {...register('priority')}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className={`h-10 rounded-md border ${errors.dueDate ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} px-3 text-sm focus:outline-none focus:ring-2`}
            />
            {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Assign To</label>
            <select
              {...register('assignee')}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-white"
            >
              <option value="">Unassigned</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[var(--primary)] text-white hover:opacity-90">
              {isSubmitting ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
