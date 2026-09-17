import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStudentId } from "@/lib/auth";

// POST /api/quiz/attempt
export async function POST(req: Request) {
  const body = await req.json();
  const { questionId, selectedAnswer } = body as { questionId: string; selectedAnswer: string };

  if (!questionId || selectedAnswer === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const question = await db.quizQuestion.findUnique({ where: { id: questionId } });
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const studentId = await getCurrentStudentId();
  const isCorrect = selectedAnswer.trim() === question.answerKey.trim();
  const pointsEarned = isCorrect ? question.points : 0;

  const attempt = await db.quizAttempt.create({
    data: { studentId, questionId, selectedAnswer, isCorrect, pointsEarned },
  });

  return NextResponse.json({
    attemptId: attempt.id,
    isCorrect,
    pointsEarned,
    correctAnswer: question.answerKey,
    explanationEn: question.explanationEn,
    explanationMs: question.explanationMs,
  });
}
