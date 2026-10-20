import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

export async function GET(_req, { params }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mockId } = await params;
  if (typeof mockId !== "string" || mockId.length > 255) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, mockId));
  const row = result[0];
  if (!row || row.createdBy !== email) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}
