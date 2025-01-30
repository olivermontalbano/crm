"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface JobEvent {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  lineItems: { description: string; price: string }[];
  scheduledStart: string; // ISO string format (e.g., "2025-01-30T10:00")
  scheduledEnd: string; // ISO string format (e.g., "2025-01-30T12:00")
  dispatchedTo: string;
  jobSource: string;
  privateNotes: string;
  drivingStatus: "Drive" | "In Progress" | "Arrived";
  jobStatus: "Start" | "In Progress" | "Finished";
  reviewStatus: "Send" | "Sent";
  paymentStatus: "Unpaid" | "Paid";
  paymentType: "" | "Card" | "Check" | "Cash" | "Zelle";
}

const JobCalendar: React.FC = () => {
  const router = useRouter();
  const [jobEvents, setJobEvents] = useState<JobEvent[]>([
    {
      id: "1",
      customerName: "John Doe",
      customerPhone: "555-123-4567",
      customerEmail: "john.doe@example.com",
      customerAddress: "123 Main St, San Francisco, CA",
      lineItems: [
        { description: "Window Cleaning", price: "199" },
        { description: "Gutter Cleaning", price: "99" },
        { description: "Solar Cleaning", price: "99" },
      ],
      scheduledStart: "2025-01-30T10:00",
      scheduledEnd: "2025-01-30T12:00",
      dispatchedTo: "Steven Radonich",
      jobSource: "Online",
      privateNotes: "Initially quoted $199, gave veteran’s discount",
      drivingStatus: "Drive",
      jobStatus: "Start",
      reviewStatus: "Send",
      paymentStatus: "Unpaid",
      paymentType: "",
    },
    {
      id: "2",
      customerName: "Sarah Smith",
      customerPhone: "555-987-6543",
      customerEmail: "sarah.smith@example.com",
      customerAddress: "456 Oak St, San Francisco, CA",
      lineItems: [{ description: "Gutter Cleaning", price: "299" }],
      scheduledStart: "2025-01-30T14:00",
      scheduledEnd: "2025-01-30T16:00",
      dispatchedTo: "Michael Chen",
      jobSource: "Referral",
      privateNotes: "Roof access required, bring safety harness",
      drivingStatus: "In Progress",
      jobStatus: "In Progress",
      reviewStatus: "Sent",
      paymentStatus: "Paid",
      paymentType: "Card",
    },
  ]);

  const [view, setView] = useState("timeGridDay");
  const calendarRef = React.useRef<FullCalendar>(null);

  const calculateTotalPrice = (
    lineItems: { description: string; price: string }[]
  ): number => {
    return lineItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  const formatLineItemTitles = (
    lineItems: { description: string; price: string }[]
  ): string => {
    if (lineItems.length === 0) return "No line items";
    return lineItems.map((item) => item.description).join(", ");
  };

  // Convert job events to FullCalendar's required format
  const calendarEvents = jobEvents.map((event) => ({
    id: event.id,
    title: `${event.customerName} - $${calculateTotalPrice(
      event.lineItems
    )} - ${formatLineItemTitles(event.lineItems)}`,
    start: event.scheduledStart,
    end: event.scheduledEnd,
  }));

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
        events={calendarEvents} // Use updated event structure
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
