"use client";

import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Target, TrendingUp, Trophy } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { TopicIcon } from "./icon";

type Dashboard = {
  stats: {
    totalSubjects: number;
    totalTopics: number;
    totalAttempts: number;
    correctAttempts: number;
    totalPoints: number;
    accuracy: number;
  };
  byTopic: {
    id: string;
    slug: string;
    titleEn: string;
    titleMs: string;
    icon: string;
    subjectSlug: string;
    subjectNameEn: string;
    subjectNameMs: string;
    subjectColor: string;
    quizCount: number;
    attempts: number;
    accuracy: number;
  }[];
  bySubject: {
    slug: string;
    nameEn: string;
    nameMs: string;
    color: string;
    attempts: number;
    correct: number;
    accuracy: number;
  }[];
  byDifficulty: { difficulty: string; total: number; correct: number }[];
  scoreTrend: { idx: number; correct: number; points: number; rate: number }[];
};

export function ProgressView({ onOpenTopic }: { onOpenTopic: (subjectSlug: string, topicSlug: string) => void }) {
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

  const diffData = data.byDifficulty.map((d) => ({
    name: d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
    total: d.total,
    correct: d.correct,
    rate: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("progress.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("progress.subtitle")}</p>
      </div>

      {/* Top stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Award} label={t("progress.totalPoints")} value={String(stats.totalPoints)} tone="amber" />
        <StatCard icon={Target} label={t("progress.accuracy")} value={`${stats.accuracy}%`} tone="emerald" />
        <StatCard icon={TrendingUp} label={t("progress.attempts")} value={String(stats.totalAttempts)} tone="primary" />
        <StatCard icon={Trophy} label={t("home.stat.topics")} value={`${stats.totalTopics}`} tone="rose" />
      </div>

      {/* By subject */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("progress.bySubject")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.bySubject.map((s) => (
              <div key={s.slug} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {locale === "ms" ? s.nameMs : s.nameEn}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      s.color === "emerald"
                        ? "border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
                        : "border-amber-500/50 text-amber-700 dark:text-amber-400"
                    }
                  >
                    {s.accuracy}%
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {s.correct}/{s.attempts} {t("progress.attempts")}
                </div>
                <Progress value={s.accuracy} className="mt-2 h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score trend */}
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
          {data.scoreTrend.length === 0 ? (
            <div className="grid h-48 place-items-center text-sm text-muted-foreground">
              {t("progress.noData")}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.scoreTrend}>
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
                <Area type="monotone" dataKey="rate" stroke="var(--primary)" strokeWidth={2} fill="url(#trendFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* By difficulty */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("progress.byDifficulty")}</CardTitle>
        </CardHeader>
        <CardContent>
          {diffData.every((d) => d.total === 0) ? (
            <div className="grid h-32 place-items-center text-sm text-muted-foreground">
              {t("progress.noData")}
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={diffData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="total" name={locale === "ms" ? "Jumlah" : "Total"} radius={[4, 4, 0, 0]}>
                    {diffData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={
                          d.name === "Beginner"
                            ? "var(--chart-1)"
                            : d.name === "Intermediate"
                            ? "var(--chart-2)"
                            : "var(--chart-3)"
                        }
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="correct" name={locale === "ms" ? "Betul" : "Correct"} fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                {diffData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background:
                          d.name === "Beginner"
                            ? "var(--chart-1)"
                            : d.name === "Intermediate"
                            ? "var(--chart-2)"
                            : "var(--chart-3)",
                      }}
                    />
                    <span className="text-muted-foreground">{d.name}:</span>
                    <span className="font-mono">{d.correct}/{d.total} ({d.rate}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* By topic */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("progress.byTopic")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.byTopic.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onOpenTopic(topic.subjectSlug, topic.slug)}
                className="focus-ring w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <TopicIcon name={topic.icon} className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {locale === "ms" ? topic.titleMs : topic.titleEn}
                      </div>
                      <div className="text-[0.7rem] text-muted-foreground">
                        {locale === "ms" ? topic.subjectNameMs : topic.subjectNameEn}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs">
                    {topic.attempts > 0 && (
                      <Badge variant="outline" className="font-mono">
                        {topic.accuracy}%
                      </Badge>
                    )}
                    <span className="text-muted-foreground">
                      {topic.attempts} {t("progress.attempts")}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Award; label: string; value: string; tone: "primary" | "emerald" | "amber" | "rose" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  };
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight">{value}</div>
            <div className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
