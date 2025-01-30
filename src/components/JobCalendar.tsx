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
  scheduledStart: string;
  scheduledEnd: string;
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
  const [view, setView] = useState("timeGridDay");
  const calendarRef = React.useRef<FullCalendar>(null);

  console.log("Session storage: ", sessionStorage.getItem("calendarDate"));

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

  const calculateTotalPrice = (
    lineItems: { description: string; price: string }[]
  ) => lineItems.reduce((total, item) => total + parseFloat(item.price), 0);

  const formatLineItemTitles = (
    lineItems: { description: string; price: string }[]
  ) => lineItems.map((item) => item.description).join(", ") || "No line items";

  const calendarEvents = jobEvents.map((event) => ({
    id: event.id,
    title: `${event.customerName} - $${calculateTotalPrice(
      event.lineItems
    )} - ${formatLineItemTitles(event.lineItems)}`,
    start: event.scheduledStart,
    end: event.scheduledEnd,
  }));

  // Track whether we have restored the date from sessionStorage
  const [hasRestoredDate, setHasRestoredDate] = useState(false);

  // Load stored date on component mount
  useEffect(() => {
    const storedDate = sessionStorage.getItem("calendarDate");
    if (calendarRef.current && storedDate) {
      console.log("📅 Restoring stored date:", storedDate);
      calendarRef.current.getApi().gotoDate(storedDate);
      setHasRestoredDate(true); // Prevent first `handleDatesSet` from overwriting
    }
  }, []);

  useEffect(() => {
    const logStorageChange = (event: StorageEvent) => {
      console.log("📢 sessionStorage changed:", event);
    };

    window.addEventListener("storage", logStorageChange);
    return () => window.removeEventListener("storage", logStorageChange);
  }, []);

  const handleDatesSet = (arg: { view: { currentStart: Date } }) => {
    const newDate = arg.view.currentStart.toISOString();

    // Only update sessionStorage **if we already restored the stored date**
    if (hasRestoredDate) {
      console.log("📆 Calendar date changed to:", newDate);
      sessionStorage.setItem("calendarDate", newDate);
    }
  };

  const changeView = (newView: string) => {
    setView(newView);
    calendarRef.current?.getApi().changeView(newView);
  };

  return (
    <div className="relative w-screen h-screen p-4 flex flex-col">
      {/* View Toggle Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => changeView("timeGridDay")}
          className={`px-4 py-2 rounded ${
            view === "timeGridDay" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => changeView("timeGridThreeDay")}
          className={`px-4 py-2 rounded ${
            view === "timeGridThreeDay"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
        >
          3 Days
        </button>
        <button
          onClick={() => changeView("timeGridWeek")}
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
        initialView={view}
        datesSet={handleDatesSet}
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
        events={calendarEvents}
        eventClick={(info) => {
          sessionStorage.setItem("calendarDate", info.event.startStr); // Store date before navigating
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
