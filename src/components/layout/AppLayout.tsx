import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '../CommandPalette';

export function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
