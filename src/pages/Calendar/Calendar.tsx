import { useState } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import type { Task } from '../../types';
import { TaskDetailsModal } from '../Tasks/TaskDetailsModal';
import { NewTaskModal } from '../Tasks/NewTaskModal';
import { MonthGrid } from './MonthGrid';
import { WeekGrid } from './WeekGrid';

export function Calendar() {
  const { tasks } = useWorkspace();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  
  const [taskToView, setTaskToView] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const navigatePrev = () => {
    if (view === 'month') setCurrentDate(new Date(year, month - 1, 1));
    else if (view === 'week') setCurrentDate(new Date(year, month, currentDate.getDate() - 7));
    else setCurrentDate(new Date(year, month, currentDate.getDate() - 1));
  };
  
  const navigateNext = () => {
    if (view === 'month') setCurrentDate(new Date(year, month + 1, 1));
    else if (view === 'week') setCurrentDate(new Date(year, month, currentDate.getDate() + 7));
    else setCurrentDate(new Date(year, month, currentDate.getDate() + 1));
  };

  const navigateToday = () => setCurrentDate(new Date());

  // Helper for generating date strings
  const getDateStr = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };



  // Week View Grid
  const generateWeekGrid = () => {
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
    return days;
  };

  // Day View List
  const generateDayView = () => {
    const dateStr = getDateStr(currentDate);
    const dayTasks = tasks.filter(t => t.dueDate.startsWith(dateStr));
    const isToday = getDateStr(new Date()) === dateStr;
    
    return (
      <div className={`flex-1 border border-slate-200 rounded-b-xl p-6 bg-white`}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <span className={`text-xl font-bold ${isToday ? 'text-[var(--primary)]' : 'text-slate-800'}`}>
            {dayNames[currentDate.getDay()]}
          </span>
          <span className={`text-lg font-medium text-slate-500`}>
            {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
          </span>
          {isToday && (
            <span className="ml-2 text-xs font-bold text-white bg-[var(--primary)] px-2 py-0.5 rounded-full uppercase tracking-wider">Today</span>
          )}
        </div>
        
        <div className="max-w-3xl space-y-3">
          {dayTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => setTaskToView(task)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${task.status === 'done' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-[var(--primary)]/40'}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-2 h-10 rounded-full ${task.status === 'done' ? 'bg-slate-300' : 'bg-[var(--primary)]'}`} />
                <div>
                  <h4 className={`text-sm font-semibold ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{task.project}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Due Today</span>
              </div>
            </div>
          ))}
          {dayTasks.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">You have no tasks scheduled for this day.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">Track deadlines and project schedules.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* View Toggles */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${view === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-slate-700 min-w-[120px] text-right">
              {view === 'day' 
                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`
                : `${monthNames[month]} ${year}`}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={navigateToday} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
                Today
              </button>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                <button onClick={navigatePrev} className="p-1 rounded-md hover:bg-slate-100 transition-colors text-slate-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={navigateNext} className="p-1 rounded-md hover:bg-slate-100 transition-colors text-slate-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {view === 'month' && (
          <MonthGrid 
            year={year} 
            month={month} 
            daysInMonth={daysInMonth} 
            firstDayOfMonth={firstDayOfMonth} 
            tasks={tasks} 
            getDateStr={getDateStr} 
            setTaskToView={setTaskToView} 
            shortDayNames={shortDayNames} 
          />
        )}

        {view === 'week' && (
          <WeekGrid 
            currentDate={currentDate} 
            tasks={tasks} 
            getDateStr={getDateStr} 
            setTaskToView={setTaskToView} 
            shortDayNames={shortDayNames} 
          />
        )}

        {view === 'day' && generateDayView()}
      </div>

      {/* Reused Modals */}
      <NewTaskModal 
        isOpen={!!taskToEdit} 
        onClose={() => setTaskToEdit(null)} 
        initialProjectId={taskToEdit?.projectId || undefined}
        taskToEdit={taskToEdit}
      />
      
      <TaskDetailsModal 
        isOpen={!!taskToView} 
        onClose={() => setTaskToView(null)} 
        task={taskToView}
        onEdit={() => {
          setTaskToEdit(taskToView);
          setTaskToView(null);
        }}
      />
    </div>
  );
}
