"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
      <DialogContent className="bg-[#111827] text-slate-100 rounded-2xl shadow-2xl border border-slate-800 max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            Confirm Order Dispatch
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs sm:text-sm mt-1">
            You are about to transition this order to{" "}
            <strong className="text-purple-300">Dispatched</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-2.5 text-sm">
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3.5 py-2.5 rounded-xl">
            <span className="text-slate-400 text-xs">Order Reference</span>
            <span className="font-mono text-xs font-semibold text-indigo-300">
              #{orderId.slice(0, 8)}
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Once confirmed, the dispatch timestamp will be recorded and the order will appear in the{" "}
            <strong className="text-slate-200">Dispatch Center</strong>.
          </p>
        </div>

        <div className="flex justify-end gap-2.5 mt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            Confirm Dispatch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
