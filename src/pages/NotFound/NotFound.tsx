import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Compass } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
            <Compass className="w-12 h-12 text-[var(--primary)]" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">404</h1>
          <h2 className="text-xl font-semibold text-slate-700">Lost your way?</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            We can't seem to find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        <div className="pt-4 flex justify-center">
          <Link to="/">
            <Button className="bg-[var(--primary)] text-white hover:opacity-90 px-8">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
