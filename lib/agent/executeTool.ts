import { analyzeSummary } from "@/lib/tools/analyzeSummary";
import { analyzeBusinessModel } from "@/lib/tools/analyzeBusinessModel";

export async function executeTool(toolName: string, text: string) {
  console.log("toolname", toolName);
  switch (toolName) {
    case "analyzeSummary":
      return await analyzeSummary(text);

    case "analyzeBusinessModel":
      return await analyzeBusinessModel(text);

    default:
      throw new Error("Unknown tool");
  }
}
