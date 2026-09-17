import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const subjects = await db.subject.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: { _count: { select: { quizQuestions: true, spmQuestions: true, formulas: true, lessons: true } } },
      },
    },
  });
  return NextResponse.json(subjects);
}
