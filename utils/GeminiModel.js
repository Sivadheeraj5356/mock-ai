import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_NAME = "gemini-2.5-flash";

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

const questionCount = Number(process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT) || 10;

export const interviewQuestionsSchema = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      minItems: questionCount,
      maxItems: questionCount,
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          answer: { type: "STRING" },
        },
        required: ["question", "answer"],
      },
    },
  },
  required: ["questions"],
};

export const answerFeedbackSchema = {
  type: "OBJECT",
  properties: {
    rating: { type: "STRING" },
    feedback: { type: "STRING" },
    correct_answer: { type: "STRING" },
  },
  required: ["rating", "feedback", "correct_answer"],
};

const extractJson = (text) => {
  const withoutFences = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstBrace = withoutFences.search(/[{[]/);
  const lastBrace = Math.max(withoutFences.lastIndexOf("}"), withoutFences.lastIndexOf("]"));

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("The AI did not return any JSON.");
  }
  return withoutFences.slice(firstBrace, lastBrace + 1);
};

const RETRYABLE = /\b(429|500|502|503|504)\b|overloaded|unavailable|fetch failed/i;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Gemini returns 503 fairly often under load, so a couple of retries turns a hard
// failure into a slightly slower success.
const generateWithRetry = async (model, prompt, attempts = 3) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      const retryable = RETRYABLE.test(err?.message || "");
      if (!retryable) throw err;
      if (attempt >= attempts) {
        throw new Error("The AI service is busy right now. Please try again in a moment.");
      }
      await sleep(1000 * 2 ** (attempt - 1));
    }
  }
};

/**
 * Sends a prompt and returns parsed JSON matching responseSchema.
 * Throws an Error with a user-readable message instead of leaking a raw parse error.
 */
export async function generateJson(prompt, responseSchema) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { ...baseGenerationConfig, responseSchema },
  });

  const result = await generateWithRetry(model, prompt);
  const candidate = result.response?.candidates?.[0];

  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new Error("The AI response was cut off before it finished. Please try again.");
  }
  if (candidate?.finishReason && !["STOP", "MAX_TOKENS"].includes(candidate.finishReason)) {
    throw new Error(`The AI stopped early (${candidate.finishReason}). Please try again.`);
  }

  const text = result.response.text();
  try {
    return JSON.parse(extractJson(text));
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    throw new Error("The AI returned a malformed response. Please try again.");
  }
}
