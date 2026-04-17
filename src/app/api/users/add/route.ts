import { addUser } from "@/app/lib/actions";

export async function POST(req: Request) {
  const formData = await req.formData();

  try {
    await addUser(formData);
    return Response.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}