"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const DispatchConfirmation = ({
  orderId,
  onConfirm,
  onCancel,
}: {
  orderId: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Process Order
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 mt-1">
            You&apos;re about to move this order to the <strong>Dispatched</strong> status.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-800 dark:text-gray-200 mb-2">
            Order ID: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{orderId.slice(0, 8)}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Once confirmed, the order will be marked as <strong>Dispatched</strong> and will appear in the Dispatch Center.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
          >
            Confirm Dispatch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
