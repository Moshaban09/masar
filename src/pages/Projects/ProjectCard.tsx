import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import type { Project } from '../../types';
import { Clock } from 'lucide-react';

export function ProjectCard({ project }: { project: Project }) {
  const getColorCode = (color: string) => {
    const map: Record<string, string> = {
      emerald: 'bg-emerald-500',
      indigo: 'bg-indigo-500',
      violet: 'bg-violet-500',
      amber: 'bg-amber-500',
    };
    return map[color] || 'bg-slate-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'planning': return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
      case 'completed': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
    }
  };

  return (
    <Link to={`/projects/${project.id}`} className="block group">
      <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all h-full flex flex-col">
        <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-10 rounded-full ${getColorCode(project.color)} shrink-0`} />
            <div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                {project.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{project.description}</p>
            </div>
          </div>
          <Badge variant="secondary" className={`capitalize shrink-0 text-[10px] px-2 py-0.5 rounded-md ${getStatusColor(project.status)}`}>
            {project.status.replace('-', ' ')}
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end pt-2">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-slate-700">Progress</span>
              <span className="text-xs font-semibold text-slate-900">{project.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getColorCode(project.color)} rounded-full`} 
                style={{ width: `${project.progress}%` }} 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
             <div className="flex items-center gap-1.5 text-xs text-slate-500">
               <Clock className="w-3.5 h-3.5" />
               {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
             </div>
             <div className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
               {project.tasksDone} / {project.tasksTotal} Tasks
             </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
