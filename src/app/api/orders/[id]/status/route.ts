import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";
import { requireAuth } from "@/app/lib/auth";

const ALLOWED_STATUSES = [
  "Pending",
  "Processing",
  "Dispatched",
  "Shipped",
  "Delivered",
];

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await req.json();
    const nextStatus = String(body?.status || "");

    if (!ALLOWED_STATUSES.includes(nextStatus)) {
      return NextResponse.json(
        { error: "Invalid order status value" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patchData: Record<string, any> = {
      status: nextStatus,
    };

    if (nextStatus === "Dispatched") {
      patchData.dispatchedAt = new Date().toISOString();
    }

    if (nextStatus === "Delivered") {
      patchData.paid = true;
      patchData.paymentStatus = "Paid";
    }

    const updatedOrder = await serverClient
      .patch(params.id)
      .set(patchData)
      .commit();

    return NextResponse.json(updatedOrder);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to update order status:", err);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
