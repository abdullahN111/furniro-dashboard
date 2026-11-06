export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/utils";
import { User } from "@/app/lib/models";
import { requireAuth } from "@/app/lib/auth";

export async function GET() {
  try {
    await requireAuth();
    await connectToDB();

    const users = await User.find()
      .select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -__v")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("API Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
