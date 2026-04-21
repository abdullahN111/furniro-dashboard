import { deleteClient } from '@/sanity/lib/deleteClient';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing product ID" },
        { status: 400 }
      );
    }

    await deleteClient.delete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Delete error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
