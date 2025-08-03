"use client";

import { useState, useMemo, useEffect } from "react";
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

import { fetchOrders, Order } from "./OrderData";
import PaginationControls from "@/app/components/admin/pagination/PaginationControls";

interface OrdersProps {
  showAll?: boolean;
  heading?: string;
}

const Orders = ({ showAll = false, heading }: OrdersProps) => {
  const { pageSearchQuery } = useSearch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state added

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true); // Start loading
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
      setLoading(false); // Stop loading
    };
    getOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!pageSearchQuery) return orders;

    return orders.filter((o) => {
      const custName = `${o.user.firstname} ${o.user.lastname}`.toLowerCase();
      const query = pageSearchQuery.toLowerCase();

      return (
        o.orderId.toLowerCase().includes(query) ||
        custName.includes(query) ||
        o.items.some((p) => p.title.toLowerCase().includes(query))
      );
    });
  }, [pageSearchQuery, orders]);

  const displayedOrders = useMemo(
    () => (showAll ? filteredOrders : filteredOrders.slice(0, 5)),
    [filteredOrders, showAll]
  );

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: displayedOrders,
    columns: [
      {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }: { row: { original: Order } }) =>
          `${row.original.orderId.slice(0, 8)}`,
      },
      {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }: { row: { original: Order } }) =>
          `${row.original.user.firstname} ${row.original.user.lastname}`,
      },
      {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }: { row: { original: Order } }) => (
          <div className="whitespace-pre-wrap">
            {row.original.items.map((p, index) => (
              <div key={index}>{p.title}</div>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "totalPrice",
        header: "Price",
        cell: ({ row }: { row: { original: Order } }) => (
          <div>
            {row.original.items.map((p, index) => (
              <div key={index} className="flex justify-start gap-5">
                <span>{row.original.itemQuantities[index]}x</span>
                <span>${p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "subtotal",
        header: "Subtotal",
        cell: ({ row }: { row: { original: Order } }) => {
          const subtotal = row.original.items.reduce(
            (sum, item, index) =>
              sum + item.price * (row.original.itemQuantities[index] || 0),
            0
          );
          return `$${subtotal.toFixed(2)}`;
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="bg-red-700 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
              Details
            </button>
            <button className="bg-green-700 text-white px-2 py-1 rounded-md text-xs sm:text-[13px]">
              Process
            </button>
          </div>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div className="container bg-[--bgSoft] w-full p-4 rounded-[10px] mt-5">
      <div className="text-[--textSoft] text-lg font-bold capitalize py-2">
        {heading}
      </div>
      <div className="mt-2 mb-3">
        <SearchBar scope="page" />
      </div>

   
      {loading ? (
        <div className="text-center py-32 text-lg font-semibold text-[--textSoft]">
          Loading orders...
        </div>
      ) : (
        <>
          <div className="hidden lg+:block w-full overflow-auto rounded-lg shadow">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="lg+:hidden flex flex-col gap-4">
            {displayedOrders
              .slice(
                pagination.pageIndex * pagination.pageSize,
                (pagination.pageIndex + 1) * pagination.pageSize
              )
              .map((order) => (
                <div
                  key={order._id}
                  className="p-3 sm:p-4 border border-[#2e374a] rounded-lg shadow-md bg-[--bgSoft]"
                >
                  <p className="text-sm text-white mb-1">
                    Order ID: {order.orderId.slice(0, 8)}
                  </p>
                  <p className="text-sm text-white mb-1">
                    Customer: {`${order.user.firstname} ${order.user.lastname}`}
                  </p>
                  {order.items.map((p, index) => (
                    <p key={index} className="text-sm text-white mb-1">
                      Product: {p.title}
                    </p>
                  ))}
                  {order.items.map((p, index) => (
                    <p key={index} className="text-sm text-white mb-1">
                      Price: <span>({order.itemQuantities[index]}) x </span> $
                      {p.price}
                    </p>
                  ))}

                  <p className="text-sm text-white font-bold mt-2">
                    Subtotal: $
                    {order.items
                      .reduce(
                        (sum, item, index) =>
                          sum + item.price * (order.itemQuantities[index] || 0),
                        0
                      )
                      .toFixed(2)}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button className="bg-red-700 text-white px-2 py-1 rounded-md text-[13px] shadow">
                      Details
                    </button>
                    <button className="bg-green-700 text-white px-2 py-1 rounded-md text-[13px] shadow">
                      Process
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <PaginationControls
            showAll={showAll}
            url="/dashboard/orders"
            pagination={pagination}
            table={table}
            view={"Orders"}
          />
        </>
      )}
    </div>
  );
};

export default Orders;
