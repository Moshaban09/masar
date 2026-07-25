import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useWorkspace } from '../../store/useWorkspace';

export function DashboardCharts() {
  const { tasks, projects } = useWorkspace();

  // Project Status Distribution
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;
  const planningCount = projects.filter(p => p.status === 'planning').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const onHoldCount = projects.filter(p => p.status === 'on-hold').length;

  let pieData = [
    { name: 'Completed', value: completedCount, color: '#10B981' },
    { name: 'In Progress', value: inProgressCount, color: '#4F46E5' },
    { name: 'Planning', value: planningCount, color: '#F59E0B' },
    { name: 'On Hold', value: onHoldCount, color: '#94A3B8' },
  ].filter(d => d.value > 0);
  
  if (pieData.length === 0) {
    pieData = [{ name: 'No Projects', value: 1, color: '#E2E8F0' }];
  }

  // Weekly Task Velocity (Based on Completed Tasks Due Dates)
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  tasks.forEach(task => {
    if (task.dueDate && task.status === 'done') {
      const date = new Date(task.dueDate);
      if (!isNaN(date.getTime())) {
        dayCounts[date.getDay()]++;
      }
    }
  });

  const areaData = [
    { name: 'Mon', tasks: dayCounts[1] },
    { name: 'Tue', tasks: dayCounts[2] },
    { name: 'Wed', tasks: dayCounts[3] },
    { name: 'Thu', tasks: dayCounts[4] },
    { name: 'Fri', tasks: dayCounts[5] },
    { name: 'Sat', tasks: dayCounts[6] },
    { name: 'Sun', tasks: dayCounts[0] },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Area Chart */}
      <Card className="lg:col-span-2 border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">Weekly Task Velocity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="tasks" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Donut Chart */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">Project Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  itemStyle={{ fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
