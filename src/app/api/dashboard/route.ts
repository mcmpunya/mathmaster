import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentStudentId } from "@/lib/auth";

export async function GET() {
  const studentId = await getCurrentStudentId();

  const [student, subjects, attempts] = await Promise.all([
    db.student.findUnique({ where: { id: studentId } }),
    db.subject.findMany({
      orderBy: { order: "asc" },
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: { _count: { select: { quizQuestions: true } } },
        },
      },
    }),
    db.quizAttempt.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { question: { include: { topic: { include: { subject: true } } } } },
    }),
  ]);

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isCorrect).length;
  const totalPoints = attempts.reduce((s, a) => s + a.pointsEarned, 0);
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  // All topics flattened
  const allTopics = subjects.flatMap((s) =>
    s.topics.map((t) => ({
      id: t.id,
      slug: t.slug,
      titleEn: t.titleEn,
      titleMs: t.titleMs,
      icon: t.icon,
      subjectSlug: s.slug,
      subjectNameEn: s.nameEn,
      subjectNameMs: s.nameMs,
      subjectColor: s.color,
      quizCount: t._count.quizQuestions,
    }))
  );

  // Per-topic accuracy
  const byTopic = allTopics.map((t) => {
    const topicAttempts = attempts.filter((a) => a.question.topicId === t.id);
    const topicCorrect = topicAttempts.filter((a) => a.isCorrect).length;
    const topicAccuracy =
      topicAttempts.length > 0 ? Math.round((topicCorrect / topicAttempts.length) * 100) : 0;
    return { ...t, attempts: topicAttempts.length, accuracy: topicAccuracy };
  });

  // Score trend
  let cumCorrect = 0;
  const scoreTrend = [...attempts].reverse().slice(-15).map((a, idx) => {
    cumCorrect += a.isCorrect ? 1 : 0;
    return {
      idx: idx + 1,
      correct: a.isCorrect ? 1 : 0,
      points: a.pointsEarned,
      rate: Math.round((cumCorrect / (idx + 1)) * 100),
      topicSlug: a.question.topic?.slug ?? null,
      subjectSlug: a.question.topic?.subject?.slug ?? null,
      difficulty: a.question.difficulty,
      at: a.createdAt.toISOString(),
    };
  });

  // By difficulty
  const byDifficulty = ["beginner", "intermediate", "advanced"].map((d) => {
    const list = attempts.filter((a) => a.question.difficulty === d);
    return {
      difficulty: d,
      total: list.length,
      correct: list.filter((a) => a.isCorrect).length,
    };
  });

  // By subject
  const bySubject = subjects.map((s) => {
    const subjectAttempts = attempts.filter((a) => a.question.topic?.subject?.slug === s.slug);
    const subjectCorrect = subjectAttempts.filter((a) => a.isCorrect).length;
    return {
      slug: s.slug,
      nameEn: s.nameEn,
      nameMs: s.nameMs,
      color: s.color,
      attempts: subjectAttempts.length,
      correct: subjectCorrect,
      accuracy:
        subjectAttempts.length > 0
          ? Math.round((subjectCorrect / subjectAttempts.length) * 100)
          : 0,
    };
  });

  return NextResponse.json({
    student: {
      id: studentId,
      displayName: student?.displayName ?? "Student",
      photoUrl: student?.photoUrl ?? null,
      isDemo: studentId === "student-demo",
    },
    stats: {
      totalSubjects: subjects.length,
      totalTopics: allTopics.length,
      totalAttempts,
      correctAttempts,
      totalPoints,
      accuracy,
    },
    byTopic,
    bySubject,
    byDifficulty,
    scoreTrend,
    recentAttempts: attempts.slice(0, 8).map((a) => ({
      id: a.id,
      isCorrect: a.isCorrect,
      pointsEarned: a.pointsEarned,
      difficulty: a.question.difficulty,
      topicSlug: a.question.topic?.slug ?? null,
      subjectSlug: a.question.topic?.subject?.slug ?? null,
      topicTitleEn: a.question.topic?.titleEn ?? null,
      topicTitleMs: a.question.topic?.titleMs ?? null,
      at: a.createdAt.toISOString(),
    })),
  });
}
