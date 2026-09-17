import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const lessons = await db.lesson.findMany({
    orderBy: { order: "asc" },
    include: {
      sections: { orderBy: { order: "asc" } },
      _count: { select: { quizQuestions: true } },
    },
  });
  return NextResponse.json(lessons);
}
