import { Bell } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useWorkspace } from '../../store/useWorkspace';
import { formatRelativeTime } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export function NotificationsDropdown() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useWorkspace();
  const navigate = useNavigate();
  const hasUnread = notifications.some(n => !n.read);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors outline-none cursor-pointer">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-[var(--primary)] ring-2 ring-white" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <span className="font-semibold text-slate-900 text-sm">Notifications</span>
          {hasUnread && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] bg-slate-200 hover:bg-slate-200 text-slate-700">
                {notifications.filter(n => !n.read).length} new
              </Badge>
              <button 
                onClick={(e) => { e.stopPropagation(); markAllNotificationsRead(); }} 
                className="text-[10px] text-[var(--primary)] hover:underline font-medium"
              >
                Mark all read
              </button>
            </div>
          )}
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.slice(0, 5).map(notif => (
              <div 
                key={notif.id} 
                className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${notif.read ? 'opacity-60' : 'bg-white'}`} 
                onClick={() => markNotificationRead(notif.id)}
              >
                <div className="flex justify-between items-start mb-1.5 gap-2">
                  <span className="text-sm font-semibold text-slate-900 leading-tight">{notif.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{formatRelativeTime(notif.time)}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.body}</p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">No notifications yet.</div>
          )}
        </div>
        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
          <Button 
            variant="ghost" 
            className="w-full text-xs text-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 h-8" 
            onClick={() => navigate('/notifications')}
          >
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
