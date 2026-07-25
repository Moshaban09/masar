import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../store/useWorkspace';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, CalendarDays, MoreHorizontal } from 'lucide-react';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks } = useWorkspace();

  const project = projects.find((p) => p.id === id);
  const projectTasks = tasks.filter((t) => t.projectId === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Project not found</h2>
        <Button variant="outline" onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <Link to="/projects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Projects
        </Link>
        <Button variant="outline" size="sm" className="h-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">{project.name}</h1>
              <Badge variant="secondary" className="capitalize">
                {project.status.replace('-', ' ')}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">{project.description}</p>
          </div>
          
          <div className="flex flex-col items-end gap-3 min-w-[200px] shrink-0">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              Due: <span className="font-semibold text-slate-900">{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="w-full">
               <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-slate-700">Overall Progress</span>
                  <span className="text-xs font-semibold text-slate-900">{project.progress}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${project.progress}%` }} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tasks" className="w-full mt-2">
        <TabsList className="bg-slate-100/50 p-1">
          <TabsTrigger value="tasks" className="rounded-md px-6">Tasks</TabsTrigger>
          <TabsTrigger value="overview" className="rounded-md px-6">Overview</TabsTrigger>
          <TabsTrigger value="files" className="rounded-md px-6">Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             {projectTasks.length > 0 ? (
               <div className="divide-y divide-slate-100">
                 {projectTasks.map((task) => (
                   <div key={task.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-3">
                       <input type="checkbox" checked={task.status === 'done'} readOnly className="w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
                       <span className={`text-sm font-medium ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                         {task.title}
                       </span>
                     </div>
                     <Badge variant="outline" className="capitalize text-[10px]">{task.priority}</Badge>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-12 text-center text-slate-500">
                 No tasks found for this project. Add some to track progress.
               </div>
             )}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
             <h3 className="text-lg font-medium text-slate-900 mb-4">Project Details</h3>
             <p className="text-sm text-slate-600 leading-relaxed mb-6">
               This tab will contain rich text descriptions, project resources, and team member management in a future update.
             </p>
           </div>
        </TabsContent>
        
        <TabsContent value="files" className="mt-6">
           <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-sm text-center">
             <p className="text-sm text-slate-500">File attachments are coming in a future release.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
