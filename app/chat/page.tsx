"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChatUI from "@/components/ChatUI";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialSiteId = searchParams.get("siteId");

  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState<string | null>(initialSiteId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyzeSite() {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/fetch-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          question: "What does this website do?",
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze");

      const data = await res.json();
      setSiteId(data.siteId);
    } catch {
      setError("Failed to analyze website");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">💬 Chat with Website</h1>

          {!siteId && (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Paste a website URL to start chatting with it.
              </p>

              <div className="flex gap-2">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 border rounded-md px-4 py-2 bg-transparent"
                />
                <button
                  onClick={analyzeSite}
                  disabled={!url || loading}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
                >
                  {loading ? "Analyzing..." : "Start Chat"}
                </button>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
          )}
          {siteId && (
            <div className="border rounded-md p-3 bg-green-500/10 text-green-600 text-sm">
              ✅ Website analyzed successfully. You can now chat with it.
            </div>
          )}

          {siteId && <ChatUI siteId={siteId} />}
        </div>
      </main>
    </>
  );
}
