"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const NewJobPage: React.FC = () => {
  const router = useRouter();

  // Form state
  const [customerName, setCustomerName] = useState("John Doe");
  const [customerPhone, setCustomerPhone] = useState("555-123-4567");
  const [customerEmail, setCustomerEmail] = useState("john.doe@example.com");
  const [customerAddress, setCustomerAddress] = useState(
    "123 Main St, San Francisco, CA"
  );
  const [lineItems, setLineItems] = useState([
    { description: "Window Cleaning", price: "199" },
  ]);
  const [scheduledDate, setScheduledDate] = useState("2025-02-01T10:00");
  const [dispatchedTo, setDispatchedTo] = useState("Steven Radonich");
  const [jobSource, setJobSource] = useState("Online");
  const [privateNotes, setPrivateNotes] = useState(
    "Initially quoted $199, gave veteran’s discount"
  );

  // Edit mode state
  const [editMode, setEditMode] = useState({
    customer: false,
    lineItems: false,
    scheduled: false,
    dispatchedTo: false,
    jobSource: false,
    privateNotes: false,
  });

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", price: "" }]);
  };

  const removeLineItem = (index: number) => {
    const updatedItems = [...lineItems];
    updatedItems.splice(index, 1);
    setLineItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Job Created!");
    router.push("/"); // Redirect back to the calendar
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Job</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
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
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border p-2 rounded w-full mb-2"
                placeholder="Name"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="border p-2 rounded w-full mb-2"
                placeholder="Phone"
              />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="border p-2 rounded w-full mb-2"
                placeholder="Email"
              />
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Address"
              />
            </>
          ) : (
            <p>
              {customerName} ({customerPhone}) <br /> {customerEmail} <br />{" "}
              {customerAddress}
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
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updatedItems = [...lineItems];
                      updatedItems[index].description = e.target.value;
                      setLineItems(updatedItems);
                    }}
                    className="border p-2 rounded w-full"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const updatedItems = [...lineItems];
                      updatedItems[index].price = e.target.value;
                      setLineItems(updatedItems);
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
            lineItems.map((item, index) => (
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
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{new Date(scheduledDate).toLocaleString()}</p>
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
              value={dispatchedTo}
              onChange={(e) => setDispatchedTo(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{dispatchedTo}</p>
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
              value={jobSource}
              onChange={(e) => setJobSource(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{jobSource}</p>
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
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              className="border p-2 rounded w-full"
            ></textarea>
          ) : (
            <p>{privateNotes}</p>
          )}
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Job
        </button>
      </form>
    </div>
  );
};

export default NewJobPage;
