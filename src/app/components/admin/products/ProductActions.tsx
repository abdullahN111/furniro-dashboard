"use client";

import Link from "next/link";
import { useState } from "react";
// import { client } from "@/sanity/lib/client";

interface ProductActionsProps {
  action: string;
  onDelete: (id: string) => void;
  link: string;
}

const ProductActions = ({ action, onDelete, link }: ProductActionsProps) => {
  // const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: action }),
      });

      const data = await response.json(); // Parse response
      if (!response.ok)
        throw new Error(data.message || "Failed to delete product");

      onDelete(action);
      setIsConfirming(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
     <Link href={link}>
     <button className="bg-green-700 text-white px-2 py-1 rounded-md text-[13px] shadow">
        Details
      </button>
     </Link>
      <button
        className="bg-red-700 text-white px-2 py-1 rounded-md text-[13px] shadow"
        onClick={() => setIsConfirming(true)}
        disabled={isDeleting}
      >
        Delete
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all ease-in-out duration-300 ${
          isConfirming ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white p-4 rounded-lg w-[200px]">
          <p className="text-sm font-medium text-gray-700">
            Are you sure you want to delete?
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <button
              className="bg-red-600 text-white p-2 rounded-md text-sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              className="mt-2 text-gray-600 p-2 rounded-md text-sm border"
              onClick={() => setIsConfirming(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
