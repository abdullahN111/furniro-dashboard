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
import LocalSearchBar from "@/app/dashboard/search/LocalSearchBar";
import { useSearch } from "@/app/dashboard/search/SearchContext";

import { fetchOrders, Order } from "./OrderData";
import PaginationControls from "@/app/components/admin/pagination/PaginationControls";
import Link from "next/link";
import { DispatchConfirmation } from "./DispatchConfirmation";
import { toast } from "sonner";

interface OrdersProps {
  showAll?: boolean;
  heading?: string;
}

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Dispatched",
  "Shipped",
  "Delivered",
];


const PAYMENT_METHOD_OPTIONS = [
  { label: "Card", value: "Stripe" },
  { label: "Cash On Delivery", value: "Cash On Delivery" },
];

const paymentMethodLabel = (value: string) => {
  const match = PAYMENT_METHOD_OPTIONS.find((p) => p.value === value);
  return match ? match.label : value;
};

const Orders = ({ showAll = false, heading }: OrdersProps) => {
  const { pageSearchQuery } = useSearch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dispatchOrderId, setDispatchOrderId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDispatching, setIsDispatching] = useState(false);


  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleProcess = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/process`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to process order");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
              ...order,
              status: "Processing",
            }
            : order,
        ),
      );
      toast.success("Order processed successfully.");
    } catch (error) {
      console.error("Failed to process order:", error);
      toast.error("Failed to process order.");
    }
  };

  const handleDispatch = async () => {
    if (!dispatchOrderId) return;

    setIsDispatching(true);
    try {
      const res = await fetch(`/api/orders/${dispatchOrderId}/dispatch`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to dispatch order");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === dispatchOrderId
            ? {
              ...order,
              status: "Dispatched",
              dispatchedAt: new Date().toISOString(),
            }
            : order,
        ),
      );

      setDispatchOrderId(null);
      toast.success("Order dispatched successfully.");
    } catch (error) {
      console.error("Failed to dispatch order:", error);
      toast.error("Failed to dispatch order.");
    } finally {
      setIsDispatching(false);
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };
    getOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {

      const custName =
        `${o.user?.firstname ?? ""} ${o.user?.lastname ?? ""}`.toLowerCase();
      const query = pageSearchQuery.toLowerCase();

      const matchesSearch =
        !pageSearchQuery ||
        (o.orderId ?? "").toLowerCase().includes(query) ||
        custName.includes(query) ||
        (o.items ?? []).some((p) =>
          (p.title ?? "").toLowerCase().includes(query),
        );


      const matchesStatus = !statusFilter || o.status === statusFilter;


      const matchesPayment =
        !paymentFilter || o.paymentMethod === paymentFilter;

      const orderDate = new Date(o.createdAt);
      const matchesFrom = !fromDate || orderDate >= new Date(fromDate);
      const matchesTo =
        !toDate || orderDate <= new Date(`${toDate}T23:59:59`);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesFrom &&
        matchesTo
      );
    });
  }, [pageSearchQuery, orders, statusFilter, paymentFilter, fromDate, toDate]);

  const displayedOrders = useMemo(
    () => (showAll ? filteredOrders : filteredOrders.slice(0, 5)),
    [filteredOrders, showAll],
  );

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const hasActiveFilters =
    statusFilter || paymentFilter || fromDate || toDate;

  const clearFilters = () => {
    setStatusFilter("");
    setPaymentFilter("");
    setFromDate("");
    setToDate("");
  };

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
                <span>${p.price}</span>
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
            0,
          );
          return `$${subtotal.toFixed(2)}`;
        },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }: { row: { original: Order } }) =>
          row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : "N/A",
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }: { row: { original: Order } }) =>
          paymentMethodLabel(row.original.paymentMethod),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }: { row: { original: Order } }) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/orders/order/${row.original._id}`}
              className="bg-green-700 text-white px-2 py-1 rounded-md text-xs sm:text-[13px] shadow"
            >
              Details
            </Link>
            <button
              onClick={() => {
                if (row.original.status === "Pending") {
                  handleProcess(row.original._id);
                } else if (row.original.status === "Processing") {
                  setDispatchOrderId(row.original._id);
                }
              }}
              className={`text-white px-2 py-1 rounded-md text-xs sm:text-[13px] shadow ${row.original.status === "Pending"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : row.original.status === "Processing"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : row.original.status === "Dispatched"
                    ? "bg-purple-600 opacity-50 cursor-not-allowed"
                    : row.original.status === "Shipped"
                      ? "bg-indigo-600 opacity-50 cursor-not-allowed"
                      : row.original.status === "Delivered"
                        ? "bg-orange-600 opacity-50 cursor-not-allowed"
                        : "bg-gray-600"
                }`}
              disabled={
                row.original.status === "Dispatched" ||
                row.original.status === "Shipped" ||
                row.original.status === "Delivered"
              }
            >
              {row.original.status === "Pending"
                ? "Process"
                : row.original.status === "Processing"
                  ? "Dispatch"
                  : row.original.status === "Dispatched"
                    ? "Dispatched"
                    : row.original.status === "Shipped"
                      ? "Shipped"
                      : row.original.status === "Delivered"
                        ? "Delivered"
                        : "N/A"}
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container bg-[--bgSoft] p-4 lg:p-2 xl:p-4 rounded-[10px] mb-8 mt-4 shadow-lg border border-[#2e374a]">
      {dispatchOrderId && (
        <DispatchConfirmation
          orderId={dispatchOrderId}
          onConfirm={handleDispatch}
          onCancel={() => setDispatchOrderId(null)}
        />
      )}
      <div className="text-[--textSoft] text-lg font-bold capitalize py-2">
        {heading}
      </div>
      <div className="mt-2 mb-3">
        <LocalSearchBar scope="page" />
      </div>

      {/* ✅ Filter bar */}
      <div className="flex flex-wrap items-end gap-3 mb-4 bg-[#151c2c] p-3 rounded-lg border border-[#2e374a]">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[--textSoft]">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[--bg] text-[--text] border border-[#2e374a] rounded-md px-2 py-1.5 min-w-[130px]"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[--textSoft]">
            Payment Method
          </label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs bg-[--bg] text-[--text] border border-[#2e374a] rounded-md px-2 py-1.5 min-w-[150px]"
          >
            <option value="">All Methods</option>
            {PAYMENT_METHOD_OPTIONS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[--textSoft]">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="text-xs bg-[--bg] text-[--text] border border-[#2e374a] rounded-md px-2 py-1.5"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[--textSoft]">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="text-xs bg-[--bg] text-[--text] border border-[#2e374a] rounded-md px-2 py-1.5"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs px-3 py-1.5 rounded-md bg-[#2e374a] text-[--text] hover:bg-[#3a4560] h-fit"
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-32 text-lg font-semibold text-[--textSoft]">
          Loading orders...
        </div>
      ) : (
        <>
          <div className="hidden lg:block w-full overflow-auto rounded-lg shadow">
            <Table className="w-full xl:min-w-[600px]">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                      colSpan={7}
                      className="text-center py-10 text-[--textSoft]"
                    >
                      No orders match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden flex flex-col gap-4">
            {displayedOrders.length === 0 ? (
              <div className="text-center py-10 text-[--textSoft] text-sm">
                No orders match the current filters.
              </div>
            ) : (
              displayedOrders
                .slice(
                  pagination.pageIndex * pagination.pageSize,
                  (pagination.pageIndex + 1) * pagination.pageSize,
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
                      Customer:{" "}
                      {`${order.user.firstname} ${order.user.lastname}`}
                    </p>
                    {order.items.map((p, index) => (
                      <p key={index} className="text-sm text-white mb-1">
                        Product: {p.title}
                      </p>
                    ))}
                    {order.items.map((p, index) => (
                      <p key={index} className="text-sm text-white mb-1">
                        Price: <span>({order.itemQuantities[index]}) x </span>{" "}
                        ${p.price}
                      </p>
                    ))}

                    <p className="text-sm text-white font-bold mt-2">
                      Subtotal: $
                      {order.items
                        .reduce(
                          (sum, item, index) =>
                            sum +
                            item.price * (order.itemQuantities[index] || 0),
                          0,
                        )
                        .toFixed(2)}
                    </p>
                    <p className="text-sm text-white font-bold mt-2">
                      Date:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-sm text-white font-bold mt-2">
                      Payment Method:{" "}
                      {paymentMethodLabel(order.paymentMethod)}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/dashboard/orders/order/${order._id}`}
                        className="bg-green-700 text-white px-2 py-1 rounded-md text-[13px] shadow"
                      >
                        Details
                      </Link>

                      <button
                        onClick={() => {
                          if (order.status === "Pending") {
                            handleProcess(order._id);
                          } else if (order.status === "Processing") {
                            setDispatchOrderId(order._id);
                          }
                        }}
                        className={`text-white px-2 py-1 rounded-md text-xs sm:text-[13px] ${order.status === "Pending"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : order.status === "Processing"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : order.status === "Dispatched"
                              ? "bg-purple-600 opacity-50 cursor-not-allowed"
                              : order.status === "Shipped"
                                ? "bg-indigo-600 opacity-50 cursor-not-allowed"
                                : order.status === "Delivered"
                                  ? "bg-orange-600 opacity-50 cursor-not-allowed"
                                  : "bg-gray-600"
                          }`}
                        disabled={
                          order.status === "Dispatched" ||
                          order.status === "Shipped" ||
                          order.status === "Delivered"
                        }
                      >
                        {order.status === "Pending"
                          ? "Process"
                          : order.status === "Processing"
                            ? "Dispatch"
                            : order.status === "Dispatched"
                              ? "Dispatched"
                              : order.status === "Shipped"
                                ? "Shipped"
                                : order.status === "Delivered"
                                  ? "Delivered"
                                  : "N/A"}
                      </button>
                    </div>
                  </div>
                ))
            )}
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