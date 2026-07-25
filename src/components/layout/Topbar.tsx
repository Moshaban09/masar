import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../store/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useLocation, Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../ui/sheet';
import { Sidebar } from './Sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const pathName = location.pathname.split('/')[1] || 'dashboard';
  const breadcrumb = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      {/* Breadcrumbs and Mobile Nav */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar className="flex" />
          </SheetContent>
        </Sheet>

        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Masar</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Fallback title for mobile */}
        <h2 className="md:hidden text-sm font-semibold text-slate-900">{breadcrumb}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search... (Cmd+K)"
            className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-[var(--primary)] ring-2 ring-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-900 leading-none">{user?.name}</span>
            <span className="text-xs text-slate-500 mt-1 leading-none capitalize">{user?.plan} Plan</span>
          </div>
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-[var(--primary)] transition-all">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-slate-100 text-slate-600">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
