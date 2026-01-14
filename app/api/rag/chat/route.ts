import { NextResponse } from "next/server";
import OpenAI from "openai";
import { retrieveRelevantChunks } from "@/lib/rag/retrieve";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
export async function POST(req: Request) {
  try {
    const { siteId, question } = await req.json();

    if (!siteId || !question) {
      return NextResponse.json(
        { error: "siteId and question are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Retrieve relevant chunks
    const chunks = await retrieveRelevantChunks(siteId, question);

    //testing chunks
    console.log("Retrieved chunks:");
    chunks.forEach((c, i) => {
      console.log(`Chunk ${i}:`, c.text.slice(0, 200));
    });

    // 2️⃣ Combine chunks into context
    const context = chunks.map((c) => c.text).join("\n\n");

    // 3️⃣ Ask LLM with context
    const completion = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant.
Answer the question using ONLY the provided context.
If the answer is partially available, summarize what you can find.
If the answer is not available at all, say:
"I could not find this information on the website."
`,
        },
        {
          role: "user",
          content: `
Context:
${context}

Question:
${question}
          `,
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content;

    return NextResponse.json({
      answer,
      sources: chunks.map((c) => c.id),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "RAG chat failed" }, { status: 500 });
  }
}
