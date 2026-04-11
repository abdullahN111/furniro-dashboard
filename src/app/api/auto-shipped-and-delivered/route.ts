import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

export async function GET() {
  const now = new Date();

  const orders = await serverClient.fetch(`*[_type == "order"]`);

  for (const order of orders) {
    if (!order.dispatchedAt) continue;

    const dispatchedTime = new Date(order.dispatchedAt);
    const hoursPassed =
      (now.getTime() - dispatchedTime.getTime()) / (1000 * 60 * 60);


    //Shipped → Delivered (24h)
    if (hoursPassed >= 24 && order.status !== "Delivered") {
      await serverClient.patch(order._id).set({ status: "Delivered" }).commit();
      continue;
    }

    //Dispatched → Shipped (6h)
    if (hoursPassed >= 6 && order.status === "Dispatched") {
      await serverClient.patch(order._id).set({ status: "Shipped" }).commit();
    }
    console.log("Running auto update...");
    console.log(
      "Order:",
      order._id,
      "Hours:",
      hoursPassed,
      "Status:",
      order.status,
    );
  }

  return NextResponse.json({ success: true });
}
