import { useWorkspace } from '../../store/useWorkspace';
import { Bell, Clock, CalendarDays, UserPlus } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';

export function Notifications() {
  const { notifications, markNotificationRead } = useWorkspace();

  const getIcon = (type: string) => {
    switch (type) {
      case 'assign': return <UserPlus className="w-4 h-4 text-indigo-500" />;
      case 'deadline': return <CalendarDays className="w-4 h-4 text-amber-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated on your team's activity.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col divide-y divide-slate-100">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 sm:p-5 flex gap-4 transition-colors hover:bg-slate-50 ${!notification.read ? 'bg-[var(--primary)]/5' : ''}`}
            onClick={() => !notification.read && markNotificationRead(notification.id)}
          >
            <div className="mt-1 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2">
                <h4 className={`text-sm ${!notification.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                  {notification.title}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(notification.time)}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1">{notification.body}</p>
            </div>
            
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
            )}
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Bell className="w-8 h-8 text-slate-300 mb-3" />
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
