import { useEffect, useState } from "react";
import { Users, Search, Shield, RefreshCw, CheckCircle2, Ban, Trash2, ShieldAlert, UserCheck } from "lucide-react";
import { getSavedTrips } from "../services/tripService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getSavedTrips();
        const trips = res.trips || [];
        
        // Extract unique users from trips + add fixed admin
        const map = {};
        map["admin@tripforge.com"] = { name: "TripForge Admin", email: "admin@tripforge.com", role: "Admin", status: "Active", tripsCount: 0 };

        trips.forEach((t) => {
          const email = t.ownerEmail || "user@tripforge.com";
          if (!map[email]) {
            map[email] = { name: t.ownerName || "Registered Traveller", email, role: "User", status: "Active", tripsCount: 0 };
          }
          map[email].tripsCount += 1;
        });

        setUsers(Object.values(map));
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggleRole(email) {
    if (email === "admin@tripforge.com") return;
    setUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, role: u.role === "Admin" ? "User" : "Admin" } : u))
    );
  }

  function toggleStatus(email) {
    if (email === "admin@tripforge.com") return;
    setUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u))
    );
  }

  function removeUser(email) {
    if (email === "admin@tripforge.com") return;
    setUsers((prev) => prev.filter((u) => u.email !== email));
  }

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a0a0a] dark:text-white tracking-tight">User Management Control</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-semibold">Monitor, manage roles, and control access permissions for all platform users.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-sm font-medium text-[#0a0a0a] dark:text-white outline-none focus:border-teal-500 transition"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[20px] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-sm font-bold text-gray-400">Loading user registry...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-left bg-gray-50 dark:bg-[#1a1a1a]">
                <th className="px-5 py-3.5 text-xs font-black uppercase text-gray-400">User Details</th>
                <th className="px-5 py-3.5 text-xs font-black uppercase text-gray-400">Current Role</th>
                <th className="px-5 py-3.5 text-xs font-black uppercase text-gray-400">Trips Created</th>
                <th className="px-5 py-3.5 text-xs font-black uppercase text-gray-400">Access Status</th>
                <th className="px-5 py-3.5 text-xs font-black uppercase text-gray-400 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.email} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition">
                  <td className="px-5 py-4 font-bold text-[#0a0a0a] dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-black text-sm shadow-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold">{u.name}</div>
                        <div className="text-xs font-medium text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleRole(u.email)}
                      disabled={u.email === "admin@tripforge.com"}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                        u.role === "Admin"
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                          : "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-200 dark:border-teal-800 hover:bg-teal-100"
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {u.role}
                    </button>
                  </td>
                  <td className="px-5 py-4 font-black text-[#0a0a0a] dark:text-white">{u.tripsCount} Journey(s)</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${
                      u.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                    }`}>
                      {u.status === "Active" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {u.email !== "admin@tripforge.com" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(u.email)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                            u.status === "Active"
                              ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900"
                          }`}
                          title={u.status === "Active" ? "Suspend User" : "Activate User"}
                        >
                          {u.status === "Active" ? <Ban className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          <span>{u.status === "Active" ? "Suspend" : "Activate"}</span>
                        </button>
                        <button
                          onClick={() => removeUser(u.email)}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900 transition"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 italic">Primary Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
