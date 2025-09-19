"use client";

import { useState, useEffect } from "react";
import { fetchOrders, Order } from "@/app/components/admin/orders/OrderData";
import { MdShoppingCart, MdLocalShipping, MdAttachMoney } from "react-icons/md";

const ReportCards = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };
    getOrders();
  }, []);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "Dispatched"
  ).length;
  const totalRevenue = orders
    .filter((order) => order.status === "Dispatched")
    .reduce((sum, order) => sum + order.total, 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-[--bgSoft] p-4 rounded-[10px] animate-pulse"
          >
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-[--bgSoft] hover:bg-[#2e374a] border border-[#2e374a] p-6 rounded-xl flex flex-col justify-between shadow-md transition-colors min-h-[140px]">
        <div className="flex items-center gap-3">
          <MdShoppingCart size={28} className="text-blue-400" />
          <span className="text-sm font-medium">Total Orders</span>
        </div>
        <div>
          <span className="text-2xl font-bold">{totalOrders}</span>
          <p className="text-xs text-gray-400 mt-1">All orders received</p>
        </div>
      </div>

      <div className="bg-[--bgSoft] hover:bg-[#2e374a] border border-[#2e374a] p-6 rounded-xl flex flex-col justify-between shadow-md transition-colors min-h-[140px]">
        <div className="flex items-center gap-3">
          <MdLocalShipping size={28} className="text-green-400" />
          <span className="text-sm font-medium">Delivered Orders</span>
        </div>
        <div>
          <span className="text-2xl font-bold">{deliveredOrders}</span>
          <p className="text-xs text-gray-400 mt-1">Successfully delivered</p>
        </div>
      </div>

      <div className="bg-[--bgSoft] hover:bg-[#2e374a] border border-[#2e374a] p-6 rounded-xl flex flex-col justify-between shadow-md transition-colors min-h-[140px]">
        <div className="flex items-center gap-3">
          <MdAttachMoney size={28} className="text-yellow-400" />
          <span className="text-sm font-medium">Total Revenue</span>
        </div>
        <div>
          <span className="text-2xl font-bold">${totalRevenue.toFixed(2)}</span>
          <p className="text-xs text-gray-400 mt-1">
            From all delivered orders
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportCards;
