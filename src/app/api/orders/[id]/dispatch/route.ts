
import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedOrder = await serverClient
      .patch(params.id)
      .set({
        status: "Shipped",
        dispatchedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error("Failed to update order:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
