"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/types";

type Props = {
  siteId: string;
};

export default function ChatUI({ siteId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          question: userMsg.content,
        }),
      });

      if (!res.ok) throw new Error("RAG failed");

      const data = await res.json();

      const aiMsg: ChatMessage = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong while answering.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border rounded-xl bg-card h-162.5 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-muted text-sm">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input (Pinned) */}
      <div className="border-t p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about this website..."
          className="flex-1 border rounded-md px-3 py-2 bg-transparent"
        />
        <button
          onClick={sendMessage}
          disabled={!input || loading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Ask
        </button>
      </div>
    </section>
  );
}
