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
    if (currentStatus === "Pending") {
      handleProcess();
    } else if (currentStatus === "Processing") {
      handleDispatch();
    }
  }}
  className={`text-white px-2 py-1 rounded-md text-xs sm:text-sm ${
    currentStatus === "Pending"
      ? "bg-yellow-600 hover:bg-yellow-700"
      : currentStatus === "Processing"
      ? "bg-blue-600 hover:bg-blue-700"
      : currentStatus === "Dispatched"
      ? "bg-purple-600 opacity-50 cursor-not-allowed"
      : currentStatus === "Shipped"
      ? "bg-indigo-600 opacity-50 cursor-not-allowed"
      : currentStatus === "Delivered"
      ? "bg-green-600 opacity-50 cursor-not-allowed"
      : "bg-gray-600"
  }`}
  disabled={
    currentStatus === "Dispatched" ||
    currentStatus === "Shipped" ||
    currentStatus === "Delivered"
  }
>
  {currentStatus === "Pending"
    ? "Process"
    : currentStatus === "Processing"
    ? "Dispatch"
    : currentStatus === "Dispatched"
    ? "Dispatched"
    : currentStatus === "Shipped"
    ? "Shipped"
    : currentStatus === "Delivered"
    ? "Delivered"
    : "N/A"}
</button>

  );
}