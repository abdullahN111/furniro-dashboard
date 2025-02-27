"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
// import Image from "next/image";
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
}

const Transactions = ({ showAll = false }: TransactionsProps) => {
  const { pageSearchQuery } = useSearch();

  const transactions = useMemo(
    () => [
      {
        id: "#T001",
        name: "John Doe",
        status: "Pending",
        date: "12.02.2025",
        amount: "$320.00",
        statusColor: "bg-[#f7cb7375]",
      },
      {
        id: "#T002",
        name: "Alice Green",
        status: "Done",
        date: "11.02.2025",
        amount: "$210.00",
        statusColor: "bg-[#afd6ee75]",
      },
      {
        id: "#T003",
        name: "Michael Brown",
        status: "Cancelled",
        date: "10.02.2025",
        amount: "$500.00",
        statusColor: "bg-[#f7737375]",
      },
      {
        id: "#T004",
        name: "Emma Smith",
        status: "Pending",
        date: "09.02.2025",
        amount: "$150.00",
        statusColor: "bg-[#f7cb7375]",
      },
      {
        id: "#T005",
        name: "Sophia White",
        status: "Done",
        date: "08.02.2025",
        amount: "$750.00",
        statusColor: "bg-[#afd6ee75]",
      },
      {
        id: "#T006",
        name: "Olivia Clark",
        status: "Pending",
        date: "07.02.2025",
        amount: "$620.00",
        statusColor: "bg-[#f7cb7375]",
      },
      {
        id: "#T007",
        name: "Liam Wilson",
        status: "Cancelled",
        date: "06.02.2025",
        amount: "$410.00",
        statusColor: "bg-[#f7737375]",
      },
      {
        id: "#T008",
        name: "Noah Miller",
        status: "Done",
        date: "05.02.2025",
        amount: "$300.00",
        statusColor: "bg-[#afd6ee75]",
      },
      {
        id: "#T009",
        name: "Mia Davis",
        status: "Pending",
        date: "04.02.2025",
        amount: "$290.00",
        statusColor: "bg-[#f7cb7375]",
      },
      {
        id: "#T010",
        name: "William Taylor",
        status: "Done",
        date: "03.02.2025",
        amount: "$530.00",
        statusColor: "bg-[#afd6ee75]",
      },
    ],
    []
  );

  const filteredTransactions = useMemo(() => {
    if (!pageSearchQuery) return transactions;
    return transactions.filter(
      (t) =>
        t.id.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        t.status.toLowerCase().includes(pageSearchQuery.toLowerCase())
    );
  }, [pageSearchQuery, transactions]);

  const displayedTransactions = useMemo(
    () => (showAll ? filteredTransactions : filteredTransactions.slice(0, 5)),
    [filteredTransactions, showAll]
  );

  const columns = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "status",
      header: "Status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (info: any) => {
        const row = info.row.original;
        return (
          <span
            className={`${row.statusColor} rounded-[5px] p-[5px] text-[14px] text-white`}
          >
            {row.status}
          </span>
        );
      },
    },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "amount", header: "Amount" },
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
    <div className="container bg-[--bgSoft] w-full p-4 rounded-[10px] mt-5">
      <div className="mt-2 mb-3">
        <SearchBar scope="page" />
      </div>

      <div className="hidden md:block w-full overflow-auto rounded-lg shadow">
        <Table className="w-full min-w-[600px]">
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

      <div className="md:hidden flex flex-col gap-4">
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

      {!showAll && (
        <div className="flex justify-center mt-5">
          <Link
            href="/dashboard/transactions"
            className="bg-[#2e374a] hover:bg-[#3d4a65] text-white px-4 py-2 rounded-md text-sm shadow"
          >
            View All Transactions
          </Link>
        </div>
      )}
      {showAll && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 bg-gray-100 rounded-md">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
