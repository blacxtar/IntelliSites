"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import AnalyzeForm from "@/components/AnalyzeForm";
import AnalysisResults from "@/components/AnalysisResults";
import SkeletonCard from "@/components/SkeletonCard";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [businessModel, setBusinessModel] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
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

      const summaryRes = await analyze("What does this website do?");
      const businessRes = await analyze(
        "Who is the target audience and how may this website make money?"
      );

      setSummary(summaryRes.result);
      setBusinessModel(businessRes.result);
      setSiteId(summaryRes.siteId);
    } catch {
      setError("Failed to analyze website");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <header className="text-center mt-6 space-y-2">
        {" "}
        <h1 className="text-3xl font-bold">Website Intelligence Agent</h1>{" "}
        <p className="text-muted-foreground">
          {" "}
          Paste a website URL to get instant AI insights{" "}
        </p>{" "}
      </header>
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnalyzeForm
            url={url}
            setUrl={setUrl}
            loading={loading}
            onAnalyze={handleAnalyze}
          />

          {error && <div className="text-red-500">{error}</div>}

          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          <AnalysisResults
            summary={summary}
            businessModel={businessModel}
            siteId={siteId}
          />
        </div>
      </main>
    </>
  );
}
