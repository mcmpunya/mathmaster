"use client";

import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator, FunctionSquare, Award, Target, BookOpen, Brain } from "lucide-react";
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

type Dashboard = {
  stats: {
    totalSubjects: number;
    totalTopics: number;
    totalAttempts: number;
    correctAttempts: number;
    totalPoints: number;
    accuracy: number;
  };
  recentAttempts: {
    id: string;
    isCorrect: boolean;
    pointsEarned: number;
    difficulty: string;
    topicSlug: string | null;
    subjectSlug: string | null;
    topicTitleEn: string | null;
    topicTitleMs: string | null;
    at: string;
  }[];
};

export function HomeView({
  onOpenTopic,
  onSwitchTab,
}: {
  onOpenTopic: (subjectSlug: string, topicSlug: string) => void;
  onSwitchTab: (tab: string) => void;
}) {
  const { t, locale } = useI18n();

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const r = await fetch("/api/subjects");
      return r.json();
    },
  });

  const { data: dash } = useQuery<Dashboard>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const r = await fetch("/api/dashboard");
      return r.json();
    },
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="relative overflow-hidden border-primary/30">
        <div className="absolute inset-0 ledger-grid opacity-20" />
        <CardContent className="relative pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-3 gap-1">
                <Brain className="h-3 w-3" />
                {locale === "ms" ? "Tingkatan 4 & 5" : "Form 4 & 5"}
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                {t("home.welcome")} <span className="text-primary">{t("app.title")}</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("app.tagline")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => onSwitchTab("subjects")} className="gap-2">
                  {t("home.start")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => onSwitchTab("solver")} className="gap-2">
                  <Calculator className="h-4 w-4" /> {t("nav.solver")}
                </Button>
                <Button variant="outline" onClick={() => onSwitchTab("quiz")} className="gap-2">
                  <Brain className="h-4 w-4" /> {t("nav.quiz")}
                </Button>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3">
              <StatTile icon={BookOpen} label={t("home.stat.subjects")} value={String(subjects.length)} tone="primary" />
              <StatTile
                icon={Award}
                label={t("home.stat.topics")}
                value={String(subjects.reduce((s, sub) => s + sub.topics.length, 0))}
                tone="emerald"
              />
              <StatTile
                icon={Target}
                label={t("home.stat.accuracy")}
                value={`${dash?.stats.accuracy ?? 0}%`}
                tone="amber"
              />
              <StatTile
                icon={Brain}
                label={t("home.stat.attempts")}
                value={String(dash?.stats.totalAttempts ?? 0)}
                tone="rose"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      {subjects.map((subject) => (
        <div key={subject.id}>
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl ${
                subject.color === "emerald"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
              }`}
            >
              {subject.icon === "Calculator" ? (
                <Calculator className="h-5 w-5" />
              ) : (
                <FunctionSquare className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {locale === "ms" ? subject.nameMs : subject.nameEn}
              </h2>
              <p className="text-xs text-muted-foreground">
                {locale === "ms" ? subject.descMs : subject.descEn}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subject.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onOpenTopic(subject.slug, topic.slug)}
                className="focus-ring group rounded-lg border border-border p-4 text-left transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <TopicIcon name={topic.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {String(topic.formLevel === 4 ? "F4" : "F5")}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold leading-tight">
                      {locale === "ms" ? topic.titleMs : topic.titleEn}
                    </h3>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {topic._count.lessons} {t("subject.lessons")} · {topic._count.quizQuestions}{" "}
                    {t("subject.quizzes")}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Recent activity */}
      {dash && dash.recentAttempts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-3 text-base font-semibold">{t("home.recentActivity")}</h3>
            <div className="space-y-2">
              {dash.recentAttempts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2 text-sm"
                >
                  <div
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      a.isCorrect
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {a.isCorrect ? "✓" : "✗"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs text-muted-foreground">
                      {a.topicTitleEn ? (locale === "ms" ? a.topicTitleMs : a.topicTitleEn) : t("nav.quiz")}
                    </div>
                    <div className="text-[0.7rem] text-muted-foreground">
                      {new Date(a.at).toLocaleString(locale === "ms" ? "ms-MY" : "en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[0.65rem] capitalize">
                    {a.difficulty}
                  </Badge>
                  <span className="font-mono text-xs">+{a.pointsEarned}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Award;
  label: string;
  value: string;
  tone: "primary" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  };
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
      <div className={`grid h-9 w-9 place-items-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-lg font-bold leading-tight">{value}</div>
        <div className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
