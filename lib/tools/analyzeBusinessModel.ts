import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function analyzeBusinessModel(text: string) {
  const response = await openai.chat.completions.create({
    model: "gemini-3-flash-preview",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: "You analyze business and monetization models.",
      },
      {
        role: "user",
        content: `
Based on this website content, answer:
- Who is the target audience?
- How does this website likely make money?

Website content:
${text}
        `,
      },
    ],
  });

  return response.choices[0].message.content;
}
