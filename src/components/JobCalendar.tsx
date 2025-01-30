"use client"; // Required for client-side components in Next.js 13+

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Event {
  id: string;
  title: string;
  date: string;
}

const JobCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    { id: "1", title: "Window Cleaning - John Doe", date: "2025-02-01" },
    { id: "2", title: "Gutter Cleaning - Sarah Smith", date: "2025-02-03" },
  ]);

  const handleDateClick = (info: { dateStr: string }) => {
    const title = prompt("Enter job title:");
    if (title) {
      setEvents([...events, { id: String(events.length + 1), title, date: info.dateStr }]);
    }
  };

  return (
    <div>
      <h2>Job Scheduler</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={(info) => alert(`Job: ${info.event.title}`)}
      />
    </div>
  );
};

export default JobCalendar;
