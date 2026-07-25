import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useWorkspace } from '../../store/useWorkspace';
import type { Task } from '../../types';
import { Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { TaskSubtasks } from './TaskSubtasks';
import { TaskComments } from './TaskComments';
interface Props {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose, onEdit }: Props) {
  const { tasks, members, deleteTask } = useWorkspace();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) return null;

  const currentTask = tasks.find(t => t.id === task.id) || task;
  const assignee = members.find(m => m.id === currentTask.assignee);

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[750px] w-[95vw] max-h-[90vh] md:max-h-none p-0 overflow-hidden bg-slate-50 border-0 shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[85vh] md:h-[500px] overflow-y-auto md:overflow-hidden">
          {/* Main Content: Details & Checklists */}
          <div className="flex-1 p-4 md:p-6 md:overflow-y-auto bg-white shrink-0">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.project}</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1 leading-snug">{task.title}</h2>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => { onClose(); onEdit(); }} className="h-8 text-xs font-medium border-slate-200">
                  Edit Task
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)} className="h-8 text-xs font-medium">
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">Status</span>
                <Badge variant="secondary" className="capitalize bg-white border border-slate-200 text-slate-700 shadow-sm">{currentTask.status.replace('-', ' ')}</Badge>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">Priority</span>
                <Badge variant="outline" className="capitalize bg-white shadow-sm">{currentTask.priority}</Badge>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2 md:col-span-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">Assignee</span>
                <div className="flex items-center gap-2">
                  {assignee ? (
                    <>
                      <img src={assignee.avatar} className="w-5 h-5 rounded-full object-cover shadow-sm border border-white ring-1 ring-slate-100" />
                      <span className="text-xs font-semibold text-slate-700">{assignee.name.split(' ')[0]}</span>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Unassigned</span>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2 md:col-span-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">Due Date</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(currentTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Subtasks */}
            <TaskSubtasks taskId={currentTask.id} />
          </div>

          {/* Sidebar: Comments */}
          <TaskComments taskId={currentTask.id} />
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <DialogTitle>Delete Task</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <strong>{currentTask.title}</strong>? This action cannot be undone and will remove all associated subtasks and comments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={() => {
            deleteTask(currentTask.id);
            setShowDeleteConfirm(false);
            onClose();
          }}>
            Yes, delete task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
