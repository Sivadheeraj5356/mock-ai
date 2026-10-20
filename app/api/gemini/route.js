import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { consumeAiRequest } from "@/utils/rateLimit";
import { interviewQuestionsSchema, answerFeedbackSchema } from "@/utils/geminiClient";

const MODEL_NAME = "gemini-flash-latest";
const SCHEMAS = { questions: interviewQuestionsSchema, feedback: answerFeedbackSchema };

// Thinking tokens are billed against maxOutputTokens, so leaving thinking on left
// only part of the budget for the answer and cut long JSON off mid-string.
const baseGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 32768,
  responseMimeType: "application/json",
  thinkingConfig: { thinkingBudget: 0 },
};

const extractJson = (text) => {
  const withoutFences = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstBrace = withoutFences.search(/[{[]/);
  const lastBrace = Math.max(withoutFences.lastIndexOf("}"), withoutFences.lastIndexOf("]"));
  if (firstBrace === -1 || lastBrace === -1) throw new Error("The AI did not return any JSON.");
  return withoutFences.slice(firstBrace, lastBrace + 1);
};

const RETRYABLE = /\b(429|500|502|503|504)\b|overloaded|unavailable|fetch failed/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generateWithRetry = async (model, prompt, attempts = 3) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      const retryable = RETRYABLE.test(err?.message || "");
      if (!retryable) throw err;
      if (attempt >= attempts) throw new Error("The AI service is busy right now. Please try again in a moment.");
      await sleep(1000 * 2 ** (attempt - 1));
    }
  }
};

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "AI service is not configured." }, { status: 500 });

    const quota = await consumeAiRequest(userId);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: "Hourly AI limit reached. Please try again later." },
        { status: 429, headers: { "Retry-After": String(quota.retryAfterSeconds) } }
      );
    }

    const { kind, prompt } = await req.json();
    const responseSchema = SCHEMAS[kind];
    if (!responseSchema || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Bad request." }, { status: 400 });
    }
    if (prompt.length > 20000) {
      return NextResponse.json({ error: "Prompt too long." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { ...baseGenerationConfig, responseSchema },
    });

    const result = await generateWithRetry(model, prompt);
    const candidate = result.response?.candidates?.[0];
    if (candidate?.finishReason === "MAX_TOKENS") {
      return NextResponse.json({ error: "The AI response was cut off before it finished. Please try again." }, { status: 502 });
    }
    if (candidate?.finishReason && !["STOP", "MAX_TOKENS"].includes(candidate.finishReason)) {
      return NextResponse.json({ error: `The AI stopped early (${candidate.finishReason}). Please try again.` }, { status: 502 });
    }

    const text = result.response.text();
    try {
      return NextResponse.json(JSON.parse(extractJson(text)));
    } catch {
      return NextResponse.json({ error: "The AI returned a malformed response. Please try again." }, { status: 502 });
    }
  } catch (err) {
    return NextResponse.json({ error: err?.message || "The AI service failed. Please try again." }, { status: 500 });
  }
}
