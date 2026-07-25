import { Search, Menu } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../ui/sheet';
import { Sidebar } from './Sidebar';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserDropdown } from './UserDropdown';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export function Topbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const pathName = location.pathname.split('/')[1] || 'dashboard';
  const breadcrumb = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      {/* Breadcrumbs and Mobile Nav */}
      <div className="flex items-center gap-3">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 max-w-[16rem] border-r-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar className="flex w-full" />
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

        <NotificationsDropdown />
        <UserDropdown />
      </div>
    </header>
  );
}
