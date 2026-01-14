import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function chooseTool(userIntent: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gemini-3-flash-preview",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are a tool router.
Your ONLY job is to choose the correct tool name.

Rules:
- You MUST return exactly one of these values
- Do NOT ask questions
- Do NOT explain anything
- Do NOT mention missing data

Allowed outputs:
- analyzeSummary
- analyzeBusinessModel
        `,
      },
      {
        role: "user",
        content: userIntent,
      },
    ],
  });

  const raw = response?.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("LLM did not return a tool name");
  }

  const tool = raw.trim();

  // 🔐 Hard guard (important)
  if (tool !== "analyzeSummary" && tool !== "analyzeBusinessModel") {
    console.warn("Invalid tool from LLM:", tool);
    return "analyzeSummary"; // safe default
  }

  return tool;
}
