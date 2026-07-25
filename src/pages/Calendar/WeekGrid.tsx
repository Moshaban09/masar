import type { Task } from '../../types';

interface Props {
  currentDate: Date;
  tasks: Task[];
  getDateStr: (d: Date) => string;
  setTaskToView: (task: Task) => void;
  shortDayNames: string[];
}

export function WeekGrid({ currentDate, tasks, getDateStr, setTaskToView, shortDayNames }: Props) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start on Sunday
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = getDateStr(d);
    const dayTasks = tasks.filter(t => t.dueDate.startsWith(dateStr));
    const isToday = getDateStr(new Date()) === dateStr;
    
    days.push(
      <div key={`week-day-${i}`} className={`min-h-[300px] border border-slate-100 p-3 transition-colors ${isToday ? 'bg-[var(--primary)]/5' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <span className={`text-sm font-semibold ${isToday ? 'text-[var(--primary)]' : 'text-slate-700'}`}>
            {shortDayNames[d.getDay()]}
          </span>
          <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[var(--primary)] text-white' : 'text-slate-500 bg-slate-100'}`}>
            {d.getDate()}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {dayTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => setTaskToView(task)}
              className={`text-xs font-medium p-2 rounded-lg cursor-pointer border shadow-sm ${task.status === 'done' ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' : 'bg-white border-[var(--primary)]/30 hover:border-[var(--primary)]/60 text-slate-700 hover:shadow-md transition-all'}`} 
            >
              <div className="line-clamp-2">{task.title}</div>
              <div className="text-[10px] mt-1.5 font-medium text-slate-400 uppercase tracking-wider">{task.project}</div>
            </div>
          ))}
          {dayTasks.length === 0 && (
            <div className="text-xs text-slate-400 text-center py-4">No tasks</div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
      <div className="grid grid-cols-7 border-l-0">
        {days}
      </div>
    </div>
  );
}
