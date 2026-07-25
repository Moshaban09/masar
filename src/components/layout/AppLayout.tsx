import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '../CommandPalette';

export function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    const pathName = location.pathname.split('/')[1] || 'dashboard';
    const title = pathName.charAt(0).toUpperCase() + pathName.slice(1);
    document.title = `${title} | Masar`;
  }, [location]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-6 md:p-10 lg:p-12">
          <div className="mx-auto max-w-[1600px] h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
