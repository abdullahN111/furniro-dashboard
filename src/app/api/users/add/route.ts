import { NextResponse } from "next/server";
import { addUser } from "@/app/lib/actions";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    await addUser(formData);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (err.message === "FORBIDDEN") {
        return NextResponse.json(
          { error: "Only administrators can add new users" },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to add user" },
      { status: 500 }
    );
  }
}
