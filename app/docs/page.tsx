import Navbar from "@/components/Navbar";

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">📘 IntelliSites Documentation</h1>

          {/* Overview */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">What is IntelliSites?</h2>
            <p className="text-muted-foreground">
              IntelliSites is an AI-powered Website Intelligence platform that
              analyzes websites and enables contextual question-answering using
              Retrieval-Augmented Generation (RAG).
            </p>
          </section>

          {/* How it works */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-1 text-muted-foreground">
              <li>Website content is fetched and cleaned</li>
              <li>Text is split into overlapping chunks</li>
              <li>Each chunk is converted into an embedding</li>
              <li>
                User questions are embedded and matched using cosine similarity
              </li>
              <li>
                Top relevant chunks are passed to the LLM to generate grounded
                answers
              </li>
            </ol>
          </section>

          {/* RAG */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">RAG Architecture</h2>
            <p className="text-muted-foreground">
              Instead of relying on the LLM’s internal knowledge, IntelliSites
              retrieves only relevant website content and forces the model to
              answer strictly from that context, reducing hallucinations.
            </p>
          </section>

          {/* MCP */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">MCP Support</h2>
            <p className="text-muted-foreground">
              IntelliSites exposes its analysis tools through an MCP-compatible
              interface, allowing external AI agents to discover and invoke its
              capabilities programmatically.
            </p>
          </section>

          {/* Tech */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Tech Stack</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Next.js (App Router)</li>
              <li>TypeScript</li>
              <li>Gemini LLM (OpenAI-compatible API)</li>
              <li>Custom RAG pipeline (no abstractions)</li>
              <li>Tailwind CSS</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
