import { NextResponse } from "next/server";
import { analyzeSummary } from "@/lib/tools/analyzeSummary";
import { analyzeBusinessModel } from "@/lib/tools/analyzeBusinessModel";

export async function POST(req: Request) {
  const { toolName, input } = await req.json();

  if (!toolName || !input?.text) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400 });
  }

  switch (toolName) {
    case "analyzeSummary":
      return NextResponse.json({
        result: await analyzeSummary(input.text),
      });

    case "analyzeBusinessModel":
      return NextResponse.json({
        result: await analyzeBusinessModel(input.text),
      });

    default:
      return NextResponse.json({ error: "Unknown tool" }, { status: 400 });
  }
}
