type Props = {
  url: string;
  setUrl: (v: string) => void;
  loading: boolean;
  onAnalyze: () => void;
};

export default function AnalyzeForm({
  url,
  setUrl,
  loading,
  onAnalyze,
}: Props) {
  return (
    <div className="flex gap-2">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="flex-1 border rounded-md px-4 py-2 bg-transparent"
      />
      <button
        onClick={onAnalyze}
        disabled={loading || !url}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
}
