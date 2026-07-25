import { DashboardMetrics } from './DashboardMetrics';
import { DashboardCharts } from './DashboardCharts';
import { DashboardFeed } from './DashboardFeed';
import { useAuth } from '../../store/useAuth';
import { useState } from 'react';

export function Dashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Good morning, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening in your workspace today.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all shadow-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* KPI Metrics */}
      <DashboardMetrics />

      {/* Charts Section */}
      <DashboardCharts />

      {/* Feeds Section */}
      <DashboardFeed period={period} />
    </div>
  );
}
