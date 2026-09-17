import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/topics/[slug]?subjectSlug=matematik
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const subjectSlug = searchParams.get("subjectSlug");

  const topic = await db.topic.findFirst({
    where: { slug, subject: { slug: subjectSlug ?? undefined } },
    include: {
      subject: true,
      lessons: { orderBy: { order: "asc" }, include: { sections: { orderBy: { order: "asc" } } } },
      quizQuestions: { orderBy: { createdAt: "asc" } },
      formulas: { orderBy: { createdAt: "asc" } },
      spmQuestions: { orderBy: { year: "desc" } },
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }
  return NextResponse.json(topic);
}
