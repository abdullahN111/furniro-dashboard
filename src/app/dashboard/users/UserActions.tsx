"use client";

import { deleteUser } from "@/app/lib/actions";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const UserActions = ({
  viewLink,
  userId,
}: {
  viewLink: string;
  userId: string;
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-2">
      <Link href={viewLink}>
        <button className="bg-green-700 text-white px-2 py-1 rounded text-sm">
          View
        </button>
      </Link>
      {(session?.user as { role?: string })?.role === "admin"? (
        <button
        className="bg-red-700 text-white px-2 py-1 rounded-md text-[13px] shadow"
        onClick={() => setIsConfirming(true)}
      >
        Delete
      </button>
      ): (
        <button
        className="bg-red-700 text-white px-2 py-1 rounded-md text-[13px] shadow opacity-70"
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
            Are you sure you want to delete the user?
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <form action={deleteUser}>
              <input type="hidden" name="id" value={userId} />
              <button
                className="bg-red-600 text-white p-2 rounded-md text-sm w-full"
                onClick={() => {
                  setIsDeleting(true);
                  setTimeout(() => {
                    setIsDeleting(false);
                    setIsConfirming(false);
                  }, 2000);
                }}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </form>
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
