import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/spm-questions/[topicId]
export async function GET(_req: Request, { params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const questions = await db.spmQuestion.findMany({
    where: { topicId },
    orderBy: [{ year: "desc" }, { questionNo: "asc" }],
  });
  return NextResponse.json(questions);
}
