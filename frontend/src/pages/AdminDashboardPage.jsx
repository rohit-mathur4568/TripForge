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
    <main className="min-h-screen px-5 py-8 text-[#17211a] md:px-8 md:py-10 bg-[#fbfdf9]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#526459] transition hover:text-[#173d2e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="text-sm font-black tracking-widest text-[#173d2e] uppercase bg-[#eaff9d] px-4 py-2 rounded-full">
            Admin Access
          </div>
        </div>

        <section className="mt-7 rounded-[34px] bg-[#173d2e] px-7 py-9 text-white shadow-[0_30px_80px_rgba(40,65,45,0.15)] md:px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1">
             <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#eaff9d]">
               System Analytics
             </p>
             <h1 className="mt-3 text-4xl font-black md:text-5xl">
               Admin Dashboard.
             </h1>
             <p className="mt-4 max-w-2xl leading-7 text-[#d8e3da]">
               Monitor platform usage, user growth, and popular travel destinations across the network. (Mock Data)
             </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-7">
          <MetricCard icon={Users} title="Total Users" value="12,450" trend="+14% this month" />
          <MetricCard icon={MapPin} title="Trips Generated" value="34,210" trend="+22% this month" />
          <MetricCard icon={TrendingUp} title="Active Sessions" value="842" trend="Live" />
          <MetricCard icon={Activity} title="System Health" value="99.9%" trend="All systems nominal" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mt-7">
           {/* Bar Chart */}
           <section className="bg-white rounded-[32px] p-8 border border-[#e1eadb] shadow-[0_20px_55px_rgba(40,65,45,0.05)]">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-[#edf8d9] text-[#173d2e] rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black">User Growth</h2>
                    <p className="text-sm text-[#708078]">Monthly active users over the last 6 months.</p>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={MOCK_USER_GROWTH}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1eadb" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#708078', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#708078', fontSize: 12}} dx={-10} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        cursor={{fill: '#f4f9ef'}}
                     />
                     <Bar dataKey="users" fill="#173d2e" radius={[6, 6, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
           </section>

           {/* Pie Chart */}
           <section className="bg-white rounded-[32px] p-8 border border-[#e1eadb] shadow-[0_20px_55px_rgba(40,65,45,0.05)]">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-[#edf8d9] text-[#173d2e] rounded-xl flex items-center justify-center">
                    <PieChartIcon className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black">Trending Destinations</h2>
                    <p className="text-sm text-[#708078]">Most searched and saved trip destinations.</p>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={MOCK_DESTINATIONS}
                       cx="50%"
                       cy="50%"
                       innerRadius={80}
                       outerRadius={120}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {MOCK_DESTINATIONS.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                     />
                     <Legend verticalAlign="bottom" height={36}/>
                   </PieChart>
                 </ResponsiveContainer>
              </div>
           </section>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ icon: Icon, title, value, trend }) {
  return (
    <div className="bg-white rounded-[26px] p-6 border border-[#e1eadb] shadow-[0_10px_40px_rgba(40,65,45,0.04)]">
       <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-[#f4f9ef] text-[#173d2e] flex items-center justify-center">
             <Icon className="w-6 h-6" />
          </div>
          <div className="bg-[#eaff9d]/30 text-[#173d2e] text-xs font-bold px-3 py-1 rounded-full">
             {trend}
          </div>
       </div>
       <div className="mt-5">
          <p className="text-sm font-bold text-[#708078]">{title}</p>
          <p className="text-3xl font-black text-[#17211a] mt-1">{value}</p>
       </div>
    </div>
  );
}

export default AdminDashboardPage;
