// Client-safe helper: calls the server route so the Gemini API key never ships
// to the browser. Schemas are not secrets, so they stay shared.
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

export async function generateJson(kind, prompt) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, prompt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "The AI service failed. Please try again.");
  }
  return data;
}
