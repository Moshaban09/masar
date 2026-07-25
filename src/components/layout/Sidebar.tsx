import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, CalendarDays, Settings, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../store/useAuth';

export function Sidebar({ className }: { className?: string }) {
  const { user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Calendar', path: '/calendar', icon: CalendarDays },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={cn(
      "w-64 border-r border-slate-200 bg-white flex flex-col h-full shrink-0 hidden md:flex",
      className
    )}>
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
          <img src="/favicon.svg" alt="Masar Logo" className="w-6 h-6" />
          Masar
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Plan Upgrade Prompt */}
      {user?.plan === 'free' && (
        <div className="p-4 shrink-0">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-1">Upgrade to Pro</h4>
            <p className="text-xs text-slate-500 mb-3">Unlock unlimited projects and team capacity.</p>
            <NavLink to="/settings" className="w-full inline-block text-center text-xs font-semibold bg-white border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              View Plans
            </NavLink>
          </div>
        </div>
      )}
    </aside>
  );
}
