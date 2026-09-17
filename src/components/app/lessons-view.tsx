"use client";

import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, CheckCircle2, PlayCircle, RotateCcw } from "lucide-react";
import { LessonIcon } from "./icon";

type Lesson = {
  id: string;
  slug: string;
  order: number;
  titleEn: string;
  titleMs: string;
  summaryEn: string;
  summaryMs: string;
  icon: string;
  durationMin: number;
  _count?: { quizQuestions: number };
  status?: string;
  completionPct?: number;
};

export function LessonsView({ onOpen }: { onOpen: (slug: string) => void }) {
  const { t, locale } = useI18n();

  const { data: lessons = [], isLoading } = useQuery<Lesson[]>({
    queryKey: ["lessons"],
    queryFn: async () => {
      const [lres, dres] = await Promise.all([
        fetch("/api/lessons"),
        fetch("/api/dashboard"),
      ]);
      const ldata = await lres.json();
      const ddata = await dres.json();
      const statusMap = new Map<string, { status: string; completionPct: number }>(
        (ddata.byLesson ?? []).map((b: { slug: string; status: string; completionPct: number }) => [
          b.slug,
          { status: b.status, completionPct: b.completionPct },
        ])
      );
      return ldata.map((l: Lesson) => ({
        ...l,
        status: statusMap.get(l.slug)?.status ?? "not_started",
        completionPct: statusMap.get(l.slug)?.completionPct ?? 0,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="grid h-64 place-items-center text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("lessons.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("lessons.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => {
          const status = (lesson.status ?? "not_started") as
            | "not_started"
            | "in_progress"
            | "completed";
          const pct = lesson.completionPct ?? 0;
          return (
            <Card
              key={lesson.id}
              className="group relative overflow-hidden transition-all hover:border-primary/40 hover:shadow-md"
            >
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <LessonIcon name={lesson.icon} className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {String(lesson.order).padStart(2, "0")}
                    </span>
                    <Badge variant="outline" className="text-[0.65rem]">
                      <Clock className="mr-1 h-3 w-3" /> {lesson.durationMin} {t("lessons.min")}
                    </Badge>
                    {status === "completed" && (
                      <Badge className="bg-emerald-600 text-[0.65rem] hover:bg-emerald-600">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> {t("lessons.completed")}
                      </Badge>
                    )}
                    {status === "in_progress" && (
                      <Badge variant="secondary" className="text-[0.65rem]">
                        {pct}%
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-1 text-lg font-bold leading-tight">
                    {locale === "ms" ? lesson.titleMs : lesson.titleEn}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {locale === "ms" ? lesson.summaryMs : lesson.summaryEn}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {status !== "not_started" && (
                  <Progress value={pct} className="mb-3 h-1.5" />
                )}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {lesson._count?.quizQuestions ?? 0} {t("nav.quiz").toLowerCase()}
                  </div>
                  <Button
                    size="sm"
                    variant={status === "completed" ? "outline" : "default"}
                    onClick={() => onOpen(lesson.slug)}
                    className="gap-1"
                  >
                    {status === "completed" ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" /> {t("lessons.review")}
                      </>
                    ) : status === "in_progress" ? (
                      <>
                        {t("lessons.continue")} <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-3.5 w-3.5" /> {t("lessons.start")}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
