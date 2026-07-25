import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useWorkspace } from '../../store/useWorkspace';
import type { Task } from '../../types';
import { Clock, CheckSquare, MessageSquare, Send, AlertTriangle, Pencil, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../store/useAuth';
import { formatRelativeTime } from '../../lib/dateUtils';

interface Props {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose, onEdit }: Props) {
  const { tasks, members, toggleSubTask, addSubTask, deleteSubTask, updateSubTask, addTaskComment, deleteTaskComment, updateTaskComment, deleteTask } = useWorkspace();
  const { user } = useAuth();
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editSubtaskTitle, setEditSubtaskTitle] = useState('');
  
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentBody, setEditCommentBody] = useState('');

  if (!task) return null;

  const currentTask = tasks.find(t => t.id === task.id) || task;
  const assignee = members.find(m => m.id === currentTask.assignee);

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      addSubTask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addTaskComment(task.id, user?.name || 'User', user?.avatar || '', newComment.trim());
      setNewComment('');
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden bg-slate-50 border-0 shadow-2xl">
        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Main Content: Details & Checklists */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
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
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[var(--primary)]" />
                  Subtasks
                </h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {currentTask.subTasks?.filter(st => st.done).length || 0} / {currentTask.subTasks?.length || 0}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                {currentTask.subTasks?.map(st => (
                  <div key={st.id} className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                    {editingSubtaskId === st.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={editSubtaskTitle}
                          onChange={(e) => setEditSubtaskTitle(e.target.value)}
                          className="flex-1 h-7 rounded border border-slate-200 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)] bg-white"
                          autoFocus
                          onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                               updateSubTask(currentTask.id, st.id, editSubtaskTitle);
                               setEditingSubtaskId(null);
                             } else if (e.key === 'Escape') {
                               setEditingSubtaskId(null);
                             }
                          }}
                        />
                        <button onClick={() => { updateSubTask(currentTask.id, st.id, editSubtaskTitle); setEditingSubtaskId(null); }} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingSubtaskId(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input 
                            type="checkbox" 
                            checked={st.done} 
                            onChange={() => toggleSubTask(currentTask.id, st.id)} 
                            className="w-4 h-4 text-[var(--primary)] rounded border-slate-300 focus:ring-[var(--primary)] cursor-pointer" 
                          />
                          <span className={`text-sm font-medium transition-colors ${st.done ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-slate-900'}`}>{st.title}</span>
                        </label>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingSubtaskId(st.id); setEditSubtaskTitle(st.title); }} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteSubTask(currentTask.id, st.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input 
                  type="text" 
                  value={newSubtask} 
                  onChange={(e) => setNewSubtask(e.target.value)} 
                  placeholder="Add a subtask..." 
                  className="flex-1 h-9 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-slate-50"
                />
                <Button type="submit" size="sm" variant="secondary" className="h-9 font-medium shadow-sm">Add</Button>
              </form>
            </div>
          </div>

          {/* Sidebar: Comments */}
          <div className="w-full md:w-[280px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-200 bg-white shrink-0">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
                Comments
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {currentTask.comments?.length > 0 ? (
                currentTask.comments.map(c => (
                  <div key={c.id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <img src={c.avatar} className="w-7 h-7 rounded-full shrink-0 object-cover border border-slate-200 shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">{c.memberName}</span>
                          <span className="text-[9px] font-medium text-slate-400 shrink-0">{formatRelativeTime(c.time)}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingCommentId(c.id); setEditCommentBody(c.body); }} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteTaskComment(currentTask.id, c.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm relative">
                        <div className="absolute top-2 -left-[5px] w-2 h-2 bg-white border-l border-t border-slate-200 rotate-[-45deg]" />
                        {editingCommentId === c.id ? (
                          <div className="relative z-10">
                            <textarea
                              value={editCommentBody}
                              onChange={(e) => setEditCommentBody(e.target.value)}
                              className="w-full text-xs p-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] min-h-[50px] resize-none"
                            />
                            <div className="flex justify-end gap-1 mt-1">
                              <button onClick={() => setEditingCommentId(null)} className="text-[10px] font-medium px-2 py-1 rounded text-slate-500 hover:bg-slate-100">Cancel</button>
                              <button onClick={() => { updateTaskComment(currentTask.id, c.id, editCommentBody); setEditingCommentId(null); }} className="text-[10px] font-medium px-2 py-1 rounded text-white bg-[var(--primary)] hover:opacity-90">Save</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-slate-700 leading-relaxed relative z-10 whitespace-pre-wrap">{c.body}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50">
                  <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs font-medium text-slate-500">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
            <form onSubmit={handleAddComment} className="p-4 bg-white border-t border-slate-200 shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full h-10 rounded-full border border-slate-200 pl-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-slate-50"
                />
                <button type="submit" disabled={!newComment.trim()} className="absolute right-1.5 p-1.5 text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-full disabled:opacity-50 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
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
