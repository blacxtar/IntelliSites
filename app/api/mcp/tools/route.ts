import { NextResponse } from "next/server";
import { mcpTools } from "@/lib/mcp/tools";

export async function GET() {
  return NextResponse.json({
    tools: mcpTools,
  });
}
