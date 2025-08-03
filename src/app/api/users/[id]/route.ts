
import { connectToDB } from "@/app/lib/utils";
import { User } from "@/app/lib/models";
import { NextResponse } from "next/server";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    await connectToDB();
    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
};