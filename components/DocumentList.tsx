"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useDocumentStore } from "@/store/documentStore";
import { FileText, ChevronRight, Loader2 } from "lucide-react";

export default function DocumentList() {
  const { documents, fetchDocuments } = useDocumentStore();

  useEffect(() => { fetchDocuments(); }, []);

  return (
    <div className="space-y-3">
      {documents.map((doc: any) => (
        <div key={doc.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
              <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div>
              <p className="font-bold text-sm dark:text-white">{doc.filename}</p>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  doc.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {doc.status}
                </span>
                {doc.status === 'processing' && <Loader2 size={12} className="animate-spin text-amber-600" />}
              </div>
            </div>
          </div>
          
          <Link href={`/documents/${doc.id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronRight size={20} className="text-slate-400 group-hover:text-indigo-500" />
          </Link>
        </div>
      ))}
    </div>
  );
}