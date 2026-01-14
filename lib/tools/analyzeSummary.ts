import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function analyzeSummary(text: string) {
  const response = await openai.chat.completions.create({
    model: "gemini-3-flash-preview",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: "You summarize websites clearly and concisely.",
      },
      {
        role: "user",
        content: `
Summarize this website in 3–4 lines.
Website content:
${text}
        `,
      },
    ],
  });

  return response.choices[0].message.content;
}
