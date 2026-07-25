import { useWorkspace } from '../store/useWorkspace';
import { MessageSquare, CheckCircle, Plus, Edit, UserPlus, Clock } from 'lucide-react';

export function ActivityTimeline() {
  const { activities } = useWorkspace();

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-3.5 h-3.5 text-blue-500" />;
      case 'complete': return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
      case 'create': return <Plus className="w-3.5 h-3.5 text-emerald-500" />;
      case 'update': return <Edit className="w-3.5 h-3.5 text-orange-500" />;
      case 'assign': return <UserPlus className="w-3.5 h-3.5 text-indigo-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'comment': return 'bg-blue-50 border-blue-100';
      case 'complete': return 'bg-green-50 border-green-100';
      case 'create': return 'bg-emerald-50 border-emerald-100';
      case 'update': return 'bg-orange-50 border-orange-100';
      case 'assign': return 'bg-indigo-50 border-indigo-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
      <h3 className="text-sm font-semibold text-slate-900 mb-6">Recent Activity</h3>
      <div className="relative border-l border-slate-200 ml-3 space-y-6">
        {activities.slice(0, 10).map((activity) => (
          <div key={activity.id} className="relative pl-6">
            <span className={`absolute -left-3 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border ${getBgColor(activity.type)}`}>
              {getIcon(activity.type)}
            </span>
            <div className="flex flex-col">
              <div className="text-sm">
                <span className="font-semibold text-slate-900">{activity.member}</span>{' '}
                <span className="text-slate-600">{activity.action}</span>{' '}
                <span className="font-medium text-slate-900">{activity.target}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">{activity.time}</span>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-slate-500 pl-4">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
