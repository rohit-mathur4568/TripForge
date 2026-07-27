import { Link } from "react-router";
import {
  ArrowLeft,
  Users,
  MapPin,
  TrendingUp,
  Activity,
  PieChart as PieChartIcon,
  BarChart3
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ['#173d2e', '#39734f', '#78a083', '#eaff9d', '#fef08a'];

const MOCK_USER_GROWTH = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 600 },
  { name: 'Mar', users: 800 },
  { name: 'Apr', users: 1200 },
  { name: 'May', users: 2100 },
  { name: 'Jun', users: 3400 },
];

const MOCK_DESTINATIONS = [
  { name: "Paris, France", value: 400 },
  { name: "Tokyo, Japan", value: 300 },
  { name: "Bali, Indonesia", value: 300 },
  { name: "Rome, Italy", value: 200 },
];

function AdminDashboardPage() {
  return (
    <div className="space-y-7 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h1 className="text-2xl font-black text-[#173d2e] dark:text-white">
               System Analytics
             </h1>
             <p className="text-[#708078] dark:text-slate-400 mt-1 text-sm font-bold">
               Monitor platform usage, user growth, and popular travel destinations.
             </p>
          </div>
          <div className="rounded-lg bg-[#eaff9d] dark:bg-emerald-500/20 text-[#173d2e] dark:text-emerald-400 px-5 py-2.5 text-sm font-black shadow-sm flex items-center gap-2 border border-transparent dark:border-emerald-500/30">
            <Activity className="w-4 h-4" /> Live Data
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard icon={Users} title="Total Users" value="12,450" trend="+14% this month" trendColor="text-[#39734f] dark:text-emerald-400" />
          <MetricCard icon={MapPin} title="Trips Generated" value="34,210" trend="+22% this month" trendColor="text-[#39734f] dark:text-emerald-400" />
          <MetricCard icon={TrendingUp} title="Active Sessions" value="842" trend="Live" trendColor="text-blue-600 dark:text-blue-400" />
          <MetricCard icon={Activity} title="System Health" value="99.9%" trend="Nominal" trendColor="text-[#78a083] dark:text-emerald-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mt-7">
           {/* Bar Chart */}
           <section className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#e2eadc] dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h2 className="text-base font-black text-[#173d2e] dark:text-white">User Growth</h2>
                    <p className="text-xs font-bold text-[#708078] dark:text-slate-400 mt-1">Monthly active users (6 months)</p>
                 </div>
                 <BarChart3 className="w-5 h-5 text-[#708078] dark:text-slate-500" />
              </div>
              <div className="flex-1 min-h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={MOCK_USER_GROWTH}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1eadb" opacity={0.2} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#708078', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#708078', fontSize: 12}} dx={-10} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2eadc', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backgroundColor: '#fff', color: '#000' }}
                        cursor={{fill: 'rgba(23,61,46,0.05)'}}
                     />
                     <Bar dataKey="users" fill="#173d2e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
           </section>

           {/* Pie Chart */}
           <section className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#e2eadc] dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h2 className="text-base font-black text-[#173d2e] dark:text-white">Trending Destinations</h2>
                    <p className="text-xs font-bold text-[#708078] dark:text-slate-400 mt-1">Most searched locations</p>
                 </div>
                 <PieChartIcon className="w-5 h-5 text-[#708078] dark:text-slate-500" />
              </div>
              <div className="flex-1 min-h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={MOCK_DESTINATIONS}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {MOCK_DESTINATIONS.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2eadc', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backgroundColor: '#fff', color: '#000' }}
                     />
                     <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}/>
                   </PieChart>
                 </ResponsiveContainer>
              </div>
           </section>
        </div>
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, trend, trendColor }) {
  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-[#e2eadc] dark:border-slate-800 shadow-sm transition-colors duration-300">
       <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-xl bg-[#f4f9ef] dark:bg-slate-800 text-[#173d2e] dark:text-emerald-400 flex items-center justify-center border border-[#e2eadc] dark:border-slate-700">
             <Icon className="w-5 h-5" />
          </div>
          <div className={`text-xs font-bold ${trendColor}`}>
             {trend}
          </div>
       </div>
       <div className="mt-4">
          <p className="text-xs font-bold text-[#708078] dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-[#173d2e] dark:text-white mt-1">{value}</p>
       </div>
    </div>
  );
}

export default AdminDashboardPage;
