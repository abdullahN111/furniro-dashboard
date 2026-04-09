import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

export async function GET() {
  const now = new Date();

  const orders = await serverClient.fetch(`*[_type == "order"]`);

  for (const order of orders) {
    if (order.status === "Dispatched" && order.dispatchedAt) {
      const dispatchedTime = new Date(order.dispatchedAt);

      const hoursPassed =
        (now.getTime() - dispatchedTime.getTime()) / (1000 * 60 * 60);

      // After 6 hours → Shipped
      if (hoursPassed >= 6 && order.status === "Dispatched") {
        await serverClient
          .patch(order._id)
          .set({ status: "Shipped" })
          .commit();
      }

      // fter 24 hours → Delivered
      if (hoursPassed >= 24 && order.status === "Shipped") {
        await serverClient
          .patch(order._id)
          .set({ status: "Delivered" })
          .commit();
      }
    }
  }

  return NextResponse.json({ success: true });
}