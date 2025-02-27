"use client";

import { useState, useMemo } from "react";
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

const Orders = () => {
  const { pageSearchQuery } = useSearch();
  const orders = useMemo(
    () => [
      {
        id: "#001",
        customer: "Jane Doe",
        product: "Office Chair",
        quantity: 2,
        price: "$150.00",
      },
      {
        id: "#002",
        customer: "John Smith",
        product: "Dining Table",
        quantity: 1,
        price: "$350.00",
      },
      {
        id: "#003",
        customer: "Alice Green",
        product: "Coffee Table",
        quantity: 1,
        price: "$200.00",
      },
      {
        id: "#004",
        customer: "Mark Black",
        product: "Dining Chair",
        quantity: 4,
        price: "$120.00",
      },
      {
        id: "#005",
        customer: "Emma Brown",
        product: "Bookshelf",
        quantity: 1,
        price: "$180.00",
      },
      {
        id: "#006",
        customer: "Liam White",
        product: "Lamp",
        quantity: 2,
        price: "$60.00",
      },
      {
        id: "#007",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#008",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#009",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0010",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0011",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0012",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0013",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0014",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0015",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0016",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0017",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0018",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0019",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
      {
        id: "#0020",
        customer: "Sophia Blue",
        product: "Desk",
        quantity: 1,
        price: "$250.00",
      },
    ],
    []
  );

  const filteredOrders = useMemo(() => {
    if (!pageSearchQuery) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
        o.product.toLowerCase().includes(pageSearchQuery.toLowerCase())
    );
  }, [pageSearchQuery, orders]);

  const columns = [
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "customer", header: "Customer Name" },
    { accessorKey: "product", header: "Product Name" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "price", header: "Price" },
    {
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <div className="flex gap-2">
          <button className="bg-red-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm">
            Details
          </button>
          <button className="bg-green-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm">
            Process
          </button>
        </div>
      ),
    },
  ];

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: filteredOrders,
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
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="p-3 sm:p-4 border border-[#2e374a] rounded-lg shadow-md bg-[--bgSoft]"
          >
            <p className="text-sm text-white mb-1">Order ID: {order.id}</p>
            <p className="text-sm text-white mb-1">
              Customer: {order.customer}
            </p>
            <p className="text-sm text-white mb-1">Product: {order.product}</p>
            <p className="text-sm text-white mb-1">
              Quantity: {order.quantity}
            </p>
            <p className="text-sm text-white mb-1">Price: {order.price}</p>
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
    </div>
  );
};

export default Orders;
