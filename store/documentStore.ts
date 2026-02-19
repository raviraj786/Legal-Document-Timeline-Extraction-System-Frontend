import { create } from "zustand";
import api from "@/lib/axios";
import { useAuthStore } from "./authStore."; // Fix: Ensure path is correct

interface Document {
  id: string;
  filename: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;

}
interface DocumentState {
  documents: Document[];
  loading: boolean;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  pollStatus: (docId: string) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  loading: false,

  fetchDocuments: async () => {
    const token = useAuthStore.getState().token;

    console.log(token)

    if (!token || token === "null") {
      console.error("No token found, please login again.");
      return;
    }

    try {
      const res = await api.get("/documents/", {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
        },
      });
      console.log("Documents data:", res.data);
      set({ documents: res.data });
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  },

  uploadDocument: async (file) => {
    const token = useAuthStore.getState().token;
    const formData = new FormData();
    formData.append("file", file);

    set({ loading: true });
    try {
      // FIX: Added trailing slash to avoid 307 Redirect
      const res = await api.post("/documents/upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Upload ke turant baad polling shuru karein
      if (res.data.document_id) {
        get().pollStatus(res.data.document_id);
      }
      await get().fetchDocuments();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      set({ loading: false });
    }
  },

  pollStatus: (docId: string) => {
    const interval = setInterval(async () => {
      const token = useAuthStore.getState().token;
      try {
        // FIX: Ensure the polling URL also matches backend expectations
        const res = await api.get(`/documents/${docId}/status/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        set((state) => ({
          documents: state.documents.map((d) =>
            // MongoDB ID field is usually '_id' or 'id' depending on your model
            d.id === docId
              ? { ...d, status: res.data.status, progress: res.data.progress }
              : d,
          ),
        }));

        if (res.data.status === "completed" || res.data.status === "failed") {
          clearInterval(interval);
          get().fetchDocuments();
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval);
      }
    }, 3000);
  },
}));
