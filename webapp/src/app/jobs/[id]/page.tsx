"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter for navigation

const JobDetailsPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter(); // Initialize the router

  const [editMode, setEditMode] = useState({
    customer: false,
    lineItems: false,
    scheduled: false,
    dispatchedTo: false,
    jobSource: false,
    privateNotes: false,
  });

  const [job, setJob] = useState({
    id,
    customerName: "John Doe",
    customerPhone: "555-123-4567",
    customerEmail: "john.doe@example.com",
    customerAddress: "123 Main St, San Francisco, CA",
    lineItems: [{ description: "Window Cleaning", price: "199" }],
    scheduledStart: "2025-02-01T10:00",
    scheduledEnd: "2025-02-01T12:00", // Added end time
    dispatchedTo: "Steven Radonich",
    jobSource: "Online",
    privateNotes: "Initially quoted $199, gave veteran’s discount",
    drivingStatus: "Drive",
    jobStatus: "Start",
    reviewStatus: "Send",
    paymentStatus: "Unpaid",
    paymentType: "",
  });

  const cycleStatus = (field: keyof typeof job, options: string[]) => {
    setJob((prev) => {
      const currentIndex = options.indexOf(prev[field]);
      if (currentIndex + 1 < options.length) {
        return { ...prev, [field]: options[currentIndex + 1] };
      }
      return prev;
    });
  };

  const isDisabled = (field: keyof typeof job, options: string[]) =>
    job[field] === options[options.length - 1];

  const addLineItem = () => {
    setJob({
      ...job,
      lineItems: [...job.lineItems, { description: "", price: "" }],
    });
  };

  const removeLineItem = (index: number) => {
    const updatedItems = [...job.lineItems];
    updatedItems.splice(index, 1);
    setJob({ ...job, lineItems: updatedItems });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Back Button and Heading */}
      <div className="flex items-center justify-between w-full max-w-5xl mb-4">
        <button
          onClick={() => router.back()} // Navigate back
          className="bg-gray-300 p-2 rounded hover:bg-gray-400"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Job Details</h1>
        <div className="w-12"></div> {/* Spacer to balance the layout */}
      </div>

      {/* ✅ Updated Layout to be Horizontally Aligned */}
      <div className="flex flex-row flex-wrap gap-4 w-full max-w-5xl">
        {/* Customer */}
        <div className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Customer</h2>
            <button
              type="button"
              onClick={() =>
                setEditMode({ ...editMode, customer: !editMode.customer })
              }
            >
              ✏️
            </button>
          </div>
          {editMode.customer ? (
            <>
              <input
                type="text"
                value={job.customerName}
                onChange={(e) =>
                  setJob({ ...job, customerName: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
                placeholder="Name"
              />
              <input
                type="tel"
                value={job.customerPhone}
                onChange={(e) =>
                  setJob({ ...job, customerPhone: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
                placeholder="Phone"
              />
              <input
                type="email"
                value={job.customerEmail}
                onChange={(e) =>
                  setJob({ ...job, customerEmail: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
                placeholder="Email"
              />
              <input
                type="text"
                value={job.customerAddress}
                onChange={(e) =>
                  setJob({ ...job, customerAddress: e.target.value })
                }
                className="border p-2 rounded w-full"
                placeholder="Address"
              />
            </>
          ) : (
            <p>
              {job.customerName} ({job.customerPhone}) <br />{" "}
              {job.customerEmail} <br /> {job.customerAddress}
            </p>
          )}
        </div>

        {/* Line Items */}
        <div className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Line Items</h2>
            <button
              type="button"
              onClick={() =>
                setEditMode({ ...editMode, lineItems: !editMode.lineItems })
              }
            >
              ✏️
            </button>
          </div>
          {editMode.lineItems ? (
            <>
              {job.lineItems.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updatedItems = [...job.lineItems];
                      updatedItems[index].description = e.target.value;
                      setJob({ ...job, lineItems: updatedItems });
                    }}
                    className="border p-2 rounded w-full"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const updatedItems = [...job.lineItems];
                      updatedItems[index].price = e.target.value;
                      setJob({ ...job, lineItems: updatedItems });
                    }}
                    className="border p-2 rounded w-24"
                    placeholder="Price"
                  />
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="text-red-500"
                  >
                    🗑
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLineItem}
                className="bg-gray-300 p-2 rounded w-full"
              >
                + Add Line Item
              </button>
            </>
          ) : (
            job.lineItems.map((item, index) => (
              <p key={index}>
                {item.description} - ${item.price}
              </p>
            ))
          )}
        </div>

        {/* Scheduled */}
        <div className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Scheduled</h2>
            <button
              type="button"
              onClick={() =>
                setEditMode({ ...editMode, scheduled: !editMode.scheduled })
              }
            >
              ✏️
            </button>
          </div>
          {editMode.scheduled ? (
            <>
              <label className="block text-sm font-medium text-gray-600">Start Time</label>
              <input
                type="datetime-local"
                value={job.scheduledStart}
                onChange={(e) =>
                  setJob({ ...job, scheduledStart: e.target.value })
                }
                className="border p-2 rounded w-full mb-2"
              />

              <label className="block text-sm font-medium text-gray-600">End Time</label>
              <input
                type="datetime-local"
                value={job.scheduledEnd}
                onChange={(e) =>
                  setJob({ ...job, scheduledEnd: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
            </>
          ) : (
            <p>
              {new Date(job.scheduledStart).toLocaleString()} - {new Date(job.scheduledEnd).toLocaleString()}
            </p>
          )}
        </div>


        {/* Dispatched To */}
        <div className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Dispatched To</h2>
            <button
              type="button"
              onClick={() =>
                setEditMode({
                  ...editMode,
                  dispatchedTo: !editMode.dispatchedTo,
                })
              }
            >
              ✏️
            </button>
          </div>
          {editMode.dispatchedTo ? (
            <input
              type="text"
              value={job.dispatchedTo}
              onChange={(e) => setJob({ ...job, dispatchedTo: e.target.value })}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{job.dispatchedTo}</p>
          )}
        </div>

        {/* Job Source */}
        <div className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Job Source</h2>
            <button
              type="button"
              onClick={() =>
                setEditMode({ ...editMode, jobSource: !editMode.jobSource })
              }
            >
              ✏️
            </button>
          </div>
          {editMode.jobSource ? (
            <input
              type="text"
              value={job.jobSource}
              onChange={(e) => setJob({ ...job, jobSource: e.target.value })}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{job.jobSource}</p>
          )}
        </div>

        {/* Private Notes */}
        <div className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Private Notes</h2>
            <button
              type="button"
              onClick={() =>
                setEditMode({
                  ...editMode,
                  privateNotes: !editMode.privateNotes,
                })
              }
            >
              ✏️
            </button>
          </div>
          {editMode.privateNotes ? (
            <textarea
              value={job.privateNotes}
              onChange={(e) => setJob({ ...job, privateNotes: e.target.value })}
              className="border p-2 rounded w-full"
            ></textarea>
          ) : (
            <p>{job.privateNotes}</p>
          )}
        </div>

        {/* Driving Status */}
        <div className="border p-4 rounded-lg shadow-sm w-full md:w-1/2 lg:w-1/3 flex flex-col items-center">
          <h2 className="font-semibold">Driving Status</h2>
          <button
            className={`p-2 rounded ${
              isDisabled("drivingStatus", ["Drive", "In Progress", "Arrived"])
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
            onClick={() =>
              cycleStatus("drivingStatus", ["Drive", "In Progress", "Arrived"])
            }
            disabled={isDisabled("drivingStatus", [
              "Drive",
              "In Progress",
              "Arrived",
            ])}
          >
            {job.drivingStatus}
          </button>
        </div>

        {/* Job Status */}
        <div className="border p-4 rounded-lg shadow-sm w-full md:w-1/2 lg:w-1/3 flex flex-col items-center">
          <h2 className="font-semibold">Job Status</h2>
          <button
            className={`p-2 rounded ${
              isDisabled("jobStatus", ["Start", "In Progress", "Finished"])
                ? "bg-gray-300"
                : "bg-green-500 text-white"
            }`}
            onClick={() =>
              cycleStatus("jobStatus", ["Start", "In Progress", "Finished"])
            }
            disabled={isDisabled("jobStatus", [
              "Start",
              "In Progress",
              "Finished",
            ])}
          >
            {job.jobStatus}
          </button>
        </div>

        {/* Review Link */}
        <div className="border p-4 rounded-lg shadow-sm w-full md:w-1/2 lg:w-1/3 flex flex-col items-center">
          <h2 className="font-semibold">Review Link</h2>
          <button
            className={`p-2 rounded ${
              isDisabled("reviewStatus", ["Send", "Sent"])
                ? "bg-gray-300"
                : "bg-yellow-500 text-white"
            }`}
            onClick={() => cycleStatus("reviewStatus", ["Send", "Sent"])}
            disabled={isDisabled("reviewStatus", ["Send", "Sent"])}
          >
            {job.reviewStatus}
          </button>
        </div>

        {/* Payment Status */}
        <div className="border p-4 rounded-lg shadow-sm w-full md:w-1/2 lg:w-1/3 flex flex-col items-center">
          <h2 className="font-semibold">Payment Status</h2>
          <button
            className={`p-2 rounded ${
              isDisabled("paymentStatus", ["Unpaid", "Paid"])
                ? "bg-gray-300"
                : "bg-red-500 text-white"
            }`}
            onClick={() => cycleStatus("paymentStatus", ["Unpaid", "Paid"])}
            disabled={isDisabled("paymentStatus", ["Unpaid", "Paid"])}
          >
            {job.paymentStatus}
          </button>

          {job.paymentStatus === "Paid" && (
            <select
              value={job.paymentType}
              onChange={(e) => setJob({ ...job, paymentType: e.target.value })}
              className="border p-2 rounded w-full mt-2"
            >
              <option value="">Select Payment Type</option>
              <option value="Card">Card</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="Zelle">Zelle</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
