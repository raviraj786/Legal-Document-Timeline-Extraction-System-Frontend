export default function EventCard({ event }: any) {
  const sigColor = event.significance === "High" ? "border-red-500" : "border-indigo-500";

  return (
    <div className={`border-l-4 ${sigColor} bg-white dark:bg-slate-900 p-6 rounded-r-2xl shadow-sm mb-4 border-y border-r border-slate-100 dark:border-slate-800`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
          {event.date}
        </span>
        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded uppercase">
          {event.significance} Significance
        </span>
      </div>
      
      <p className="text-slate-800 dark:text-slate-200 font-medium mb-3">
        {event.description}
      </p>

      <div className="flex items-center gap-2 pt-3 border-t border-slate-50 dark:border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parties:</span>
        <span className="text-xs text-slate-600 dark:text-slate-400">{event.involved_parties?.join(", ") || "N/A"}</span>
      </div>
    </div>
  );
}