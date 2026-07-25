import { useState } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar() {
  const { tasks } = useWorkspace();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Generate calendar grid
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-slate-100 bg-slate-50/50" />);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate.startsWith(dateStr));
    const isToday = new Date().toISOString().split('T')[0] === dateStr;
    
    days.push(
      <div key={`day-${i}`} className={`min-h-[100px] border border-slate-100 p-2 transition-colors hover:bg-slate-50 ${isToday ? 'bg-[var(--primary)]/5' : 'bg-white'}`}>
        <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-[var(--primary)] text-white' : 'text-slate-500'}`}>
          {i}
        </div>
        <div className="flex flex-col gap-1">
          {dayTasks.map(task => (
            <div key={task.id} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] truncate" title={task.title}>
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">Track deadlines and project schedules.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-700">{monthNames[month]} {year}</h2>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-100 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-l-0">
          {days}
        </div>
      </div>
    </div>
  );
}
