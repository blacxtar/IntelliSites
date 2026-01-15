export const runtime = "nodejs";

import prisma from "@/lib/prisma";

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

    await prisma.chatMessage.create({
      data: {
        siteId,
        role: "user",
        content: question,
      },
    });

    // 1️⃣ Retrieve relevant chunks
    const chunks = await retrieveRelevantChunks(siteId, question);

    // 2️⃣ Combine chunks into context
    const context = chunks.map((c) => c.text).join("\n\n");

    // 3️⃣ Ask LLM with context
    const stream = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      temperature: 0.2,
      stream: true,
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

    const encoder = new TextEncoder();

    let fullAnswer = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices?.[0]?.delta?.content;
            if (token) {
              fullAnswer += token;
              controller.enqueue(encoder.encode(token));
            }
          }

          // ✅ Save assistant message after streaming finishes
          await prisma.chatMessage.create({
            data: {
              siteId,
              role: "assistant",
              content: fullAnswer || "No answer generated.",
            },
          });

          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "RAG chat failed" }, { status: 500 });
  }
}
