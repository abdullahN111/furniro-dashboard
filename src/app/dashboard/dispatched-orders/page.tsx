"use client";

import { useState, useEffect } from "react";
import { Order, fetchOrdersForDispatch } from "@/app/components/admin/orders/OrderData";
import { fetchShippedOrders } from "@/app/components/admin/orders/OrderData";
import { formatDate } from "@/app/lib/formatDate";
import { Button } from "@/components/ui/button";

const DispatchPage = () => {
  const [processingOrders, setProcessingOrders] = useState<Order[]>([]);
  const [shippedOrders, setShippedOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"processing" | "shipped">("processing");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        // Fetch both processing and shipped orders
        const processing = await fetchOrdersForDispatch();
        const shipped = await fetchShippedOrders();
        
        setProcessingOrders(processing);
        setShippedOrders(shipped);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, []);

  const handleDispatch = async (orderId: string) => {
    setSelectedOrder(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/dispatch`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to update order");
      const updatedOrder: Order = await res.json();
  
    
      setProcessingOrders(prev => prev.filter(order => order._id !== orderId));
      setShippedOrders(prev => [updatedOrder, ...prev]);
    } catch (e) {
      console.error("Failed to dispatch order:", e);
    } finally {
      setSelectedOrder(null);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-[--textSoft]">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-[--bg] p-4 sm:p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-[--text]">Dispatch Center</h1>

      <div className="flex border-b border-[#2e374a] mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "processing"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-[--textSoft]"
          }`}
          onClick={() => setActiveTab("processing")}
        >
          Processing Orders ({processingOrders.length})
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "shipped"
              ? "border-b-2 border-green-500 text-green-500"
              : "text-[--textSoft]"
          }`}
          onClick={() => setActiveTab("shipped")}
        >
          Dispatched Orders ({shippedOrders.length})
        </button>
      </div>
  
      {activeTab === "processing" && (
        <>
          {processingOrders.length === 0 ? (
            <div className="bg-[--bgSoft] p-6 rounded-lg text-center">
              <p className="text-lg text-[--textSoft]">No orders ready for dispatch</p>
              <p className="text-sm mt-2 text-[--textSoft]">
                All Processing orders have been dispatched
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-[--bgSoft]">
                  <tr>
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Items</th>
                    <th className="p-3 text-left">Order Date</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {processingOrders.map(order => (
                    <tr key={order._id} className="border-b border-[#2e374a]">
                      <td className="p-3">{order.orderId.slice(0, 8)}</td>
                      <td className="p-3">
                        {order.user.firstname} {order.user.lastname}
                      </td>
                      <td className="p-3">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </td>
                      <td className="p-3">{formatDate(order.createdAt)}</td>
                      <td className="p-3">
                        <Button
                          onClick={() => handleDispatch(order._id)}
                          disabled={selectedOrder === order._id}
                          className={`${
                            selectedOrder === order._id
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-green-700 hover:bg-green-800"
                          } text-white px-4 py-2 rounded-md`}
                        >
                          {selectedOrder === order._id ? "Dispatching..." : "Dispatch"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Shipped Orders Tab */}
      {activeTab === "shipped" && (
        <>
          {shippedOrders.length === 0 ? (
            <div className="bg-[--bgSoft] p-6 rounded-lg text-center">
              <p className="text-lg text-[--textSoft]">No orders have been dispatched yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-[--bgSoft]">
                  <tr>
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Items</th>
                    <th className="p-3 text-left">Order Date</th>
                    <th className="p-3 text-left">Dispatched At</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shippedOrders.map(order => (
                    <tr key={order._id} className="border-b border-[#2e374a]">
                      <td className="p-3">{order.orderId.slice(0, 8)}</td>
                      <td className="p-3">
                        {order.user.firstname} {order.user.lastname}
                      </td>
                      <td className="p-3">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </td>
                      <td className="p-3">{formatDate(order.createdAt)}</td>
                      <td className="p-3">
                        {order.dispatchedAt ? formatDate(order.dispatchedAt) : "N/A"}
                      </td>
                      <td className="p-3">
                        <span className="bg-green-900 text-green-200 px-2 py-1 rounded text-sm">
                          Shipped
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Instructions */}
      <div className="mt-8 bg-[--bgSoft] p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-[--text]">
          Dispatch Instructions
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-[--textSoft]">
          <li>Only orders in &quot;Processing&quot; status appear in the first tab</li>
          <li>Click &quot;Dispatch&quot; to mark an order as shipped</li>
          <li>Dispatched orders move to the &quot;Dispatched Orders&quot; tab</li>
          <li>Dispatched orders show the date and time they were shipped</li>
        </ul>
      </div>
    </div>
  );
};

export default DispatchPage;