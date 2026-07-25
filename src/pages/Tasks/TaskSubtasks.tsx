import { useState } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import { CheckSquare, Check, X, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Props {
  taskId: string;
}

export function TaskSubtasks({ taskId }: Props) {
  const { tasks, toggleSubTask, addSubTask, deleteSubTask, updateSubTask } = useWorkspace();
  const task = tasks.find(t => t.id === taskId);
  
  const [newSubtask, setNewSubtask] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editSubtaskTitle, setEditSubtaskTitle] = useState('');

  if (!task) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      addSubTask(taskId, newSubtask.trim());
      setNewSubtask('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-[var(--primary)]" />
          Subtasks
        </h3>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {task.subTasks?.filter(st => st.done).length || 0} / {task.subTasks?.length || 0}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        {task.subTasks?.map(st => (
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
                       updateSubTask(taskId, st.id, editSubtaskTitle);
                       setEditingSubtaskId(null);
                     } else if (e.key === 'Escape') {
                       setEditingSubtaskId(null);
                     }
                  }}
                />
                <button onClick={() => { updateSubTask(taskId, st.id, editSubtaskTitle); setEditingSubtaskId(null); }} className="p-1 text-green-600 hover:bg-green-50 rounded">
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
                    onChange={() => toggleSubTask(taskId, st.id)} 
                    className="w-4 h-4 text-[var(--primary)] rounded border-slate-300 focus:ring-[var(--primary)] cursor-pointer" 
                  />
                  <span className={`text-sm font-medium transition-colors ${st.done ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-slate-900'}`}>{st.title}</span>
                </label>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingSubtaskId(st.id); setEditSubtaskTitle(st.title); }} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteSubTask(taskId, st.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
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
  );
}
