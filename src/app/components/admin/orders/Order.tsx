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
  { label: "Card (Stripe)", value: "Stripe" },
  { label: "Cash On Delivery", value: "Cash On Delivery" },
];

const paymentMethodLabel = (value: string) => {
  const match = PAYMENT_METHOD_OPTIONS.find((p) => p.value === value);
  return match ? match.label : value || "Standard";
};

export const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    case "Processing":
      return "bg-sky-500/15 text-sky-300 border-sky-500/30";
    case "Dispatched":
      return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    case "Shipped":
      return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
    case "Delivered":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
};

const Orders = ({ showAll = false, heading = "Orders" }: OrdersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dispatchOrderId, setDispatchOrderId] = useState<string | null>(null);

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
            : order
        )
      );
      toast.success("Order moved to Processing.");
    } catch (error) {
      console.error("Failed to process order:", error);
      toast.error("Failed to process order.");
    }
  };

  const handleDispatch = async () => {
    if (!dispatchOrderId) return;

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
            : order
        )
      );

      setDispatchOrderId(null);
      toast.success("Order dispatched successfully.");
    } catch (error) {
      console.error("Failed to dispatch order:", error);
      toast.error("Failed to dispatch order.");
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const custName =
        `${o.user?.firstname ?? ""} ${o.user?.lastname ?? ""}`.toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        !searchQuery ||
        (o.orderId ?? "").toLowerCase().includes(query) ||
        custName.includes(query) ||
        (o.items ?? []).some((p) =>
          (p?.title ?? "").toLowerCase().includes(query)
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
  }, [searchQuery, orders, statusFilter, paymentFilter, fromDate, toDate]);

  const displayedOrders = useMemo(
    () => (showAll ? filteredOrders : filteredOrders.slice(0, 5)),
    [filteredOrders, showAll]
  );

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const hasActiveFilters = Boolean(
    statusFilter || paymentFilter || fromDate || toDate || searchQuery
  );

  const clearFilters = () => {
    setStatusFilter("");
    setPaymentFilter("");
    setFromDate("");
    setToDate("");
    setSearchQuery("");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }: { row: { original: Order } }) => (
          <Link
            href={`/dashboard/orders/order/${row.original._id}`}
            className="font-mono text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            #{row.original.orderId?.slice(0, 8) || row.original._id.slice(0, 8)}
          </Link>
        ),
      },
      {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }: { row: { original: Order } }) => (
          <div>
            <div className="font-medium text-slate-100">
              {row.original.user?.firstname} {row.original.user?.lastname}
            </div>
            <div className="text-xs text-slate-400">
              {row.original.user?.email}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "products",
        header: "Items",
        cell: ({ row }: { row: { original: Order } }) => (
          <div className="space-y-1 max-w-[220px]">
            {(row.original.items || []).map((p, index) => (
              <div
                key={index}
                className="text-xs text-slate-300 truncate flex items-center justify-between gap-2"
              >
                <span className="truncate">{p?.title || "Item"}</span>
                <span className="text-slate-400 font-mono shrink-0">
                  ×{row.original.itemQuantities?.[index] || 1}
                </span>
              </div>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "subtotal",
        header: "Total",
        cell: ({ row }: { row: { original: Order } }) => {
          const subtotal = (row.original.items || []).reduce(
            (sum, item, index) =>
              sum +
              (item?.price || 0) * (row.original.itemQuantities?.[index] || 0),
            0
          );
          const displayTotal = row.original.total || subtotal;
          return (
            <span className="font-semibold text-slate-100">
              ${displayTotal.toFixed(2)}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: Order } }) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(
              row.original.status
            )}`}
          >
            {row.original.status || "Pending"}
          </span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ row }: { row: { original: Order } }) => (
          <span className="text-xs text-slate-300">
            {paymentMethodLabel(row.original.paymentMethod)}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }: { row: { original: Order } }) => (
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }: { row: { original: Order } }) => {
          const status = row.original.status;
          const canAct = status === "Pending" || status === "Processing";
          return (
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/orders/order/${row.original._id}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors"
              >
                View
              </Link>
              {canAct && (
                <button
                  onClick={() => {
                    if (status === "Pending") {
                      handleProcess(row.original._id);
                    } else if (status === "Processing") {
                      setDispatchOrderId(row.original._id);
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    status === "Pending"
                      ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {status === "Pending" ? "Process" : "Dispatch"}
                </button>
              )}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data: displayedOrders,
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
      {dispatchOrderId && (
        <DispatchConfirmation
          orderId={dispatchOrderId}
          onConfirm={handleDispatch}
          onCancel={() => setDispatchOrderId(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-white text-base sm:text-lg font-bold capitalize">
            {heading}
          </h2>
          <p className="text-xs text-slate-400">
            Showing {displayedOrders.length} of {filteredOrders.length} matching orders
          </p>
        </div>
        <LocalSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search order ID, customer, or product..."
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-3 mb-5 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-slate-400">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 min-w-[135px] outline-none focus:border-indigo-500"
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
          <label className="text-[11px] font-medium text-slate-400">
            Payment Method
          </label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 min-w-[155px] outline-none focus:border-indigo-500"
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
          <label className="text-[11px] font-medium text-slate-400">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-slate-400">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        )}
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
                  className="text-center py-12 text-slate-400"
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
            No orders match the current filters.
          </div>
        ) : (
          table.getRowModel().rows.map(({ original: order }) => {
            const canAct =
              order.status === "Pending" || order.status === "Processing";
            return (
              <div
                key={order._id}
                className="p-4 border border-slate-800 rounded-xl bg-slate-900/50 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/dashboard/orders/order/${order._id}`}
                    className="font-mono text-xs font-semibold text-indigo-400"
                  >
                    #{order.orderId?.slice(0, 8)}
                  </Link>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-sm font-medium text-white">
                  {order.user?.firstname} {order.user?.lastname}
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  {(order.items || []).map((p, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {order.itemQuantities?.[index] || 1}× {p?.title}
                      </span>
                      <span>${p?.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}{" "}
                    • {paymentMethodLabel(order.paymentMethod)}
                  </span>
                  <span className="font-bold text-sm text-white">
                    ${(order.total || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/dashboard/orders/order/${order._id}`}
                    className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium"
                  >
                    View Details
                  </Link>
                  {canAct && (
                    <button
                      onClick={() => {
                        if (order.status === "Pending") {
                          handleProcess(order._id);
                        } else if (order.status === "Processing") {
                          setDispatchOrderId(order._id);
                        }
                      }}
                      className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        order.status === "Pending"
                          ? "bg-amber-500/20 text-amber-200 border border-amber-500/30"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      {order.status === "Pending" ? "Process" : "Dispatch"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <PaginationControls
        showAll={showAll}
        url="/dashboard/orders"
        pagination={pagination}
        table={table}
        view={"Orders"}
      />
    </div>
  );
};

export default Orders;
