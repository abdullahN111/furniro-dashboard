"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  action: string;
  onDelete: (id: string) => void;
  link: string;
}

const ProductActions = ({ action, onDelete, link }: ProductActionsProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/products/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: action }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      onDelete(action);
      setIsConfirming(false);
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={link}
        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
      >
        Details
      </Link>
      <button
        className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
        onClick={() => setIsConfirming(true)}
        disabled={isDeleting}
      >
        Delete
      </button>

      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent className="bg-[#111827] text-slate-100 border border-slate-800 rounded-2xl max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Delete Product?
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs sm:text-sm mt-1">
              This action permanently removes the product from your Sanity catalog and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2.5 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirming(false)}
              disabled={isDeleting}
              className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold px-4"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductActions;
