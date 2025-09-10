"use client";

import { useState, useEffect } from "react";
import { Order, fetchReadyToShipOrders, fetchDispatchedOrders } from "@/app/components/admin/orders/OrderData";
import { formatDate } from "@/app/lib/formatDate";
import { Button } from "@/components/ui/button";

const DispatchPage = () => {
  const [readyToShipOrders, setReadyToShipOrders] = useState<Order[]>([]);
  const [dispatchedOrders, setDispatchedOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"shipped" | "dispatched">("dispatched");
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const [ready, dispatched] = await Promise.all([
          fetchReadyToShipOrders(),
          fetchDispatchedOrders()
        ]);
        
        setReadyToShipOrders(ready);
        setDispatchedOrders(dispatched);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, []);

  const handleDispatch = async (orderId: string) => {
    setProcessingOrder(orderId);
    try {
      const res = await fetch(`/api/order/${orderId}/dispatch`, { 
        method: "POST" 
      });
      
      if (!res.ok) throw new Error("Failed to dispatch order");
      
      const updatedOrder: Order = await res.json();
      
      
      setReadyToShipOrders(prev => prev.filter(order => order._id !== orderId));
      setDispatchedOrders(prev => [updatedOrder, ...prev]);
    } catch (error) {
      console.error("Failed to dispatch order:", error);
    } finally {
      setProcessingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Dispatch Center</h1>
        <p className="text-gray-600 mt-1">Manage order dispatch status</p>
      </div>

   
      <div className="flex border-b border-gray-200 mb-6">
       
        <button
          className={`py-3 px-6 font-medium text-sm ${activeTab === "dispatched"
            ? "border-b-2 border-green-500 text-green-600"
            : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("dispatched")}
        >
          Dispatched Orders ({dispatchedOrders.length})
        </button>
         <button
          className={`py-3 px-6 font-medium text-sm ${activeTab === "shipped"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("shipped")}
        >
          Shipped Orders ({readyToShipOrders.length})
        </button>
      </div>

      {/* Ready to Dispatch Orders */}
      {activeTab === "shipped" && (
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          {readyToShipOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">All orders are processed!</h3>
              <p className="mt-1 text-gray-500">No orders waiting to be dispatched.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {readyToShipOrders.map(order => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user.firstname} {order.user.lastname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => handleDispatch(order._id)}
                          disabled={processingOrder === order._id}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                          {processingOrder === order._id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : "Mark as Dispatched"}
                        </Button>
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
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          {dispatchedOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No dispatched orders yet</h3>
              <p className="mt-1 text-gray-500">Orders marked as dispatched will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dispatched Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dispatchedOrders.map(order => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user.firstname} {order.user.lastname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.dispatchedAt ? formatDate(order.dispatchedAt) : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
      

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{readyToShipOrders.length + dispatchedOrders.length}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Ready to Dispatch</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">{readyToShipOrders.length}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Dispatched</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">{dispatchedOrders.length}</dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchPage;