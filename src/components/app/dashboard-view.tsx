"use client";

import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Brain, Flame, Target, TrendingUp, ArrowRight } from "lucide-react";
import { LessonIcon } from "./icon";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

type Dashboard = {
  student: { id: string; displayName: string };
  stats: {
    totalLessons: number;
    completedLessons: number;
    totalAttempts: number;
    correctAttempts: number;
    totalPoints: number;
    accuracy: number;
    overallCompletion: number;
  };
  byLesson: {
    id: string;
    slug: string;
    titleEn: string;
    titleMs: string;
    icon: string;
    order: number;
    status: string;
    completionPct: number;
    quizCount: number;
    attempts: number;
    accuracy: number;
  }[];
  recentAttempts: {
    id: string;
    isCorrect: boolean;
    pointsEarned: number;
    difficulty: string;
    lessonSlug: string | null;
    lessonTitleEn: string | null;
    lessonTitleMs: string | null;
    at: string;
  }[];
  scoreTrend: {
    idx: number;
    correct: number;
    points: number;
    lessonSlug: string | null;
    difficulty: string;
    at: string;
  }[];
  byDifficulty: { difficulty: string; total: number; correct: number }[];
};

export function DashboardView({
  onOpenLesson,
  onSwitchTab,
}: {
  onOpenLesson: (slug: string) => void;
  onSwitchTab: (tab: string) => void;
}) {
  const { t, locale } = useI18n();

  const { data, isLoading } = useQuery<Dashboard>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const r = await fetch("/api/dashboard");
      return r.json();
    },
  });

  if (isLoading || !data) {
    return (
      <div className="grid h-64 place-items-center text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  const { stats } = data;
  const nextLesson = data.byLesson.find((l) => l.status !== "completed") ?? data.byLesson[0];

  // Build radar chart data: per-lesson accuracy
  const radarData = data.byLesson.map((l) => ({
    subject: locale === "ms" ? l.titleMs.split(" ").slice(0, 2).join(" ") : l.titleEn.split(" ").slice(0, 2).join(" "),
    accuracy: l.accuracy,
    completion: l.completionPct,
  }));

  // Score trend: cumulative accuracy. We compute the cumulative correct
  // count with a single pre-pass, then derive the rate per index.
  const cumulativeCorrect = data.scoreTrend.reduce<number[]>(
    (sums, s, i) => [...sums, (sums[i - 1] ?? 0) + s.correct],
    []
  );
  const trendData = data.scoreTrend.map((s, i) => ({
    idx: s.idx,
    rate: Math.round((cumulativeCorrect[i] / s.idx) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="relative overflow-hidden border-primary/30">
        <div className="absolute inset-0 ledger-grid opacity-30" />
        <CardContent className="relative pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-3 gap-1">
                <Flame className="h-3 w-3 text-amber-500" />
                {locale === "ms" ? "Pelajar Tetamu" : "Guest Student"}
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                {t("hero.welcome")} <span className="text-primary">{t("app.title")}</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {t("app.tagline")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => onOpenLesson(nextLesson.slug)} className="gap-2">
                  {stats.overallCompletion > 0 ? t("hero.continue") : t("hero.start")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => onSwitchTab("quiz")} className="gap-2">
                  <Brain className="h-4 w-4" /> {t("nav.quiz")}
                </Button>
                <Button variant="outline" onClick={() => onSwitchTab("practice")} className="gap-2">
                  <BookOpen className="h-4 w-4" /> {t("nav.practice")}
                </Button>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3">
              <StatTile
                icon={BookOpen}
                label={t("hero.stat.lessons")}
                value={`${stats.completedLessons}/${stats.totalLessons}`}
                tone="primary"
              />
              <StatTile
                icon={Target}
                label={t("hero.stat.avg")}
                value={`${stats.accuracy}%`}
                tone="emerald"
              />
              <StatTile
                icon={Award}
                label={t("hero.stat.quizzes")}
                value={String(stats.totalAttempts)}
                tone="amber"
              />
              <StatTile
                icon={Flame}
                label={t("hero.stat.streak")}
                value="1"
                tone="rose"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall completion + Recommended next */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t("dash.overall")}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === "ms"
                ? `${stats.completedLessons} ${t("dash.lessonsCompleted")} · ${stats.totalAttempts} ${t("dash.quizzesTaken")}`
                : `${stats.completedLessons} ${t("dash.lessonsCompleted")} · ${stats.totalAttempts} ${t("dash.quizzesTaken")}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.byLesson.map((l) => (
                <button
                  key={l.id}
                  onClick={() => onOpenLesson(l.slug)}
                  className="focus-ring w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <LessonIcon name={l.icon} className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate text-sm font-medium">
                        {locale === "ms" ? l.titleMs : l.titleEn}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-xs">
                      {l.accuracy > 0 && (
                        <Badge variant="outline" className="font-mono">
                          {l.accuracy}%
                        </Badge>
                      )}
                      <span className="font-mono text-muted-foreground">{l.completionPct}%</span>
                    </div>
                  </div>
                  <Progress value={l.completionPct} className="mt-2 h-1" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("dash.recommendedNext")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <LessonIcon name={nextLesson.icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">
                    {locale === "ms" ? "Modul" : "Module"} {nextLesson.order}
                  </div>
                  <div className="truncate text-sm font-semibold">
                    {locale === "ms" ? nextLesson.titleMs : nextLesson.titleEn}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="mt-3 w-full gap-1"
                onClick={() => onOpenLesson(nextLesson.slug)}
              >
                {nextLesson.completionPct > 0 ? t("lessons.continue") : t("lessons.start")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("dash.skillMastery")}</CardTitle>
            <CardDescription className="text-xs">
              {locale === "ms"
                ? "Ketepatan kuiz mengikut modul"
                : "Quiz accuracy by module"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {radarData.every((d) => d.accuracy === 0) ? (
              <div className="grid h-64 place-items-center text-sm text-muted-foreground">
                {t("dash.noActivity")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                  <Radar name="Accuracy" dataKey="accuracy" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("progress.scoreTrend")}</CardTitle>
            <CardDescription className="text-xs">
              {locale === "ms"
                ? "Kadar ketepatan kumulatif (15 soalan terkini)"
                : "Cumulative accuracy rate (last 15 questions)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length === 0 ? (
              <div className="grid h-64 place-items-center text-sm text-muted-foreground">
                {t("progress.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="idx" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#trendFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("dash.recentActivity")}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentAttempts.length === 0 ? (
            <div className="grid h-32 place-items-center text-sm text-muted-foreground">
              {t("dash.noActivity")}
            </div>
          ) : (
            <div className="space-y-2">
              {data.recentAttempts.map((a) => (
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
                      {a.lessonTitleEn
                        ? locale === "ms"
                          ? a.lessonTitleMs
                          : a.lessonTitleEn
                        : t("nav.quiz")}
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
          )}
        </CardContent>
      </Card>
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
