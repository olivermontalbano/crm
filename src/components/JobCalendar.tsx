"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Event {
  id: string;
  title: string;
  date: string; // Ensure this is in ISO format
}

const JobCalendar: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Window Cleaning - John Doe",
      date: "2025-01-30T10:00:00",
    },
    {
      id: "2",
      title: "Gutter Cleaning - Sarah Smith",
      date: "2025-01-30T14:00:00",
    },
  ]);

  useEffect(() => {
    console.log("Loaded events:", events); // Debugging log
  }, [events]);

  const handleDateClick = (info: { dateStr: string }) => {
    const title = prompt("Enter job title:");
    if (title) {
      setEvents([
        ...events,
        {
          id: String(events.length + 1),
          title,
          date: info.dateStr + "T10:00:00",
        }, // Ensure time is set
      ]);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        events={events}
        dateClick={handleDateClick}
        eventClick={(info) => {
          console.log("Event clicked:", info.event.id); // Debugging log
          router.push(`/jobs/${info.event.id}`);
        }}
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        height="100%"
      />

      {/* Floating Plus Button */}
      <button
        onClick={() => router.push("/jobs/new")}
        className="fixed bottom-8 right-8 bg-blue-500 text-white text-3xl rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-50"
        style={{ border: "none", cursor: "pointer" }}
      >
        +
      </button>
    </div>
  );
};

export default JobCalendar;
