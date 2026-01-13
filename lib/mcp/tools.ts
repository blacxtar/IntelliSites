export type MCPTool = {
  name: string;
  description: string;
  inputSchema: Record<string, string>;
};

export const mcpTools: MCPTool[] = [
  {
    name: "analyzeSummary",
    description: "Summarize what the website is about",
    inputSchema: {
      text: "Clean website text content",
    },
  },
  {
    name: "analyzeBusinessModel",
    description: "Analyze target audience and monetization",
    inputSchema: {
      text: "Clean website text content",
    },
  },
];
