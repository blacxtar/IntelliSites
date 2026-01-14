export default function SkeletonCard() {
  return (
    <div className="border rounded-xl p-5 bg-card animate-pulse">
      <div className="h-5 w-32 bg-muted rounded mb-4" />
      <div className="space-y-3">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-11/12" />
        <div className="h-3 bg-muted rounded w-10/12" />
      </div>
    </div>
  );
}
