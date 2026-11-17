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

  const updateOrderStatus = async (nextStatus: string, endpoint?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        endpoint || `/api/orders/${orderId}/status`,
        endpoint
          ? { method: "POST" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: nextStatus }),
            }
      );

      if (!res.ok) throw new Error(`Failed to move order to ${nextStatus}`);

      const updated = await res.json();
      setCurrentStatus(updated.status || nextStatus);
      toast.success(
        nextStatus === "Delivered"
          ? "Order marked as Delivered & payment status synced to Paid."
          : `Order moved to ${nextStatus}.`
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order status.");
    } finally {
      setIsLoading(false);
      setConfirmDispatch(false);
    }
  };

  const isCompletedState = currentStatus === "Delivered";

  return (
    <>
      {confirmDispatch && (
        <DispatchConfirmation
          orderId={orderId}
          onConfirm={() =>
            updateOrderStatus("Dispatched", `/api/orders/${orderId}/dispatch`)
          }
          onCancel={() => setConfirmDispatch(false)}
        />
      )}
      <button
        onClick={() => {
          if (currentStatus === "Pending") {
            updateOrderStatus("Processing", `/api/orders/${orderId}/process`);
          } else if (currentStatus === "Processing") {
            setConfirmDispatch(true);
          } else if (currentStatus === "Dispatched") {
            updateOrderStatus("Shipped");
          } else if (currentStatus === "Shipped") {
            updateOrderStatus("Delivered");
          }
        }}
        disabled={isLoading || isCompletedState}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:cursor-not-allowed ${
          currentStatus === "Pending"
            ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30"
            : currentStatus === "Processing"
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
              : currentStatus === "Dispatched"
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20"
                : currentStatus === "Shipped"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 opacity-75"
        }`}
      >
        {isLoading
          ? "Updating..."
          : currentStatus === "Pending"
            ? "Mark as Processing"
            : currentStatus === "Processing"
              ? "Dispatch Order"
              : currentStatus === "Dispatched"
                ? "Mark as Shipped"
                : currentStatus === "Shipped"
                  ? "Mark as Delivered"
                  : "Delivered ✓"}
      </button>
    </>
  );
}
