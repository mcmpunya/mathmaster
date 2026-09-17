"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  GraduationCap,
  BookOpen,
  Info,
} from "lucide-react";
import { safeParse } from "@/lib/constants";
import { MarkdownLite } from "./markdown-lite";
import { toast } from "sonner";
import { TAccount } from "./t-account";

type Section = {
  id: string;
  order: number;
  type: "intro" | "concept" | "example" | "interactive" | "tip";
  titleEn: string;
  titleMs: string;
  bodyEn: string;
  bodyMs: string;
  payload?: string | null;
};

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
  sections: Section[];
};

const sectionStyles = {
  intro: { icon: Info, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
  concept: { icon: GraduationCap, color: "text-primary bg-primary/10" },
  example: { icon: BookOpen, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
  interactive: { icon: Sparkles, color: "text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/30" },
  tip: { icon: Lightbulb, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
} as const;

export function LessonDetailView({
  slug,
  onBack,
  onCompleteQuiz,
}: {
  slug: string;
  onBack: () => void;
  onCompleteQuiz: (slug: string) => void;
}) {
  const { t, locale } = useI18n();
  const [idx, setIdx] = useState(0);

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ["lesson", slug],
    queryFn: async () => {
      const r = await fetch(`/api/lessons/${slug}`);
      if (!r.ok) throw new Error("not found");
      return r.json();
    },
  });

  const progressMutation = useMutation({
    mutationFn: async (body: { status?: string; completionPct?: number; lastSectionIdx?: number }) => {
      if (!lesson) return;
      const r = await fetch(`/api/progress/lesson/${lesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return r.json();
    },
  });
  const { mutate: saveProgress } = progressMutation;

  // Track progress as the user moves through sections
  useEffect(() => {
    if (!lesson) return;
    const pct = Math.round(((idx + 1) / lesson.sections.length) * 100);
    const status = pct >= 100 ? "completed" : "in_progress";
    saveProgress({ status, completionPct: pct, lastSectionIdx: idx });
  }, [idx, lesson, saveProgress]);

  if (isLoading || !lesson) {
    return (
      <div className="grid h-64 place-items-center text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  const section = lesson.sections[idx];
  const total = lesson.sections.length;
  const pct = Math.round(((idx + 1) / total) * 100);
  const style = sectionStyles[section.type] ?? sectionStyles.concept;
  const Icon = style.icon;

  const body = locale === "ms" ? section.bodyMs : section.bodyEn;
  const title = locale === "ms" ? section.titleMs : section.titleEn;
  const payload = section.payload ? safeParse<any>(section.payload, null) : null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ml-2">
        <ArrowLeft className="h-4 w-4" />
        {locale === "ms" ? "Kembali ke Pelajaran" : "Back to Lessons"}
      </Button>

      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t("nav.lessons")}</span>
          <span>/</span>
          <span className="text-foreground">{locale === "ms" ? lesson.titleMs : lesson.titleEn}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {locale === "ms" ? lesson.titleMs : lesson.titleEn}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "ms" ? lesson.summaryMs : lesson.summaryEn}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Progress value={pct} className="h-1.5 flex-1" />
        <span className="text-xs font-mono text-muted-foreground">
          {idx + 1}/{total}
        </span>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`grid h-9 w-9 place-items-center rounded-lg ${style.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                {section.type === "intro" && (locale === "ms" ? "Pengenalan" : "Introduction")}
                {section.type === "concept" && (locale === "ms" ? "Konsep" : "Concept")}
                {section.type === "example" && t("lesson.example")}
                {section.type === "interactive" && t("lesson.tryInteractivity")}
                {section.type === "tip" && t("lesson.tip")}
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground/90">
            <MarkdownLite text={body} />
          </div>

          {/* Embedded interactive: show journal entries as T-accounts */}
          {section.type === "example" && payload?.entries && (
            <div className="mt-6 rounded-lg border border-dashed border-amber-400/40 bg-amber-50/50 p-4 dark:bg-amber-950/20">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                <BookOpen className="h-3.5 w-3.5" />
                {locale === "ms" ? "Entri Jurnal" : "Journal Entry"}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="py-1.5 text-left font-medium">
                        {locale === "ms" ? "Akaun" : "Account"}
                      </th>
                      <th className="py-1.5 text-right font-medium">Dr (RM)</th>
                      <th className="py-1.5 text-right font-medium">Cr (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payload.entries.map((e: { account: string; debit: number; credit: number }, i: number) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-1.5">
                          <span className={e.credit > 0 ? "pl-4 text-muted-foreground" : "font-medium"}>
                            {e.account}
                          </span>
                        </td>
                        <td className="py-1.5 text-right font-mono">
                          {e.debit ? e.debit.toLocaleString() : ""}
                        </td>
                        <td className="py-1.5 text-right font-mono">
                          {e.credit ? e.credit.toLocaleString() : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Embedded interactive: show matrix table */}
          {section.type === "concept" && payload?.matrix && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-foreground/70 text-xs uppercase text-muted-foreground">
                    <th className="py-2 text-left">{locale === "ms" ? "Kategori" : "Category"}</th>
                    <th className="py-2 text-center">{locale === "ms" ? "Meningkat" : "Increase"}</th>
                    <th className="py-2 text-center">{locale === "ms" ? "Berkurang" : "Decrease"}</th>
                    <th className="py-2 text-center">{locale === "ms" ? "Baki Normal" : "Normal Balance"}</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.matrix.map((m: { category: string; categoryMs: string; increase: string; decrease: string; normal: string }, i: number) => (
                    <tr key={i} className="border-b border-border/60">
                      <td className="py-2 font-medium">
                        {locale === "ms" ? m.categoryMs : m.category}
                      </td>
                      <td className="py-2 text-center">
                        <Badge variant={m.increase === "debit" ? "default" : "secondary"} className="font-mono">
                          {m.increase}
                        </Badge>
                      </td>
                      <td className="py-2 text-center">
                        <Badge variant={m.decrease === "debit" ? "default" : "secondary"} className="font-mono">
                          {m.decrease}
                        </Badge>
                      </td>
                      <td className="py-2 text-center">
                        <Badge variant={m.normal === "debit" ? "default" : "secondary"} className="font-mono">
                          {m.normal}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Embedded T-account worked example */}
          {section.type === "example" && payload?.tAccount && (
            <div className="mt-6">
              <TAccount
                accountName={payload.tAccount.account}
                accountNameMs={payload.tAccount.account}
                category="asset"
                entries={payload.tAccount.entries.map((e: { side: "debit" | "credit"; amount: number; desc?: string }, i: number) => ({
                  side: e.side,
                  amount: e.amount,
                  desc: e.desc ?? `Entry ${i + 1}`,
                }))}
              />
            </div>
          )}

          {/* Interactive prompt — just an info card pointing to the Practice Lab */}
          {section.type === "interactive" && (
            <div className="mt-6 rounded-lg border border-fuchsia-300/40 bg-fuchsia-50/60 p-4 dark:bg-fuchsia-950/20">
              <div className="flex items-center gap-2 text-sm font-medium text-fuchsia-700 dark:text-fuchsia-300">
                <Sparkles className="h-4 w-4" />
                {locale === "ms"
                  ? "Buka tab Makmal Latihan untuk mencuba ini secara langsung."
                  : "Open the Practice Lab tab to try this live."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> {t("lesson.prev")}
        </Button>
        <div className="flex gap-1">
          {lesson.sections.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Section ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-6 bg-primary" : i < idx ? "w-2 bg-primary/50" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
        {idx + 1 < total ? (
          <Button size="sm" onClick={() => setIdx((i) => Math.min(total - 1, i + 1))} className="gap-1">
            {t("lesson.next")} <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => {
              saveProgress({ status: "completed", completionPct: 100 });
              toast.success(t("lesson.complete"));
              onCompleteQuiz(lesson.slug);
            }}
            className="gap-1"
          >
            <CheckCircle2 className="h-4 w-4" /> {t("lesson.markComplete")}
          </Button>
        )}
      </div>
    </div>
  );
}
