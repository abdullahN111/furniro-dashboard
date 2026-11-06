/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { deleteUser } from "@/app/lib/actions";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UserActions = ({
  viewLink,
  userId,
  isAdmin,
  adminsCount,
  onUserDeleted,
}: {
  viewLink: string;
  userId: string;
  isAdmin: boolean;
  adminsCount: number;
  onUserDeleted: () => void;
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();

  const sessionUserId = (session?.user as any)?.id;
  const isCurrentUserAdmin = (session?.user as any)?.role === "admin";
  const canDelete =
    isCurrentUserAdmin &&
    sessionUserId !== userId &&
    (!isAdmin || adminsCount > 1);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("id", userId);

      const result = await deleteUser(formData);
      if (!result.success) {
        toast.error(result.error || "Failed to delete user");
        return;
      }

      toast.success("User deleted successfully.");
      onUserDeleted();
      setIsConfirming(false);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={viewLink}
        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
      >
        {sessionUserId === userId || isCurrentUserAdmin ? "Manage" : "View"}
      </Link>

      {canDelete && (
        <button
          className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          onClick={() => setIsConfirming(true)}
        >
          Delete
        </button>
      )}

      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent className="bg-[#111827] text-slate-100 border border-slate-800 rounded-2xl max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Delete User Account?
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs sm:text-sm mt-1">
              Are you sure you want to permanently remove this user account? This action cannot be undone.
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

export default UserActions;
