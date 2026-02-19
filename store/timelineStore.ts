import { create } from "zustand";
import api from "@/lib/axios";
import { useAuthStore } from "./authStore.";
import { ClockFading } from "lucide-react";

interface Event {
  id: string;
  date: string;
  description: string;
  involved_parties: string[];
  significance: string;
}

interface TimelineState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchTimeline: (documentId: string) => Promise<void>;
  clearTimeline: () => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchTimeline: async (documentId) => {
    const token = useAuthStore.getState().token;

    console.log(token , "Dddddddddddddddddddddddddddd")

    if (!token) {
      set({ error: "Token नहीं मिला, please login करें", loading: false });
      return;
    }

    if (!documentId) {
      set({ error: "Document ID missing है", loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const res = await api.get(`/timeline/${documentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res?.data , "sssssssssssssssssssssssssssssssssssssssssssssssss")
      
      set({
        events: Array.isArray(res.data) ? res.data : [],
        loading: false,
      });
    } catch (err: any) {
      console.error("Timeline fetch failed:", err);
      set({
        error:
          err.response?.data?.detail || err.message || "Timeline load नहीं हुई",
        loading: false,
        events: [],
      });
    }
  },

  // Document change होने पर पुराना data clear करो
  clearTimeline: () => {
    set({ events: [], error: null, loading: false });
  },
}));
