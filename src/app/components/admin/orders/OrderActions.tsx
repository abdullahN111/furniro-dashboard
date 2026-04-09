"use client";

import { useState } from "react";

export default function OrderActions({ orderId, status }: { orderId: string; status: string }) {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleProcess = async () => {
    const res = await fetch(`/api/orders/${orderId}/process`, {
      method: "POST",
    });
    const updated = await res.json();
    setCurrentStatus(updated.status);
  };

  const handleDispatch = async () => {
    const res = await fetch(`/api/orders/${orderId}/dispatch`, {
      method: "POST",
    });
    const updated = await res.json();
    setCurrentStatus(updated.status);
  };

  return (
    <button
      onClick={() => {
        if (currentStatus === "Pending") handleProcess();
        else if (currentStatus === "Processing") handleDispatch();
      }}
      className={`text-white px-5 py-2 rounded-md ${
        currentStatus === "Dispatched"
          ? "bg-red-600 opacity-40 cursor-not-allowed"
          : "bg-red-700 hover:bg-red-800"
      }`}
      disabled={currentStatus === "Dispatched"}
    >
      {currentStatus === "Pending"
        ? "Process Order"
        : currentStatus === "Processing"
        ? "Dispatch Order"
        : "Dispatched"}
    </button>
  );
}