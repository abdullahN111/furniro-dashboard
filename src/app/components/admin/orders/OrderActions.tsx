"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OrderActions({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleProcess = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/process`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to process order");

      const updated = await res.json();
      setCurrentStatus(updated.status);
      toast.success("Order processed successfully.");
      router.refresh();
    } catch (error) {
      console.error("Failed to process order:", error);
      toast.error("Failed to process order.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/dispatch`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to dispatch order");

      const updated = await res.json();
      setCurrentStatus(updated.status);
      toast.success("Order dispatched successfully.");
      router.refresh();
    } catch (error) {
      console.error("Failed to dispatch order:", error);
      toast.error("Failed to dispatch order.");
    } finally {
      setIsLoading(false);
    }
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
      disabled={
        isLoading ||
        currentStatus === "Dispatched" ||
        currentStatus === "Shipped" ||
        currentStatus === "Delivered"
      }
      className={`text-white px-2 py-1 rounded-md text-xs sm:text-sm disabled:cursor-not-allowed ${
        currentStatus === "Pending"
          ? "bg-yellow-600 hover:bg-yellow-700"
          : currentStatus === "Processing"
            ? "bg-blue-600 hover:bg-blue-700"
            : currentStatus === "Dispatched"
              ? "bg-purple-600 opacity-50"
              : currentStatus === "Shipped"
                ? "bg-indigo-600 opacity-50"
                : currentStatus === "Delivered"
                  ? "bg-orange-600 opacity-50"
                  : "bg-gray-600"
      }`}
    >
      {isLoading
        ? "Processing..."
        : currentStatus === "Pending"
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
