import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

const getEmail = async () => {
  const user = await currentUser();
  return user?.primaryEmailAddress?.emailAddress || null;
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = await getEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));
  return NextResponse.json(result);
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = await getEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { jsonMockResp, jobPosition, jobDesc, jobExperience } = body || {};
  if (typeof jsonMockResp !== "string" || !jsonMockResp.trim()
    || typeof jobPosition !== "string" || !jobPosition.trim()
    || typeof jobDesc !== "string" || typeof jobExperience !== "string") {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }
  if (jsonMockResp.length > 100000 || jobPosition.length > 255 || jobDesc.length > 255 || jobExperience.length > 255) {
    return NextResponse.json({ error: "Fields too long" }, { status: 400 });
  }

  const now = new Date();
  const createdAt = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  const resp = await db.insert(MockInterview).values({
    mockId: crypto.randomUUID(),
    jsonMockResp,
    jobPosition,
    jobDesc,
    jobExperience,
    createdBy: email,
    createdAt,
  }).returning({ mockId: MockInterview.mockId });

  return NextResponse.json({ mockId: resp?.[0]?.mockId || null });
}
