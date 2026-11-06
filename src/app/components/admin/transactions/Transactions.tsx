/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import PaginationControls from "@/app/components/admin/pagination/PaginationControls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import LocalSearchBar from "@/app/dashboard/search/LocalSearchBar";

interface TransactionsProps {
  showAll?: boolean;
  heading?: string;
}

const getPaymentBadge = (status: string) => {
  switch (status) {
    case "succeeded":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "processing":
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    default:
      return "bg-rose-500/15 text-rose-300 border-rose-500/30";
  }
};

const Transactions = ({
  showAll = false,
  heading = "Stripe Transactions",
}: TransactionsProps) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/transactions", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return payments;
    const q = searchQuery.toLowerCase();
    return payments.filter(
      (p) =>
        (p.id || "").toLowerCase().includes(q) ||
        (p.status || "").toLowerCase().includes(q) ||
        (p.currency || "").toLowerCase().includes(q)
    );
  }, [searchQuery, payments]);

  const displayedTransactions = useMemo(
    () => (showAll ? filteredTransactions : filteredTransactions.slice(0, 5)),
    [filteredTransactions, showAll]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Payment ID",
        cell: (info: any) => {
          const id = info.getValue() || "";
          return (
            <span className="font-mono text-xs font-semibold text-indigo-400">
              {id.substring(0, 14)}...
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info: any) => {
          const status = info.row.original.status || "unknown";
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getPaymentBadge(
                status
              )}`}
            >
              {status.replace(/_/g, " ")}
            </span>
          );
        },
      },
      {
        accessorKey: "created",
        header: "Timestamp",
        cell: (info: any) => (
          <span className="text-xs text-slate-300">
            {new Date(info.getValue() * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info: any) => (
          <span className="font-semibold text-slate-100">
            ${(Number(info.getValue() || 0) / 100).toFixed(2)}{" "}
            <span className="text-[10px] uppercase text-slate-400">
              {info.row.original.currency || "usd"}
            </span>
          </span>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: (info: any) => (
          <button
            onClick={() => setSelectedTx(info.row.original)}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
          >
            Inspect
          </button>
        ),
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: displayedTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  if (loading) {
    return (
      <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#111827] p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-800/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-white text-base sm:text-lg font-bold capitalize">
            {heading}
          </h2>
          <p className="text-xs text-slate-400">
            Showing {displayedTransactions.length} of{" "}
            {filteredTransactions.length} Stripe payment intents
          </p>
        </div>
        <LocalSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search payment ID or status..."
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-slate-800/80">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10 text-slate-400"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden flex flex-col gap-3">
        {table.getRowModel().rows.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm border border-slate-800 rounded-xl">
            No transactions found.
          </div>
        ) : (
          table.getRowModel().rows.map(({ original: tx }) => (
            <div
              key={tx.id}
              className="p-4 border border-slate-800 rounded-xl bg-slate-900/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-indigo-400">
                  {tx.id.slice(0, 14)}...
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getPaymentBadge(
                    tx.status
                  )}`}
                >
                  {(tx.status || "").replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>
                  {tx.created
                    ? new Date(tx.created * 1000).toLocaleDateString()
                    : "N/A"}
                </span>
                <span className="text-sm font-bold text-white">
                  ${((tx.amount || 0) / 100).toFixed(2)}{" "}
                  <span className="text-[10px] uppercase text-slate-400">
                    {tx.currency || "usd"}
                  </span>
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(tx)}
                className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded-xl text-xs font-medium transition-colors"
              >
                Inspect Payment Details
              </button>
            </div>
          ))
        )}
      </div>

      <PaginationControls
        showAll={showAll}
        url="/dashboard/transactions"
        pagination={pagination}
        table={table}
        view={"Transactions"}
      />

      {/* Transaction Details Modal */}
      <Dialog
        open={Boolean(selectedTx)}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      >
        <DialogContent className="bg-[#111827] text-slate-100 border border-slate-800 rounded-2xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Stripe Payment Intent Details
            </DialogTitle>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-3 text-xs sm:text-sm mt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Amount</span>
                <span className="text-base font-bold text-emerald-400">
                  ${((selectedTx.amount || 0) / 100).toFixed(2)}{" "}
                  {(selectedTx.currency || "usd").toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Intent ID</span>
                  <span className="font-mono text-xs text-slate-200 break-all text-right">
                    {selectedTx.id}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Status</span>
                  <span className="capitalize font-semibold text-indigo-300">
                    {(selectedTx.status || "").replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Created</span>
                  <span className="text-slate-200">
                    {selectedTx.created
                      ? new Date(selectedTx.created * 1000).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Payment Methods</span>
                  <span className="text-slate-200 capitalize">
                    {Array.isArray(selectedTx.payment_method_types)
                      ? selectedTx.payment_method_types.join(", ")
                      : "Card"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
