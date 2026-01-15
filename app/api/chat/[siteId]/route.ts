export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { siteId: string } }
) {
  const { userId } = await auth();
  const { siteId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure user owns this site
  const site = await prisma.website.findFirst({
    where: { id: siteId, userId },
  });

  if (!site) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { siteId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    site,
    messages,
  });
}
