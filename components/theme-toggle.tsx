"use client";

import { useAuthStore } from "@/store/authStore.";
import { LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
      
      {/* Theme Toggle Button - Hamesha dikhega */}
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        {mounted && resolvedTheme === "dark" ? (
          <Sun size={18} className="text-amber-500" />
        ) : (
          <Moon size={18} className="text-indigo-400" />
        )}
      </button>

      {/* Agar user logged in hai, tabhi ye portion dikhega */}
      {user && (
        <>
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold dark:text-white truncate max-w-[120px]">
                {user?.email}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Legal Pro</p>
            </div>
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
              {user?.email?.[0].toUpperCase()}
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Logout Button */}
          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
          >
            <LogOut size={18} />
          </button>
        </>
      )}
    </div>
  );
}