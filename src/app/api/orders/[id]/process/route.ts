import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";
import { requireAuth } from "@/app/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const updatedOrder = await serverClient
      .patch(params.id)
      .set({
        status: "Processing",
      })
      .commit();

    return NextResponse.json(updatedOrder);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to process order:", err);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
