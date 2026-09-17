import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/formulas?subjectSlug=matematik
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectSlug = searchParams.get("subjectSlug");
  const topicSlug = searchParams.get("topicSlug");

  const formulas = await db.formula.findMany({
    where: {
      topic: {
        subject: { slug: subjectSlug ?? undefined },
        slug: topicSlug ?? undefined,
      },
    },
    include: { topic: { include: { subject: true } } },
    orderBy: [{ topic: { order: "asc" } }, { createdAt: "asc" }],
  });
  return NextResponse.json(formulas);
}
