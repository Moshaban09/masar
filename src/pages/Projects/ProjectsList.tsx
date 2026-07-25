import { useState } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import { Button } from '../../components/ui/button';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { NewProjectModal } from './NewProjectModal';

export function ProjectsList() {
  const { projects } = useWorkspace();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your team's initiatives.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button 
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
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
          <Button onClick={() => setIsModalOpen(true)} className="bg-[var(--primary)] text-white shadow-sm hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No projects found. Create one to get started!
            </div>
          )}
        </div>
      )}

      {/* List View (Simplified placeholder for Table) */}
      {view === 'list' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Project Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Progress</th>
                  <th className="px-6 py-4 font-medium text-right">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                    <td className="px-6 py-4 capitalize text-slate-600">{p.status.replace('-', ' ')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      {new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
