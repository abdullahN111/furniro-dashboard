"use client";

import Link from "next/link";
import { Table } from "@tanstack/react-table";
import { MdArrowForward, MdChevronLeft, MdChevronRight } from "react-icons/md";

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
  const pageCount = Math.max(1, table.getPageCount());

  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
      {!showAll ? (
        <div className="w-full flex justify-end">
          <Link
            href={url}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          >
            <span>View All {view}</span>
            <MdArrowForward size={15} />
          </Link>
        </div>
      ) : (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Showing page{" "}
            <strong className="text-slate-200">
              {pagination.pageIndex + 1}
            </strong>{" "}
            of <strong className="text-slate-200">{pageCount}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <MdChevronLeft size={16} />
              Prev
            </button>
            <span className="px-3 py-1.5 bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold">
              {pagination.pageIndex + 1} / {pageCount}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <MdChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
