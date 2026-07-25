
import { useState } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import type { Task } from '../../types';
import { Button } from '../../components/ui/button';
import { Plus, LayoutGrid, List as ListIcon, Search } from 'lucide-react';
import { TasksList } from './TasksList';
import { TasksKanban } from './TasksKanban';
import { NewTaskModal } from './NewTaskModal';

export function Tasks() {
  const { tasks } = useWorkspace();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, track, and organize your work.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-64 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
            />
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm shrink-0">
            <button 
              onClick={() => setView('kanban')}
              className={`p-1.5 rounded-md transition-colors ${view === 'kanban' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-[var(--primary)] text-white shadow-sm hover:opacity-90 shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {view === 'kanban' ? (
          <TasksKanban tasks={filteredTasks} onEdit={setTaskToEdit} />
        ) : (
          <TasksList tasks={filteredTasks} onEdit={setTaskToEdit} />
        )}
      </div>

      <NewTaskModal 
        isOpen={isModalOpen || !!taskToEdit} 
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }} 
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
