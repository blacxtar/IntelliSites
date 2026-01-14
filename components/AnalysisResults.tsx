import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

type Props = {
  summary?: string | null;
  businessModel?: string | null;
  siteId?: string | null;
};

export default function AnalysisResults({
  summary,
  businessModel,
  siteId,
}: Props) {
  const router = useRouter();

  if (!summary && !businessModel) return null;

  return (
    <section className="space-y-6">
      {summary && (
        <div className="border rounded-xl p-5 bg-card">
          <h2 className="text-lg font-semibold mb-3">🧠 Summary</h2>
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}

      {businessModel && (
        <div className="border rounded-xl p-5 bg-card">
          <h2 className="text-lg font-semibold mb-3">💼 Business Model</h2>
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{businessModel}</ReactMarkdown>
          </div>
        </div>
      )}

      {siteId && (
        <button
          onClick={() => router.push(`/chat?siteId=${siteId}`)}
          className="w-full py-3 rounded-lg border bg-muted hover:bg-muted/70"
        >
          💬 Ask more about this website
        </button>
      )}
    </section>
  );
}
