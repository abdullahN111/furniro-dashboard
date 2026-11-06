import React from "react";
import Image from "next/image";
import { fetchOrderById } from "@/app/components/admin/orders/OrderData";
import { formatDate } from "@/app/lib/formatDate";
import Link from "next/link";
import OrderActions from "@/app/components/admin/orders/OrderActions";
import { PrintInvoiceButton } from "@/app/components/admin/orders/PrintInvoiceButton";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";

const STEPS = ["Pending", "Processing", "Dispatched", "Shipped", "Delivered"];

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
  const order = await fetchOrderById(params.id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">
          The requested order record could not be located.
        </p>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          <MdArrowBack size={16} />
          Back to Orders
        </Link>
      </div>
    );
  }

  const itemSubtotals = (order.items || []).map(
    (item, index) => (item?.price || 0) * (order.itemQuantities?.[index] || 0)
  );
  const currentStepIndex = Math.max(0, STEPS.indexOf(order.status));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Order #{order.orderId}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {formatDate(order.createdAt)} • Payment via{" "}
            <span className="text-slate-200 font-medium">
              {order.paymentMethod || "Card"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors"
          >
            <MdArrowBack size={16} />
            Back
          </Link>
          <PrintInvoiceButton order={order} />
          <OrderActions orderId={order._id} status={order.status} />
        </div>
      </div>

      {/* Fulfillment Stepper */}
      <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-lg">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Fulfillment Pipeline
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STEPS.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step}
                className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  isCurrent
                    ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                    : isDone
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                      : "bg-slate-900/60 border-slate-800 text-slate-500"
                }`}
              >
                <MdCheckCircle
                  size={18}
                  className={
                    isCurrent
                      ? "text-indigo-400 shrink-0"
                      : isDone
                        ? "text-emerald-400 shrink-0"
                        : "text-slate-600 shrink-0"
                  }
                />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider opacity-75">
                    Step {idx + 1}
                  </div>
                  <div className="text-xs font-semibold truncate">{step}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-lg">
          <h2 className="text-base font-bold text-white mb-4">
            Order Line Items ({order.items?.length || 0})
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/90 text-xs uppercase text-slate-400">
                <tr className="text-left">
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Unit Price</th>
                  <th className="p-3.5">Qty</th>
                  <th className="p-3.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(order.items || []).map((item, index) => (
                  <tr key={index} className="hover:bg-slate-800/30">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <Image
                          src={item?.productImage || "/images/noproduct.jpg"}
                          alt={item?.title || "Product"}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover w-12 h-12 border border-slate-700 shrink-0"
                        />
                        <span className="font-medium text-slate-100">
                          {item?.title || "Product"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      ${(item?.price || 0).toFixed(2)}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      ×{order.itemQuantities?.[index] || 1}
                    </td>
                    <td className="p-3.5 font-semibold text-white text-right">
                      ${(itemSubtotals[index] || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-lg">
            <h2 className="text-base font-bold text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-200">
                  ${(order.total || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Standard Shipping</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3">
                <span className="font-semibold text-white">Total Paid</span>
                <span className="font-bold text-lg text-indigo-400">
                  ${(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-lg">
            <h2 className="text-base font-bold text-white mb-4">
              Customer Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-slate-400 text-xs">Full Name</div>
                <div className="font-medium text-slate-100 mt-0.5">
                  {order.user?.firstname} {order.user?.lastname}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Email Address</div>
                <div className="font-medium text-slate-100 mt-0.5">
                  {order.user?.email}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Phone Number</div>
                <div className="font-medium text-slate-100 mt-0.5">
                  {order.user?.phone || "Not provided"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-lg">
            <h2 className="text-base font-bold text-white mb-3">
              Shipping Destination
            </h2>
            <div className="space-y-1 text-sm text-slate-300 leading-relaxed">
              <div>{order.user?.streetaddress}</div>
              <div>
                {order.user?.city}, {order.user?.province}{" "}
                {order.user?.zipcode}
              </div>
              <div className="text-slate-400">{order.user?.country}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
