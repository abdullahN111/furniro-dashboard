import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const orders = await serverClient.fetch(`*[_type == "order"]`);

  for (const order of orders) {
    if (!order.dispatchedAt) continue;

    const dispatchedTime = new Date(order.dispatchedAt);
    const hoursPassed =
      (now.getTime() - dispatchedTime.getTime()) / (1000 * 60 * 60);

    // Shipped → Delivered (24h)
    if (hoursPassed >= 24 && order.status === "Shipped") {
      await serverClient.patch(order._id).set({ status: "Delivered" }).commit();
      continue;
    }

    // Dispatched → Shipped (6h)
    if (hoursPassed >= 6 && order.status === "Dispatched") {
      await serverClient.patch(order._id).set({ status: "Shipped" }).commit();
    }
  }

  return NextResponse.json({ success: true });
}