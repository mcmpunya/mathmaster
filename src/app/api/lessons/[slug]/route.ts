import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const lesson = await db.lesson.findUnique({
    where: { slug },
    include: {
      sections: { orderBy: { order: "asc" } },
      quizQuestions: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }
  return NextResponse.json(lesson);
}
