import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";
import { requireAuth } from "@/app/lib/auth";

export async function PATCH(req: Request) {
  try {
    await requireAuth();

    const { id, newStock } = await req.json();

    if (!id || typeof id !== "string" || !Number.isInteger(newStock)) {
      return NextResponse.json(
        { success: false, message: "Valid product ID and integer stock adjustment required" },
        { status: 400 }
      );
    }

    const current = await serverClient.fetch<{ inventoryInStock?: number } | null>(
      `*[_type == "product" && _id == $id][0]{ inventoryInStock }`,
      { id }
    );

    if (!current) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const nextStock = (current.inventoryInStock ?? 0) + newStock;
    if (nextStock < 0) {
      return NextResponse.json(
        { success: false, message: "Resulting stock cannot be negative" },
        { status: 400 }
      );
    }

    const updatedProduct = await serverClient
      .patch(id)
      .set({ inventoryInStock: nextStock })
      .commit();

    return NextResponse.json(
      { success: true, updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update stock" },
      { status: 500 }
    );
  }
}
