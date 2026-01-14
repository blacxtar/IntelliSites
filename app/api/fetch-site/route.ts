import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { chooseTool } from "@/lib/agent/chooseTool";
import { executeTool } from "@/lib/agent/executeTool";
import { chunkText } from "@/lib/rag/chunkText";
import { saveChunks } from "@/lib/rag/store";
import { randomUUID } from "crypto";
import { embedText } from "@/lib/rag/embeddings";

export async function POST(req: Request) {
  try {
    const { url, question } = await req.json();

    if (!url || !question) {
      return NextResponse.json(
        { error: "URL and question are required" },
        { status: 400 }
      );
    }

    // Fetch website
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: { "User-Agent": "Website-Intelligence-Agent/1.0" },
    });

    const $ = cheerio.load(html);
    $("script, style, noscript").remove();

    const text = $("body").text().replace(/\s+/g, " ").trim().slice(0, 6000);

    // chunking and saving
    const siteId = randomUUID();
    const chunks = await Promise.all(
      chunkText(text).map(async (chunk, index) => ({
        id: `${siteId}-${index}`,
        text: chunk,
        embedding: await embedText(chunk),
      }))
    );

    saveChunks(siteId, chunks);

    // 🧠 AGENT THINKING
    const chosenTool = await chooseTool(question);

    // 🛠️ TOOL EXECUTION
    const result = await executeTool(chosenTool, text);

    return NextResponse.json({
      siteId,
      toolUsed: chosenTool,
      result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Agent execution failed" },
      { status: 500 }
    );
  }
}
