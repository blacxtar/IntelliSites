"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

function SkeletonCard({ title }: { title: string }) {
  return (
    <div className="border rounded-xl p-5 bg-card animate-pulse">
      <div className="h-5 w-32 bg-muted rounded mb-4" />

      <div className="space-y-3">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-11/12" />
        <div className="h-3 bg-muted rounded w-10/12" />
        <div className="h-3 bg-muted rounded w-9/12" />
      </div>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [businessModel, setBusinessModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze(question: string) {
    const res = await fetch("/api/fetch-site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, question }),
    });

    if (!res.ok) throw new Error("Request failed");
    return res.json();
  }

  async function handleAnalyze() {
    try {
      setLoading(true);
      setError(null);
      setSummary(null);
      setBusinessModel(null);

      const summaryRes = await analyze("What does this website do?");
      const businessRes = await analyze(
        "Who is the target audience and how may this website make money?"
      );

      setSummary(summaryRes.result);
      setBusinessModel(businessRes.result);
    } catch (err) {
      setError("Failed to analyze website");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Website Intelligence Agent</h1>
          <p className="text-muted-foreground">
            Paste a website URL to get instant AI insights
          </p>
        </header>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 border rounded-md px-4 py-2 bg-transparent"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="border border-red-500/30 text-red-500 p-3 rounded-md">
            {error}
          </div>
        )}
        {/* Results */}
        {loading && (
          <section className="grid grid-cols-1  gap-6">
            <SkeletonCard title="Summary" />
            <SkeletonCard title="Business Model" />
          </section>
        )}

        {!loading && (summary || businessModel) && (
          <section className="grid grid-cols-1 gap-6">
            {summary && (
              <div className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold mb-3">🧠 Summary</h2>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              </div>
            )}

            {businessModel && (
              <div className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold mb-3">
                  💼 Business Model
                </h2>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{businessModel}</ReactMarkdown>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
