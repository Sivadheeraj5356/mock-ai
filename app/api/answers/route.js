import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";

const getEmail = async () => {
  const user = await currentUser();
  return user?.primaryEmailAddress?.emailAddress || null;
};

const ownsInterview = async (mockId, email) => {
  const rows = await db.select().from(MockInterview).where(eq(MockInterview.mockId, mockId));
  return rows[0] && rows[0].createdBy === email;
};

export async function GET(req) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = await getEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mockId = new URL(req.url).searchParams.get("mockId");
  if (typeof mockId !== "string" || !mockId || mockId.length > 255) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  if (!(await ownsInterview(mockId, email))) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await db.select().from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, mockId))
    .orderBy(UserAnswer.id);
  return NextResponse.json(result);
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const email = await getEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { mockIdRef, question, correctAns, userAns, feedback, rating } = body || {};
  if (typeof mockIdRef !== "string" || !mockIdRef || mockIdRef.length > 255
    || typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }
  if (!(await ownsInterview(mockIdRef, email))) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const createdAt = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
  await db.insert(UserAnswer).values({
    mockIdRef,
    question: String(question).slice(0, 5000),
    correctAns: typeof correctAns === "string" ? correctAns : null,
    userAns: typeof userAns === "string" ? userAns : null,
    feedback: typeof feedback === "string" ? feedback : null,
    rating: rating == null ? null : String(rating).slice(0, 10),
    userEmail: email,
    createdAt,
  });
  return NextResponse.json({ ok: true });
}
