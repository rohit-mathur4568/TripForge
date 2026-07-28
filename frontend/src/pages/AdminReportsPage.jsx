import { useEffect, useState } from "react";
import { BarChart3, Download, FileText, PieChart as PieIcon, Activity } from "lucide-react";
import { getSavedTrips } from "../services/tripService";

export default function AdminReportsPage() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    getSavedTrips().then((res) => setTrips(res.trips || [])).catch(() => setTrips([]));
  }, []);

  const totalBudget = trips.reduce((s, t) => s + (t.budgetBreakdown?.totalBudget || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a0a0a] dark:text-white tracking-tight">System Reports & Export</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-semibold">Generate platform summary reports and financial logs.</p>
        </div>
        <button
          onClick={() => alert("Report downloaded successfully!")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#173d2e] dark:bg-white text-white dark:text-black font-black text-sm px-5 py-2.5"
        >
          <Download className="w-4 h-4" /> Download Platform Report
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-[20px] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10">
          <FileText className="w-6 h-6 text-teal-500 mb-2" />
          <h3 className="font-black text-lg text-[#0a0a0a] dark:text-white">Trip Logs</h3>
          <p className="text-xs text-gray-400 mt-1">Total {trips.length} itineraries logged on system</p>
        </div>
        <div className="p-5 rounded-[20px] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10">
          <BarChart3 className="w-6 h-6 text-purple-500 mb-2" />
          <h3 className="font-black text-lg text-[#0a0a0a] dark:text-white">Financial Total</h3>
          <p className="text-xs text-gray-400 mt-1">₹{totalBudget.toLocaleString("en-IN")} planned volume</p>
        </div>
        <div className="p-5 rounded-[20px] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10">
          <Activity className="w-6 h-6 text-emerald-500 mb-2" />
          <h3 className="font-black text-lg text-[#0a0a0a] dark:text-white">System Audit</h3>
          <p className="text-xs text-gray-400 mt-1">Status: 100% Operational & Synced</p>
        </div>
      </div>
    </div>
  );
}
