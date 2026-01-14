import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "gemini-embedding-001",
    input: text,
  });

  return response.data[0].embedding;
}
