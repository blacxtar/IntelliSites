"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ChatUI from "@/components/ChatUI";
import { ChatMessage } from "@/lib/types";
import ChatSidebar from "@/components/chat/ChatSideBar";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialSiteId = searchParams.get("siteId");

  const [url, setUrl] = useState("");
  const [siteId, setSiteId] = useState<string | null>(initialSiteId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; url: string }[]>([]);

  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function loadHistory() {
      const res = await fetch("/api/history");
      if (!res.ok) return;
      const data = await res.json();
      setHistory(data);
    }

    loadHistory();
  }, []);

  useEffect(() => {
    if (!siteId) return;

    async function loadMessages() {
      const res = await fetch(`/api/chat/${siteId}`);
      if (!res.ok) return;

      const data = await res.json();
      setInitialMessages(data.messages);
    }

    loadMessages();
  }, [siteId]);

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
      setInitialMessages([]);
    } catch {
      setError("Failed to analyze website");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <ChatSidebar
          sites={history}
          activeSiteId={siteId}
          onSelect={(id) => setSiteId(id)}
        />

        {/* Main Content */}
        <section className="flex-1 overflow-y-auto p-6">
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

            {siteId && (
              <ChatUI siteId={siteId} initialMessages={initialMessages} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
