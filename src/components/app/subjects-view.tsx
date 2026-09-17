"use client";

import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, FunctionSquare, Clock } from "lucide-react";
import { TopicIcon } from "./icon";

type Subject = {
  id: string;
  slug: string;
  nameEn: string;
  nameMs: string;
  descEn: string;
  descMs: string;
  icon: string;
  color: string;
  order: number;
  topics: {
    id: string;
    slug: string;
    titleEn: string;
    titleMs: string;
    icon: string;
    formLevel: number;
    durationMin: number;
    _count: { quizQuestions: number; spmQuestions: number; formulas: number; lessons: number };
  }[];
};

export function SubjectsView({ onOpen }: { onOpen: (subjectSlug: string, topicSlug: string) => void }) {
  const { t, locale } = useI18n();

  const { data: subjects = [], isLoading } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const r = await fetch("/api/subjects");
      return r.json();
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("nav.subjects")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("app.tagline")}</p>
      </div>

      {subjects.map((subject) => (
        <div key={subject.id} className="space-y-3">
          {/* Subject header */}
          <Card
            className={
              subject.color === "emerald"
                ? "border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20"
                : "border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20"
            }
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl ${
                    subject.color === "emerald"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  {subject.icon === "Calculator" ? (
                    <Calculator className="h-6 w-6" />
                  ) : (
                    <FunctionSquare className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">
                    {locale === "ms" ? subject.nameMs : subject.nameEn}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {locale === "ms" ? subject.descMs : subject.descEn}
                  </p>
                </div>
                <Badge variant="outline">{subject.topics.length} {t("subject.topics").toLowerCase()}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Topic cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subject.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onOpen(subject.slug, topic.slug)}
                className="focus-ring group rounded-lg border border-border p-4 text-left transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <TopicIcon name={topic.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[0.65rem] font-mono">
                        {topic.formLevel === 4 ? t("common.form4") : t("common.form5")}
                      </Badge>
                      <span className="text-[0.7rem] text-muted-foreground">
                        <Clock className="mr-0.5 inline h-2.5 w-2.5" />
                        {topic.durationMin} {t("subject.min")}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold leading-tight">
                      {locale === "ms" ? topic.titleMs : topic.titleEn}
                    </h3>
                    <div className="mt-1 text-[0.7rem] text-muted-foreground">
                      {topic._count.lessons} {t("subject.lessons")} · {topic._count.quizQuestions}{" "}
                      {t("subject.quizzes")} · {topic._count.spmQuestions} {t("subject.spm")}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
