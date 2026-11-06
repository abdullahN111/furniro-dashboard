"use client";

import { useState, useEffect } from "react";
import { fetchOrders, Order } from "@/app/components/admin/orders/OrderData";
import {
  MdShoppingCart,
  MdLocalShipping,
  MdAttachMoney,
  MdPendingActions,
} from "react-icons/md";

const ReportCards = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders for report cards:", err);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (order) => order.status !== "Delivered"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;
  const totalRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + (order.total || 0), 0);
  const grossVolume = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-[#111827] border border-slate-800 p-5 rounded-2xl animate-pulse min-h-[132px]"
          >
            <div className="h-5 bg-slate-800 rounded w-1/3 mb-4" />
            <div className="h-8 bg-slate-800 rounded w-1/2 mb-2" />
            <div className="h-4 bg-slate-800 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="bg-[#111827] hover:bg-slate-900/90 border border-slate-800/90 p-5 rounded-2xl flex flex-col justify-between shadow-lg transition-all min-h-[132px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Orders
          </span>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MdShoppingCart size={20} />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {totalOrders}
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Gross volume: ${grossVolume.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-[#111827] hover:bg-slate-900/90 border border-slate-800/90 p-5 rounded-2xl flex flex-col justify-between shadow-lg transition-all min-h-[132px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            In Fulfillment
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MdPendingActions size={20} />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {activeOrders}
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Pending, processing &amp; in transit
          </p>
        </div>
      </div>

      <div className="bg-[#111827] hover:bg-slate-900/90 border border-slate-800/90 p-5 rounded-2xl flex flex-col justify-between shadow-lg transition-all min-h-[132px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Delivered Orders
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MdLocalShipping size={20} />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {deliveredOrders}
          </span>
          <p className="text-xs text-slate-400 mt-1">
            {totalOrders > 0
              ? `${Math.round((deliveredOrders / totalOrders) * 100)}% completion rate`
              : "No orders completed yet"}
          </p>
        </div>
      </div>

      <div className="bg-[#111827] hover:bg-slate-900/90 border border-slate-800/90 p-5 rounded-2xl flex flex-col justify-between shadow-lg transition-all min-h-[132px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Realized Revenue
          </span>
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <MdAttachMoney size={20} />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-bold text-white">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-xs text-slate-400 mt-1">
            From all delivered orders
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportCards;
