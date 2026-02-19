"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import Timeline from "@/components/Timeline";

import { useTimelineStore } from "@/store/timelineStore";

export default function TimelinePage() {
  const params = useParams();

  const { events, fetchTimeline } = useTimelineStore();

  useEffect(() => {
    fetchTimeline(params.id as string);
  }, []);

  return (
    <div className="p-4">
      <Timeline events={events} />
    </div>
  );
}
