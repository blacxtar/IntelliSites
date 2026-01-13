import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chooseTool(userIntent: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are an AI agent.
You can choose ONLY ONE tool.
Return ONLY the tool name.
Available tools:
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

  const toolName = response?.choices?.[0]?.message?.content;

  if (!toolName) {
    throw new Error("LLM did not return a tool name");
  }

  return toolName.trim();
}
