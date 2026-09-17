import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStudentId } from "@/lib/auth";

// PATCH /api/progress/lesson/:lessonId
export async function PATCH(req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const body = await req.json();
  const { status, completionPct, lastSectionIdx, topicId } = body as {
    status?: string;
    completionPct?: number;
    lastSectionIdx?: number;
    topicId?: string;
  };

  const studentId = await getCurrentStudentId();

  const existing = await db.lessonProgress.findUnique({
    where: { studentId_lessonId: { studentId, lessonId } },
  });

  if (!existing) {
    const created = await db.lessonProgress.create({
      data: {
        studentId,
        lessonId,
        topicId: topicId ?? "",
        status: status ?? "in_progress",
        completionPct: completionPct ?? 0,
        lastSectionIdx: lastSectionIdx ?? 0,
      },
    });
    return NextResponse.json(created);
  }

  const updated = await db.lessonProgress.update({
    where: { id: existing.id },
    data: {
      ...(status ? { status } : {}),
      ...(completionPct !== undefined ? { completionPct } : {}),
      ...(lastSectionIdx !== undefined ? { lastSectionIdx } : {}),
    },
  });
  return NextResponse.json(updated);
}
