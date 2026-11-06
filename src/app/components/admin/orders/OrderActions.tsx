"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DispatchConfirmation } from "./DispatchConfirmation";

export default function OrderActions({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDispatch, setConfirmDispatch] = useState(false);
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
      toast.success("Order moved to Processing.");
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
      setConfirmDispatch(false);
    }
  };

  const isCompletedState =
    currentStatus === "Dispatched" ||
    currentStatus === "Shipped" ||
    currentStatus === "Delivered";

  return (
    <>
      {confirmDispatch && (
        <DispatchConfirmation
          orderId={orderId}
          onConfirm={handleDispatch}
          onCancel={() => setConfirmDispatch(false)}
        />
      )}
      <button
        onClick={() => {
          if (currentStatus === "Pending") {
            handleProcess();
          } else if (currentStatus === "Processing") {
            setConfirmDispatch(true);
          }
        }}
        disabled={isLoading || isCompletedState}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:cursor-not-allowed ${
          currentStatus === "Pending"
            ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30"
            : currentStatus === "Processing"
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
              : currentStatus === "Dispatched"
                ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 opacity-75"
                : currentStatus === "Shipped"
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/30 opacity-75"
                  : currentStatus === "Delivered"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 opacity-75"
                    : "bg-slate-800 text-slate-300"
        }`}
      >
        {isLoading
          ? "Updating..."
          : currentStatus === "Pending"
            ? "Mark as Processing"
            : currentStatus === "Processing"
              ? "Dispatch Order"
              : currentStatus}
      </button>
    </>
  );
}
