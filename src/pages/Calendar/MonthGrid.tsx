import type { Task } from '../../types';

interface Props {
  year: number;
  month: number;
  daysInMonth: number;
  firstDayOfMonth: number;
  tasks: Task[];
  getDateStr: (d: Date) => string;
  setTaskToView: (task: Task) => void;
  shortDayNames: string[];
}

export function MonthGrid({ year, month, daysInMonth, firstDayOfMonth, tasks, getDateStr, setTaskToView, shortDayNames }: Props) {
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-slate-100 bg-slate-50/50" />);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const dateStr = getDateStr(d);
    const dayTasks = tasks.filter(t => t.dueDate.startsWith(dateStr));
    const isToday = getDateStr(new Date()) === dateStr;
    
    days.push(
      <div key={`day-${i}`} className={`min-h-[100px] border border-slate-100 p-2 transition-colors hover:bg-slate-50 ${isToday ? 'bg-[var(--primary)]/5' : 'bg-white'}`}>
        <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-[var(--primary)] text-white' : 'text-slate-500'}`}>
          {i}
        </div>
        <div className="flex flex-col gap-1">
          {dayTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => setTaskToView(task)}
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded cursor-pointer truncate ${task.status === 'done' ? 'bg-slate-100 text-slate-400 line-through' : 'bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20'}`} 
              title={task.title}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {shortDayNames.map(day => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-100 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l-0">
        {days}
      </div>
    </div>
  );
}
