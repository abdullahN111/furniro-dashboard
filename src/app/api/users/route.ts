import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/utils";
import { User } from "@/app/lib/models";

export async function GET() {
  try {
    console.log("🔄 Connecting to database in API route...");
    await connectToDB();
    console.log("✅ Database connected in API route!");

    console.log("🔍 Fetching users...");
    const users = await User.find();
    console.log("✅ Users fetched successfully!");

    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ API Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: (error as Error).message },
      { status: 500 }
    );
  }
}
