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
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import SearchBar from "@/app/dashboard/search/SearchBar";
import { useSearch } from "@/app/dashboard/search/SearchContext";

interface TransactionsProps {
  showAll?: boolean;
  heading?: string;
}

const Transactions = ({ showAll = false, heading }: TransactionsProps) => {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setPayments(data);
    };
    fetchPayments();
  }, []);

  const { pageSearchQuery } = useSearch();

  const filteredTransactions = useMemo(() => {
    if (!pageSearchQuery) return payments;
    return payments.filter(
      (p) =>
        p.id.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        p.status.toLowerCase().includes(pageSearchQuery.toLowerCase())
    );
  }, [pageSearchQuery, payments]);

  const displayedTransactions = useMemo(
    () => (showAll ? filteredTransactions : filteredTransactions.slice(0, 5)),
    [filteredTransactions, showAll]
  );

  const columns = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: (info: any) => {
        const id = info.getValue();
        return id.substring(0, 8);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info: any) => {
        const row = info.row.original;
        const color =
          row.status === "succeeded"
            ? "bg-[#afd6ee75]"
            : row.status === "processing"
              ? "bg-[#f7cb7375]"
              : "bg-[#f7737375]";
        return (
          <span
            className={`${color} rounded-[5px] p-[5px] text-[14px] text-white`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      accessorKey: "created",
      header: "Date",
      cell: (info: any) =>
        new Date(info.getValue() * 1000).toLocaleDateString(),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info: any) => `$${(info.getValue() / 100).toFixed()}`,
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <div className="flex gap-2">
          <button className="bg-red-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm shadow">
            Details
          </button>
          <button className="bg-green-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm shadow">
            Process
          </button>
        </div>
      ),
    },
  ];

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: displayedTransactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div className="container bg-[--bgSoft] p-4 lg:p-2 xl:p-4 rounded-[10px] mb-8 mt-4 shadow-lg border border-[#2e374a]">
      <div className="text-[--textSoft] text-lg font-bold capitalize py-2">
        {heading}
      </div>
      <div className="mt-2 mb-3">
        <SearchBar scope="page" />
      </div>

      <div className="hidden lg:block w-full overflow-auto rounded-lg shadow">
        <Table className="w-full xl:min-w-[600px]">
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="lg:hidden flex flex-col gap-4">
        {displayedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-3 sm:p-4 text-white border border-[#2e374a] rounded-lg shadow-md bg-[--bgSoft]"
          >
            <p className="text-[15px] mb-[10px]">Name: {transaction.name}</p>
            <p className="text-[15px] mb-[10px]">
              Status:{" "}
              <span
                className={`${transaction.statusColor} rounded-[5px] p-[5px] text-[12px]`}
              >
                {transaction.status}
              </span>
            </p>
            <p className="text-[15px] mb-[10px]">Date: {transaction.date}</p>
            <p className="text-[15px] mb-[10px]">
              Amount: {transaction.amount}
            </p>
            <div className="flex gap-2 mt-3">
              <button className="bg-red-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm shadow">
                Details
              </button>
              <button className="bg-green-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm shadow">
                Process
              </button>
            </div>
          </div>
        ))}
      </div>

      <PaginationControls
        showAll={showAll}
        url="/dashboard/transactions"
        pagination={pagination}
        table={table}
        view={"Transactions"}
      />
    </div>
  );
};

export default Transactions;
