import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/quiz?topicId=...&count=10
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");
  const count = parseInt(searchParams.get("count") ?? "10", 10);

  let questions;
  if (topicId) {
    questions = await db.quizQuestion.findMany({
      where: { topicId },
      orderBy: { createdAt: "asc" },
      include: { topic: { include: { subject: true } } },
    });
  } else {
    const all = await db.quizQuestion.findMany({
      orderBy: { createdAt: "asc" },
      include: { topic: { include: { subject: true } } },
    });
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    questions = all.slice(0, Math.min(count, all.length));
  }
  return NextResponse.json(questions);
}
