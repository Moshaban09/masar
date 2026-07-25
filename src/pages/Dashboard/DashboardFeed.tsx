import { useWorkspace } from '../../store/useWorkspace';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { CheckCircle2, Clock, MessageSquare, Plus, Edit } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { isAfter, subDays, startOfDay, subMonths } from 'date-fns';

export function DashboardFeed({ period = 'week' }: { period?: 'today' | 'week' | 'month' }) {
  const { activities, tasks } = useWorkspace();
  
  const upcomingTasks = tasks.filter(t => t.status !== 'done').slice(0, 3);
  
  const filteredActivities = activities.filter(activity => {
    try {
      const date = new Date(activity.time);
      if (isNaN(date.getTime())) return true;
      const now = new Date();
      if (period === 'today') return isAfter(date, startOfDay(now));
      if (period === 'week') return isAfter(date, subDays(now, 7));
      if (period === 'month') return isAfter(date, subMonths(now, 1));
      return true;
    } catch {
      return true;
    }
  });

  const recentActivities = filteredActivities.slice(0, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'complete': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'create': return <Plus className="w-4 h-4 text-indigo-500" />;
      case 'update': return <Edit className="w-4 h-4 text-amber-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Deadlines */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-[var(--primary)] transition-colors">
                   <Clock className="w-5 h-5 text-slate-400 group-hover:text-[var(--primary)] transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{task.project}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-semibold text-slate-700">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 rounded ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
              </div>
            </div>
          ))}
          {upcomingTasks.length === 0 && (
             <div className="text-center p-4 text-slate-500 text-sm">No upcoming deadlines! 🎉</div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-slate-200 ml-3 pl-5 space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="relative">
                <div className="absolute -left-[29px] mt-1 bg-white p-1 rounded-full border border-slate-200">
                   {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm text-slate-900">
                    <span className="font-semibold">{activity.member}</span> {activity.action} <span className="font-semibold">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{formatRelativeTime(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
