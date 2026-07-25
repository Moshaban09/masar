import { Outlet } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import { useEffect } from 'react';

export function AuthLayout() {
  useEffect(() => {
    document.title = 'Masar';
  }, []);
  return (
    <div className="flex h-screen w-full bg-white text-slate-900">
      {/* Left Panel - Auth Forms */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-24 xl:px-32 relative">
        {/* Brand Logo - Top Left */}
        <div className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-900 font-semibold text-lg">
          <Hexagon className="w-6 h-6 text-[var(--primary)] fill-[var(--primary)]/20" />
          Masar
        </div>
        
        {/* Form Outlet */}
        <div className="w-full max-w-sm mx-auto">
          <Outlet />
        </div>
      </div>

      {/* Right Panel - Product Showcase (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-slate-50 border-l border-slate-200 p-12 lg:p-24 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 flex flex-col justify-center h-full">
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight mb-6">
            Manage your projects with <br/> unparalleled clarity.
          </h2>
          <p className="text-slate-500 text-lg mb-12 max-w-md">
            Masar keeps our team aligned, focused, and shipping faster than ever before. It's the developer-first workspace we always wanted.
          </p>

          {/* Mini Mock Dashboard Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-md">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-semibold">
                  M
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Masar v2.0 Launch</h4>
                  <p className="text-xs text-slate-500">In Progress • 85% Complete</p>
                </div>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] w-[85%] rounded-full"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
