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
  date: string;
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

  const [view, setView] = useState("timeGridDay");
  const calendarRef = React.useRef<FullCalendar>(null);

  // Load stored date on component mount
  useEffect(() => {
    const storedDate = sessionStorage.getItem("calendarDate");
    if (calendarRef.current && storedDate) {
      calendarRef.current.getApi().gotoDate(storedDate);
    }
  }, []);

  // Save current date when view changes
  const handleDatesSet = (arg: { view: { currentStart: Date } }) => {
    const currentDate = arg.view.currentStart;
    sessionStorage.setItem("calendarDate", currentDate.toISOString());
  };

  const handleDateClick = (info: { dateStr: string }) => {
    const title = prompt("Enter job title:");
    if (title) {
      setEvents([
        ...events,
        {
          id: String(events.length + 1),
          title,
          date: info.dateStr + "T10:00:00",
        },
      ]);
    }
  };

  return (
    <div className="relative w-screen h-screen p-4 flex flex-col">
      {/* View Toggle Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setView("timeGridDay")}
          className={`px-4 py-2 rounded ${
            view === "timeGridDay" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setView("timeGridThreeDay")}
          className={`px-4 py-2 rounded ${
            view === "timeGridThreeDay"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
        >
          3 Days
        </button>
        <button
          onClick={() => setView("timeGridWeek")}
          className={`px-4 py-2 rounded ${
            view === "timeGridWeek" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Week
        </button>
      </div>

      {/* Calendar Component */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        datesSet={handleDatesSet}
        customButtons={{
          dayView: { text: "Day", click: () => setView("timeGridDay") },
          threeDayView: {
            text: "3 Days",
            click: () => setView("timeGridThreeDay"),
          },
          weekView: { text: "Week", click: () => setView("timeGridWeek") },
        }}
        views={{
          timeGridThreeDay: {
            type: "timeGrid",
            duration: { days: 3 },
            buttonText: "3 Days",
          },
          timeGridWeek: {
            type: "timeGrid",
            duration: { days: 7 },
            buttonText: "Week",
          },
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={(info) => {
          sessionStorage.setItem("calendarDate", info.event.startStr);
          router.push(`/jobs/${info.event.id}`);
        }}
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        height="100%"
      />

      {/* Floating Plus Button */}
      <button
        onClick={() => {
          const currentDate = calendarRef.current?.getApi().getDate();
          if (currentDate) {
            sessionStorage.setItem("calendarDate", currentDate.toISOString());
          }
          router.push("/jobs/new");
        }}
        className="fixed bottom-8 right-8 bg-blue-500 text-white text-3xl rounded-full w-16 h-16 flex items-center justify-center shadow-lg z-50"
        style={{ border: "none", cursor: "pointer" }}
      >
        +
      </button>
    </div>
  );
};

export default JobCalendar;
