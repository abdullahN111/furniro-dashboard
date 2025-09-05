"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
      <DialogContent className="bg-[--bg] text-[--text] border-[#2e374a]">
        <DialogHeader>
          <DialogTitle>Confirm Dispatch</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            Are you sure you want to dispatch order <strong>{orderId.slice(0, 8)}</strong>?
          </p>
          <p className="text-sm text-[--textSoft]">
            This action will mark the order as shipped and cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-[#2e374a] text-[--text]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-green-700 hover:bg-green-800"
          >
            Confirm Dispatch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};