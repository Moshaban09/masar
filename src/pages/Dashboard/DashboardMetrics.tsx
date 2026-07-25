import { useWorkspace } from '../../store/useWorkspace';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderKanban, CheckSquare, Users, TrendingUp } from 'lucide-react';

export function DashboardMetrics() {
  const { projects, tasks, members } = useWorkspace();

  const totalProjects = projects.length;
  const activeTasks = tasks.filter(t => t.status !== 'done').length;
  const totalMembers = members.length;
  
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
    : 0;

  const metrics = [
    {
      title: 'Total Projects',
      value: totalProjects.toString(),
      icon: FolderKanban,
      trend: totalProjects > 0 ? 'Across workspace' : 'No projects yet',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Active Tasks',
      value: activeTasks.toString(),
      icon: CheckSquare,
      trend: activeTasks > 0 ? 'To be completed' : 'No active tasks',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Team Members',
      value: totalMembers.toString(),
      icon: Users,
      trend: totalMembers > 1 ? 'Growing team' : 'Just you',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Overall Progress',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      trend: avgProgress > 0 ? 'Average completion' : 'No progress',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bg}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">{metric.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
