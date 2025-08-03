"use client";

import Link from "next/link";
import { Table } from "@tanstack/react-table";

interface PaginationControlsProps {
  showAll: boolean;
  url: string;
  pagination: { pageIndex: number; pageSize: number };
  view: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>;
}

const PaginationControls = ({
  showAll,
  url,
  pagination,
  table,
  view,
}: PaginationControlsProps) => {
  return (
    <div className="flex justify-center mt-5">
      {!showAll ? (
        <Link
          href={url}
          className="bg-[#2e374a] hover:bg-[#3d4a65] text-white px-4 py-2 rounded-md text-sm shadow"
        >
          View All {view}
        </Link>
      ) : (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-gray-700 rounded-md disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 bg-[#3f3fad] hover:bg-[#313195] rounded-md">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-700 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
