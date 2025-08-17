import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

export async function PATCH(req: Request) {
  try {
    const { id, newStock } = await req.json();

    const updatedProduct = await serverClient
      .patch(id)
      .inc({ inventoryInStock: newStock })
      .commit();

    return NextResponse.json(
      { success: true, updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
