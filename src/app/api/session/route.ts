import { NextResponse } from "next/server";
import { getUserBySession } from "../../lib/session";

export async function GET() {
  const user = await getUserBySession();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json(user);
}
