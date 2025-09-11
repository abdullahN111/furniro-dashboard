import React from "react";
import Image from "next/image";
import { fetchOrderById } from "@/app/components/admin/orders/OrderData";
import { formatDate } from "@/app/lib/formatDate";
import Link from "next/link";

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
  const order = await fetchOrderById(params.id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-6">The requested order could not be found.</p>
        <Link
          href="/dashboard/orders"
          className="bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const itemSubtotals = order.items.map(
    (item, index) => item.price * (order.itemQuantities[index] || 0)
  );

  return (
    <div className="bg-[--bg] min-h-screen text-[--text] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Order Details</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="bg-[--bgSoft] px-3 py-1 rounded-md text-sm">
                Order ID: {order.orderId}
              </span>
              <span
                className={`px-3 py-1 rounded-md text-sm ${
                  order.status === "completed"
                    ? "bg-green-900 text-green-200"
                    : order.status === "processing"
                      ? "bg-yellow-900 text-yellow-200"
                      : "bg-blue-900 text-blue-200"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/orders"
            className="bg-[--bgSoft] hover:bg-[#182237e2] text-white px-4 py-2 rounded-md text-sm"
          >
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[--bgSoft] rounded-lg p-4 sm:p-6 border border-[#2e374a]">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full xl:min-w-[600px]">
                <thead className="bg-[#1e2943]">
                  <tr className="text-left">
                    <th className="p-3">Product</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b border-[#2e374a]">
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.productImage}
                              alt={item.title}
                              width={55}
                              height={55}
                              className="rounded-md object-cover w-[50px] h-[50px] cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            {/* <div className="text-[--textSoft] text-sm">
                              SKU: {item._id.slice(0, 8)}
                            </div> */}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">${item.price.toFixed(2)}</td>
                      <td className="p-3">{order.itemQuantities[index]}</td>
                      <td className="p-3 font-medium">
                        ${itemSubtotals[index].toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[--bgSoft] rounded-lg p-4 sm:p-6 border border-[#2e374a]">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[--textSoft]">Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[--textSoft]">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between border-t border-[#2e374a] pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[--bgSoft] rounded-lg p-4 sm:p-6 border border-[#2e374a]">
              <h2 className="text-xl font-semibold mb-4">
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-[--textSoft] text-sm">Name</div>
                  <div className="font-medium">
                    {order.user.firstname} {order.user.lastname}
                  </div>
                </div>
                <div>
                  <div className="text-[--textSoft] text-sm">Email</div>
                  <div className="font-medium">{order.user.email}</div>
                </div>
                <div>
                  <div className="text-[--textSoft] text-sm">Phone</div>
                  <div className="font-medium">{order.user.phone}</div>
                </div>
                <div>
                  <div className="text-[--textSoft] text-sm">
                    Payment Method
                  </div>
                  <div className="font-medium capitalize">
                    {order.paymentMethod}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[--bgSoft] rounded-lg p-4 sm:p-6 border border-[#2e374a]">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <div>{order.user.streetaddress}</div>
                <div>
                  {order.user.city}, {order.user.province} {order.user.zipcode}
                </div>
                <div>{order.user.country}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[--bgSoft] rounded-lg p-4 sm:p-6 border border-[#2e374a]">
            <h2 className="text-xl font-semibold mb-4">Order Date</h2>
            <p>{formatDate(order.createdAt)}</p>
          </div>
          <div className="bg-[--bgSoft] rounded-lg p-4 sm:p-6 border border-[#2e374a]">
            <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
            <p>Standard Shipping (5-7 business days)</p>
          </div>
          <div className="bg-[--bgSoft] rounded-lg p-4 sm:p-6 border border-[#2e374a]">
            <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
            <p className="text-[--textSoft]">No notes for this order</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-end">
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md">
            Print Invoice
          </button>
          <button
            className={`${
              order.status === "completed" || order.status == "processing"
                ? "bg-red-600 opacity-35 cursor-none"
                : "bg-red-700 hover:bg-red-800 cursor-pointer"
            } text-white px-5 py-2 rounded-md`}
          >
            Dispatch Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
