"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, FileText, BookOpen } from "lucide-react";
import { TopicIcon } from "./icon";
import { MarkdownLite } from "./markdown-lite";

type Subject = {
  id: string;
  slug: string;
  nameEn: string;
  nameMs: string;
  topics: {
    id: string;
    slug: string;
    titleEn: string;
    titleMs: string;
    icon: string;
    _count: { spmQuestions: number };
  }[];
};

type SpmQuestion = {
  id: string;
  year: number;
  paper: number;
  questionNo: string;
  promptEn: string;
  promptMs: string;
  marksEn: string;
  marksMs: string;
  answerEn: string;
  answerMs: string;
  workingEn: string | null;
  workingMs: string | null;
};

export function SpmView() {
  const { t, locale } = useI18n();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const r = await fetch("/api/subjects");
      return r.json();
    },
  });

  const { data: questions = [], isLoading } = useQuery<SpmQuestion[]>({
    queryKey: ["spm", selectedTopicId],
    enabled: !!selectedTopicId,
    queryFn: async () => {
      const r = await fetch(`/api/spm-questions/${selectedTopicId}`);
      return r.json();
    },
  });

  const selectedTopic = subjects
    .flatMap((s) => s.topics.map((t) => ({ ...t, subject: s })))
    .find((t) => t.id === selectedTopicId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("spm.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("spm.subtitle")}</p>
      </div>

      {/* Topic picker */}
      <div className="space-y-3">
        {subjects.map((s) => (
          <div key={s.id}>
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  s.color === "emerald"
                    ? "border-violet-500/50 text-violet-700 dark:text-violet-400"
                    : "border-fuchsia-500/50 text-fuchsia-700 dark:text-fuchsia-400"
                }
              >
                {locale === "ms" ? s.nameMs : s.nameEn}
              </Badge>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {s.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`focus-ring flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                    selectedTopicId === topic.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <TopicIcon name={topic.icon} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {locale === "ms" ? topic.titleMs : topic.titleEn}
                    </div>
                    <div className="text-[0.7rem] text-muted-foreground">
                      {topic._count.spmQuestions} {t("nav.spm").toLowerCase()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected topic questions */}
      {!selectedTopicId ? (
        <Card>
          <CardContent className="pt-6">
            <div className="grid place-items-center gap-3 py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">{t("spm.selectTopic")}</p>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid h-32 place-items-center text-sm text-muted-foreground">
          {t("common.loading")}
        </div>
      ) : (
        <div className="space-y-4">
          {selectedTopic && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TopicIcon name={selectedTopic.icon} className="h-4 w-4" />
              <span>{locale === "ms" ? selectedTopic.titleMs : selectedTopic.titleEn}</span>
              <span>·</span>
              <span>{questions.length} {t("spm.question").toLowerCase()}</span>
            </div>
          )}
          {questions.map((q, idx) => (
            <SpmCard key={q.id} q={q} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function SpmCard({ q, idx }: { q: SpmQuestion; idx: number }) {
  const { t, locale } = useI18n();
  const [showWorking, setShowWorking] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {t("spm.year")} {q.year}
          </Badge>
          <Badge variant="outline">
            {t("spm.paper")} {q.paper}
          </Badge>
          <Badge variant="outline" className="font-mono">
            {t("spm.question")} {q.questionNo}
          </Badge>
          <Badge variant="outline" className="text-amber-700 dark:text-amber-400">
            {locale === "ms" ? q.marksMs : q.marksEn}
          </Badge>
        </div>
        <CardTitle className="mt-3 text-base leading-relaxed">
          <MarkdownLite text={locale === "ms" ? q.promptMs : q.promptEn} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Answer */}
        <div className="rounded-lg border-2 border-emerald-500/30 bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
          <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {t("spm.answer")}
          </div>
          <div className="font-mono text-sm font-semibold">
            {locale === "ms" ? q.answerMs : q.answerEn}
          </div>
        </div>

        {/* Working toggle */}
        {q.workingEn && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowWorking((v) => !v)}
              className="gap-2"
            >
              {showWorking ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> {t("spm.hideWorking")}
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> {t("spm.showWorking")}
                </>
              )}
            </Button>
            {showWorking && (
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  {t("spm.working")}
                </div>
                <div className="text-sm">
                  <MarkdownLite text={locale === "ms" ? q.workingMs ?? q.workingEn : q.workingEn} />
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
