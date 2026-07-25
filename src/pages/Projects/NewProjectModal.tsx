import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { useWorkspace } from '../../store/useWorkspace';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description is too short'),
  dueDate: z.string().min(1, 'Due date is required'),
  color: z.enum(['emerald', 'indigo', 'violet', 'amber']),
});
type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: Props) {
  const { addProject, activeWorkspaceId } = useWorkspace();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', dueDate: '', color: 'indigo' },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Mock network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    addProject({
      ...data,
      workspaceId: activeWorkspaceId,
      status: 'planning',
      members: ['m1'], // Mock adding current user
    });
    
    toast.success('Project created successfully!');
    setIsSubmitting(false);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Project Name</label>
            <input
              type="text"
              {...register('name')}
              className={`h-10 rounded-md border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} px-3 text-sm focus:outline-none focus:ring-2`}
              placeholder="e.g. Website Redesign"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              {...register('description')}
              className={`min-h-[80px] rounded-md border ${errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} p-3 text-sm focus:outline-none focus:ring-2 resize-none`}
              placeholder="Briefly describe the goals of this project..."
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Target Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className={`h-10 rounded-md border ${errors.dueDate ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} px-3 text-sm focus:outline-none focus:ring-2`}
            />
            {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Theme Color</label>
            <select
              {...register('color')}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-white"
            >
              <option value="indigo">Indigo</option>
              <option value="emerald">Emerald</option>
              <option value="violet">Violet</option>
              <option value="amber">Amber</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[var(--primary)] text-white hover:opacity-90">
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
