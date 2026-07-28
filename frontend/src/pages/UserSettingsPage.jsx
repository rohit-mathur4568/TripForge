import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { User, Key, CheckCircle2, Camera, Sun, Moon } from "lucide-react";

export default function UserSettingsPage() {
  const { user, updateUser } = useAuth();
  const { manualTheme, setManualTheme } = useTheme();
  const [savedToast, setSavedToast] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");

  // Password reset fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Avatar profile image state
  const [avatar, setAvatar] = useState(
    user?.avatar ||
    localStorage.getItem("tripforge_user_avatar") ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  );

  function handleSaveProfile(e) {
    e.preventDefault();
    if (updateUser) {
      updateUser({ name, avatar });
    }
    setSavedToast("Profile updated successfully!");
    setTimeout(() => setSavedToast(""), 3000);
  }

  function handlePasswordReset(e) {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    setSavedToast("Password reset successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSavedToast(""), 3000);
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgUrl = reader.result;
        setAvatar(imgUrl);
        localStorage.setItem("tripforge_user_avatar", imgUrl);
        if (updateUser) {
          updateUser({ avatar: imgUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Account & Preference Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-semibold">
          Manage your profile details, dark/light theme, password reset, and workspace settings.
        </p>
      </div>

      {savedToast && (
        <div className="flex items-center gap-2 p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 rounded-2xl text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {savedToast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card with Avatar Upload */}
        <div className="bg-white dark:bg-[#121417] border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 space-y-6 flex flex-col items-center text-center shadow-sm">
          <div className="relative group">
            <img src={avatar} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-teal-500/20 shadow-md" />
            <label className="absolute bottom-0 right-0 bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="font-black text-xl text-slate-900 dark:text-white">{name || "Traveller"}</h2>
            <p className="text-xs text-slate-400 font-medium">{email}</p>
          </div>
          <div className="w-full pt-4 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs font-bold text-slate-500">
            <div className="flex justify-between py-1"><span>Role</span><span className="text-teal-600 dark:text-teal-400 uppercase font-black">{user?.isAdmin ? "Admin" : "Standard"}</span></div>
            <div className="flex justify-between py-1"><span>Status</span><span className="text-emerald-500 font-black">Active Sync</span></div>
          </div>
        </div>

        {/* Settings Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance Theme Selector Card */}
          <div className="bg-white dark:bg-[#121417] border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" /> Interface Theme & Display
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select your default dashboard theme preference. Changes synchronize instantly with the top bar.</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setManualTheme("light")}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                  manualTheme === "light"
                    ? "border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-black shadow-sm"
                    : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-bold"
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setManualTheme("dark")}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                  manualTheme === "dark"
                    ? "border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-black shadow-sm"
                    : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-bold"
                }`}
              >
                <Moon className="w-5 h-5 text-teal-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white dark:bg-[#121417] border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-sm">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-teal-500" /> Personal Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d21] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                  <input type="email" disabled value={email} className="mt-1 w-full p-3 rounded-2xl bg-slate-100 dark:bg-[#1a1d21]/50 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-400 cursor-not-allowed" />
                </div>
              </div>
              <button type="submit" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm">
                Update Profile Details
              </button>
            </form>
          </div>

          {/* Password Reset Form */}
          <div className="bg-white dark:bg-[#121417] border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-sm">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-500" /> Password Reset
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d21] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d21] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d21] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
              </div>
              <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-bold text-xs rounded-2xl hover:bg-purple-700 transition shadow-sm">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

