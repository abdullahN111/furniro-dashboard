import { NextResponse } from "next/server";
import crypto from "crypto";
import { serverClient } from "@/sanity/lib/serverClient";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") || "";

  if (!cronSecret) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const expected = `Bearer ${cronSecret}`;
  const isAuthorized =
    authHeader.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected));

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const orders = await serverClient.fetch(`
    *[
      _type == "order" &&
      (status == "Dispatched" || status == "Shipped")
    ]{
      _id,
      status,
      dispatchedAt
    }
  `);

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
