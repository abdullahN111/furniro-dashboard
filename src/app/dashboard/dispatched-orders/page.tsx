"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Order,
  fetchDispatchedOrders,
  fetchShippedOrders,
  fetchDeliveredOrders,
} from "@/app/components/admin/orders/OrderData";
import { formatDate } from "@/app/lib/formatDate";
import ReportCards from "@/app/components/admin/card/ReportCard";
import LocalSearchBar from "@/app/dashboard/search/LocalSearchBar";
import Link from "next/link";
import { MdLocalShipping, MdCheckCircle, MdInventory } from "react-icons/md";

const DispatchPage = () => {
  const [dispatchedOrders, setDispatchedOrders] = useState<Order[]>([]);
  const [shippedOrders, setShippedOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<
    "dispatched" | "shipped" | "delivered"
  >("dispatched");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const [dispatched, shipped, delivered] = await Promise.all([
          fetchDispatchedOrders(),
          fetchShippedOrders(),
          fetchDeliveredOrders(),
        ]);

        setDispatchedOrders(dispatched);
        setShippedOrders(shipped);
        setDeliveredOrders(delivered);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const currentList = useMemo(() => {
    const raw =
      activeTab === "dispatched"
        ? dispatchedOrders
        : activeTab === "shipped"
          ? shippedOrders
          : deliveredOrders;

    if (!searchQuery.trim()) return raw;
    const q = searchQuery.toLowerCase();
    return raw.filter(
      (o) =>
        (o.orderId || "").toLowerCase().includes(q) ||
        `${o.user?.firstname || ""} ${o.user?.lastname || ""}`
          .toLowerCase()
          .includes(q)
    );
  }, [activeTab, dispatchedOrders, shippedOrders, deliveredOrders, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-6">
        <ReportCards />
        <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReportCards />

      <div className="bg-[#111827] border border-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Fulfillment &amp; Dispatch Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Monitor orders across Dispatched, Shipped, and Delivered stages
            </p>
          </div>
          <LocalSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Filter by order ID or customer..."
          />
        </div>

        {/* Stage Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-5">
          <button
            className={`inline-flex items-center gap-2 py-2 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              activeTab === "dispatched"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/35"
                : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
            onClick={() => setActiveTab("dispatched")}
          >
            <MdInventory size={16} />
            <span>Dispatched ({dispatchedOrders.length})</span>
          </button>

          <button
            className={`inline-flex items-center gap-2 py-2 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              activeTab === "shipped"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/35"
                : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
            onClick={() => setActiveTab("shipped")}
          >
            <MdLocalShipping size={16} />
            <span>Shipped ({shippedOrders.length})</span>
          </button>

          <button
            className={`inline-flex items-center gap-2 py-2 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              activeTab === "delivered"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/35"
                : "bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
            onClick={() => setActiveTab("delivered")}
          >
            <MdCheckCircle size={16} />
            <span>Delivered ({deliveredOrders.length})</span>
          </button>
        </div>

        {/* Orders List */}
        <div className="rounded-xl border border-slate-800/80 overflow-hidden">
          {currentList.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40">
              <h3 className="text-base font-semibold text-white">
                No {activeTab} orders found
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                {searchQuery
                  ? "No shipments match your search query."
                  : `Orders marked as ${activeTab} will automatically appear here.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800/80 text-sm">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Dispatched At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentList.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 whitespace-nowrap font-mono text-xs font-semibold text-indigo-400">
                        #{order.orderId?.slice(0, 8) || order._id.slice(0, 8)}
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-200 font-medium">
                        {order.user?.firstname} {order.user?.lastname}
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-300 text-xs">
                        {(order.items || []).length} item
                        {(order.items || []).length !== 1 ? "s" : ""}
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-100 font-semibold">
                        ${(order.total || 0).toFixed(2)}
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs text-slate-400">
                        {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs text-slate-400">
                        {order.dispatchedAt
                          ? formatDate(order.dispatchedAt)
                          : "—"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border ${
                            activeTab === "dispatched"
                              ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                              : activeTab === "shipped"
                                ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                                : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap text-right">
                        <Link
                          href={`/dashboard/orders/order/${order._id}`}
                          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchPage;
