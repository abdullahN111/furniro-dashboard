"use client";

import { useState, useEffect } from "react";
import {
  Order,
  fetchDispatchedOrders,
  fetchShippedOrders,
  fetchDeliveredOrders,
} from "@/app/components/admin/orders/OrderData";
import { formatDate } from "@/app/lib/formatDate";
import ReportCards from "@/app/components/admin/card/ReportCard";

const DispatchPage = () => {
  const [dispatchedOrders, setDispatchedOrders] = useState<Order[]>([]);

  const [shippedOrders, setShippedOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);

  const [activeTab, setActiveTab] = useState<
    "ready" | "dispatched" | "shipped" | "delivered"
  >("dispatched");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        await fetch("/api/auto-shipped-and-delivered");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="py-6">
        <ReportCards />
      </div>
      <div className="border border-[#2e374a] p-4 sm:p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--textSoft]">
            Order Dispatch Center
          </h1>
          <p className="text-white mt-1">Manage order dispatch status</p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === "dispatched"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-white hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("dispatched")}
          >
            Dispatched ({dispatchedOrders.length})
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === "shipped"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-white hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("shipped")}
          >
            Shipped ({shippedOrders.length})
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === "delivered"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-white hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("delivered")}
          >
            Delivered ({deliveredOrders.length})
          </button>
        </div>

        {activeTab === "delivered" && (
          <div className="bg-[--bgSoft] border border-[#2e374a] rounded-lg overflow-hidden">
            {deliveredOrders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  No delivered orders yet
                </h3>
                <p className="mt-1 text-[--textSoft]">
                  Orders marked as delivered will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2e374a]">
                  <thead className="bg-[--bgSoft]">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Order Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[--bgSoft] divide-y divide-[#2e374a]">
                    {deliveredOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-white">
                          {order.orderId}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {order.user.firstname} {order.user.lastname}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-medium">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Delivered
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === "shipped" && (
          <div className="bg-[--bgSoft] border border-[#2e374a] rounded-lg overflow-hidden">
            {shippedOrders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  All orders are delivered!
                </h3>
                <p className="mt-1 text-[--textSoft]">
                  No orders waiting to be delivered.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2e374a]">
                  <thead className="bg-[--bgSoft]">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Order Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[--bgSoft] divide-y divide-[#2e374a]">
                    {shippedOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-white">
                          {order.orderId}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {order.user.firstname} {order.user.lastname}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-medium">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Shipped
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "dispatched" && (
          <div className="bg-[--bgSoft] rounded-lg overflow-hidden">
            {dispatchedOrders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  No dispatched orders yet
                </h3>
                <p className="mt-1 text-[--textSoft]">
                  Orders marked as dispatched will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2e374a]">
                  <thead className="bg-[--bgSoft]">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Order Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Dispatched Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-[--textSoft] uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[--bgSoft]">
                    {dispatchedOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-white">
                          {order.orderId}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {order.user.firstname} {order.user.lastname}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-white">
                          {order.dispatchedAt
                            ? formatDate(order.dispatchedAt)
                            : "N/A"}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Dispatched
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatchPage;
