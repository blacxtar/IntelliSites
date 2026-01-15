import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="p-6 text-center">
        Please sign in to view your history.
      </div>
    );
  }

  const websites = await prisma.website.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My History</h1>

      {websites.length === 0 && (
        <p className="text-muted-foreground">
          You haven’t analyzed any websites yet.
        </p>
      )}

      <div className="space-y-3">
        {websites.map((site) => (
          <Link
            key={site.id}
            href={`/chat/${site.id}`}
            className="block border rounded-lg p-4 hover:bg-muted transition"
          >
            <p className="font-medium">{site.url}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(site.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
