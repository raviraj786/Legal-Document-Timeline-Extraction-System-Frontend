"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore."; // FIX: Trailing dot हटाया
import { useDocumentStore } from "@/store/documentStore";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Gavel,
  Plus,
  Clock,
  ShieldCheck,
  Search,
  ChevronRight,
  Bell,
} from "lucide-react";

import TimelineDisplay from "@/components/Timeline";
import UploadBox from "@/components/Upload";
import ThemeToggle from "@/components/theme-toggle";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const token = useAuthStore((s) => s.token);
  const { fetchDocuments, documents } = useDocumentStore();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated && token) {
      fetchDocuments();
    }
  }, [hasHydrated, token]);

  const stats = {
    total: documents.length,
    processed: documents.filter((d) => d.status === "completed").length,
    pending: documents.filter(
      (d) => d.status === "processing" || d.status === "pending",
    ).length,
  };

  console.log("selectedDocId:", selectedDocId);
  console.log("documents:", documents);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 px-2 mb-10 group cursor-pointer">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:rotate-12">
            <Gavel className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter">
            LegalAI{" "}
            <span className="text-indigo-600 text-[10px] align-top">PRO</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1.5">
          <SidebarItem
            active
            icon={<LayoutDashboard size={20} />}
            label="Cases & Files"
          />
          <SidebarItem icon={<Clock size={20} />} label="Recent Activity" />
          <SidebarItem icon={<Settings size={20} />} label="App Settings" />
        </nav>

        {/* User Profile Card */}
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
                {/* FIX: Optional chaining safely handle करो */}
                {user?.email?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black truncate">
                  {user?.email?.split("@")[0] ?? "User"}
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Senior Advocate
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                ACTIVE
              </span>
              <ShieldCheck size={14} className="text-indigo-500" />
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all group"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN PANEL --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search legal documents..."
                className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 rounded-xl py-2 pl-10 pr-4 text-xs font-medium outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />
            <ThemeToggle />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 custom-scrollbar">
          {/* Section 1: Hero & Upload */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
            <div className="xl:col-span-8 space-y-6">
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                  Workspace
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Extract events and build chronological timelines
                  automatically.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 font-black uppercase text-[10px] tracking-widest">
                  <Plus size={14} className="stroke-[3px]" /> Process New
                  Document
                </div>
                <UploadBox />
              </div>
            </div>

            {/* Stats Panel */}
            <div className="xl:col-span-4 flex flex-col gap-4">
              <StatTile
                label="Total Files"
                value={stats.total}
                icon={<FileText size={18} />}
              />
              <StatTile
                label="Processed"
                value={stats.processed}
                icon={<ShieldCheck size={18} />}
                color="text-green-500"
              />
              <StatTile
                label="Pending"
                value={stats.pending}
                icon={<Clock size={18} />}
                color="text-amber-500"
              />
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section 2: Document List + Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Document List */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black tracking-tight">
                  Case Files
                </h2>
                <span className="text-[10px] font-bold text-slate-400">
                  {documents.length} Items
                </span>
              </div>

              <div className="space-y-3">
                {/* FIX: Hydration होने तक loading दिखाओ */}
                {!hasHydrated ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"
                      />
                    ))}
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-400 font-bold">
                      No documents found.
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        console.log("Clicked doc:", doc.id);
                        setSelectedDocId(doc.id);
                      }}
                      className={`cursor-pointer group p-4 rounded-2xl border transition-all ${
                        selectedDocId === doc.id
                          ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText
                            size={18}
                            className={
                              selectedDocId === doc.id
                                ? "text-white"
                                : "text-slate-400"
                            }
                          />
                          <p
                            className={`text-sm font-bold truncate ${
                              selectedDocId === doc.id
                                ? "text-white"
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {doc.filename}
                          </p>
                        </div>
                        {/* FIX: Status badge add किया */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              doc.status === "completed"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                : doc.status === "failed"
                                  ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                  : "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                            }`}
                          >
                            {doc.status.toUpperCase()}
                          </span>
                          <ChevronRight
                            size={16}
                            className={
                              selectedDocId === doc.id
                                ? "text-white"
                                : "text-slate-300"
                            }
                          />
                        </div>
                      </div>

                      {/* FIX: Processing progress bar */}
                      {(doc.status === "processing" ||
                        doc.status === "pending") && (
                        <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${doc.progress ?? 0}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Timeline */}
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[40px] border border-slate-100 dark:border-slate-800 min-h-[600px] shadow-sm">
                <TimelineDisplay documentId={selectedDocId} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components ---

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-black transition-all ${
        active
          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatTile({
  label,
  value,
  icon,
  color = "text-indigo-600",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
          {label}
        </p>
        <h4 className={`text-2xl font-black ${color}`}>{value}</h4>
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400">
        {icon}
      </div>
    </div>
  );
}
