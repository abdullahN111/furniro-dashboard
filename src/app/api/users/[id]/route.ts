import mongoose from "mongoose";
import { connectToDB } from "@/app/lib/utils";
import { User } from "@/app/lib/models";
import { requireAuth } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export const GET = async (
  _request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await requireAuth();

    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findById(params.id)
      .select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -__v")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
};
