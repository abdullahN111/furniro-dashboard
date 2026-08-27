/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { deleteUser } from "@/app/lib/actions";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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

  const isCurrentUserAdmin = (session?.user as any)?.role === "admin";
  const canDelete = isCurrentUserAdmin && (!isAdmin || adminsCount > 1);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("sessionUserId", (session?.user as any)?.id ?? "");

      await deleteUser(formData);

      toast.success("User deleted successfully.");
      onUserDeleted();
      setIsConfirming(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={viewLink}>
        <button className="bg-green-700 text-white px-2 py-1 rounded text-sm">
          Edit
        </button>
      </Link>

      {canDelete ? (
        <button
          className="bg-red-700 text-white px-2 py-1 rounded-md text-[13px] shadow"
          onClick={() => setIsConfirming(true)}
        >
          Delete
        </button>
      ) : (
        <button
          className="bg-red-700 text-white px-2 py-1 rounded-md text-[13px] shadow opacity-70"
          disabled
        >
          Delete
        </button>
      )}

      <div
        className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all ease-in-out duration-300 ${
          isConfirming ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white p-4 rounded-lg w-[250px] relative shadow-lg">
          <p className="mt-5 text-sm font-medium text-gray-700 text-center">
            Are you sure you want to delete this user?
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <button
              className="bg-red-600 text-white p-2 rounded-md text-sm w-full"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>

          <button
            className="absolute top-1 right-3 text-gray-600 text-3xl"
            onClick={() => setIsConfirming(false)}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActions;