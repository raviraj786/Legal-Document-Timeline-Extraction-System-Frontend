"use client";

import { useEffect, useState } from "react";
import { useTimelineStore } from "@/store/timelineStore";
import { useAuthStore } from "@/store/authStore."; 
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, User, Info, Download,
  Loader2, FileWarning, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineProps {
  documentId: string | null;
}

export default function TimelineDisplay({ documentId }: TimelineProps) {
  const { events, fetchTimeline, clearTimeline, loading, error } = useTimelineStore();
  const token = useAuthStore((state) => state.token);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchTimeline(documentId);
    }

    // FIX: Document change होने पर पुराना data clear करो
    return () => clearTimeline();
  }, [documentId]);




console.log(documentId)



  // PDF Export
  const handleDownloadPDF = async () => {
    if (!documentId || !token) return;
    setIsExporting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/timeline/${documentId}/export-pdf/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Legal_Timeline_${documentId.slice(-4)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // FIX: Memory leak रोको
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // 1. No document selected
  if (!documentId) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-slate-400 bg-slate-50/50 dark:bg-slate-900/20 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
          <Info className="w-8 h-8 text-indigo-500 opacity-50" />
        </div>
        <p className="font-bold text-slate-600 dark:text-slate-300">No Document Selected</p>
        <p className="text-xs text-slate-400">Choose a file from the list to view extraction</p>
      </div>
    );
  }

  // 2. Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[28px]"
          />
        ))}
      </div>
    );
  }

  // 3. Error State — FIX: Error UI add किया
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <FileWarning className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-slate-600 dark:text-slate-300 font-semibold">Timeline load नहीं हुई</p>
        <p className="text-xs text-slate-400 mt-1">{error}</p>
        <Button
          onClick={() => fetchTimeline(documentId)}
          variant="outline"
          className="mt-4 rounded-xl text-xs"
        >
          Retry करें
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
          <Calendar className="text-indigo-600" size={20} /> Case Chronology
        </h2>
        {events.length > 0 && (
          <Button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            variant="outline"
            className="rounded-xl gap-2 font-bold text-xs"
          >
            {isExporting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Download size={14} />
            )}
            {isExporting ? "GENERATING..." : "EXPORT PDF"}
          </Button>
        )}
      </div>

      <div className="relative space-y-12 pb-10">
        {/* Vertical Line */}
        <div className="absolute left-6 top-2 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />

        <AnimatePresence>
          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <FileWarning className="w-12 h-12 text-amber-400 mb-4" />
              <p className="text-slate-500 font-medium">No events found in this document.</p>
              <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                AI might still be processing or the document is unreadable.
              </p>
            </motion.div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16 group"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center z-10 shadow-sm border-4 border-white dark:border-slate-950 transition-transform group-hover:scale-110 ${getSignificanceBg(event.significance)}`}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </div>

                {/* Event Card */}
                <div
                  className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 dark:hover:shadow-none transition-all border-l-4"
                  style={{ borderLeftColor: getSignificanceColor(event.significance) }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} /> {event.date || "Unknown Date"}
                      </span>
                      {/* FIX: event.title optional chain लगाई */}
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
                        {event.title ?? "Legal Milestone"}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getSignificanceBadge(event.significance)}`}
                    >
                      {event.significance} Importance
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {event.description}
                  </p>

                  {/* Involved Parties */}
                  {event.involved_parties && event.involved_parties.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                      {event.involved_parties.map((party: string, pIdx: number) => (
                        <span
                          key={pIdx}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-100 dark:border-slate-700"
                        >
                          <User size={10} className="text-indigo-500" /> {party}
                        </span>
                      ))}
                    </div>
                  )}

                  <button className="mt-4 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
                    VIEW SOURCE CITATION <ExternalLink size={10} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Style Helpers ---

function getSignificanceColor(level: string) {
  const l = level?.toLowerCase();
  if (l === "high") return "#ef4444";
  if (l === "medium") return "#f59e0b";
  return "#6366f1";
}

function getSignificanceBg(level: string) {
  const l = level?.toLowerCase();
  if (l === "high") return "bg-red-500";
  if (l === "medium") return "bg-amber-500";
  return "bg-indigo-500";
}

function getSignificanceBadge(level: string) {
  const l = level?.toLowerCase();
  if (l === "high")
    return "bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30";
  if (l === "medium")
    return "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30";
  return "bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30";
}