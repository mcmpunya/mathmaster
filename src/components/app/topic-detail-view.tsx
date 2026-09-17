"use client";

import { useState, useEffect } from "react";
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
import { MarkdownLite } from "./markdown-lite";
import { toast } from "sonner";
import { TopicIcon } from "./icon";

type Topic = {
  id: string;
  slug: string;
  titleEn: string;
  titleMs: string;
  summaryEn: string;
  summaryMs: string;
  icon: string;
  formLevel: number;
  durationMin: number;
  subject: { slug: string; nameEn: string; nameMs: string; color: string };
  lessons: {
    id: string;
    order: number;
    titleEn: string;
    titleMs: string;
    summaryEn: string;
    summaryMs: string;
    durationMin: number;
    sections: {
      id: string;
      order: number;
      type: "intro" | "concept" | "example" | "interactive" | "tip";
      titleEn: string;
      titleMs: string;
      bodyEn: string;
      bodyMs: string;
    }[];
  }[];
};

const sectionStyles = {
  intro: { icon: Info, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
  concept: { icon: GraduationCap, color: "text-primary bg-primary/10" },
  example: { icon: BookOpen, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
  interactive: { icon: Sparkles, color: "text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/30" },
  tip: { icon: Lightbulb, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
} as const;

export function TopicDetailView({
  subjectSlug,
  topicSlug,
  onBack,
  onCompleteQuiz,
}: {
  subjectSlug: string;
  topicSlug: string;
  onBack: () => void;
  onCompleteQuiz: () => void;
}) {
  const { t, locale } = useI18n();
  const [lessonIdx, setLessonIdx] = useState(0);
  const [sectionIdx, setSectionIdx] = useState(0);

  const { data: topic, isLoading } = useQuery<Topic>({
    queryKey: ["topic", subjectSlug, topicSlug],
    queryFn: async () => {
      const r = await fetch(`/api/topics/${topicSlug}?subjectSlug=${subjectSlug}`);
      if (!r.ok) throw new Error("not found");
      return r.json();
    },
  });

  const progressMutation = useMutation({
    mutationFn: async (body: { status?: string; completionPct?: number; lastSectionIdx?: number; topicId?: string }) => {
      if (!topic) return;
      const lesson = topic.lessons[lessonIdx];
      if (!lesson) return;
      const r = await fetch(`/api/progress/lesson/${lesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, topicId: topic.id }),
      });
      return r.json();
    },
  });
  const { mutate: saveProgress } = progressMutation;

  useEffect(() => {
    if (!topic) return;
    const lesson = topic.lessons[lessonIdx];
    if (!lesson) return;
    const total = lesson.sections.length;
    const pct = Math.round(((sectionIdx + 1) / total) * 100);
    const status = pct >= 100 ? "completed" : "in_progress";
    saveProgress({ status, completionPct: pct, lastSectionIdx: sectionIdx });
  }, [sectionIdx, lessonIdx, topic, saveProgress]);

  if (isLoading || !topic) {
    return (
      <div className="grid h-64 place-items-center text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  const lesson = topic.lessons[lessonIdx];
  const section = lesson?.sections[sectionIdx];
  if (!lesson || !section) {
    return <div className="grid h-64 place-items-center">No lessons available</div>;
  }

  const totalSections = lesson.sections.length;
  const pct = Math.round(((sectionIdx + 1) / totalSections) * 100);
  const style = sectionStyles[section.type] ?? sectionStyles.concept;
  const Icon = style.icon;
  const body = locale === "ms" ? section.bodyMs : section.bodyEn;
  const title = locale === "ms" ? section.titleMs : section.titleEn;

  function nextSection() {
    if (sectionIdx + 1 < totalSections) {
      setSectionIdx(sectionIdx + 1);
    } else if (lessonIdx + 1 < topic!.lessons.length) {
      setLessonIdx(lessonIdx + 1);
      setSectionIdx(0);
    } else {
      // All done
      toast.success(t("lesson.complete"));
      onCompleteQuiz();
    }
  }

  function prevSection() {
    if (sectionIdx > 0) {
      setSectionIdx(sectionIdx - 1);
    } else if (lessonIdx > 0) {
      const prevLesson = topic!.lessons[lessonIdx - 1];
      setLessonIdx(lessonIdx - 1);
      setSectionIdx(prevLesson.sections.length - 1);
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 gap-1">
        <ArrowLeft className="h-4 w-4" />
        {t("lesson.back")}
      </Button>

      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{locale === "ms" ? topic.subject.nameMs : topic.subject.nameEn}</span>
          <span>/</span>
          <span className="text-foreground">
            {locale === "ms" ? topic.titleMs : topic.titleEn}
          </span>
        </div>
        <h1 className="mt-2 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <TopicIcon name={topic.icon} className="h-5 w-5" />
          </div>
          {locale === "ms" ? lesson.titleMs : lesson.titleEn}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "ms" ? lesson.summaryMs : lesson.summaryEn}
        </p>
      </div>

      {/* Lesson + section indicator */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {locale === "ms" ? "Pelajaran" : "Lesson"} {lessonIdx + 1}/{topic.lessons.length}
        </Badge>
        <Progress value={pct} className="h-1.5 flex-1" />
        <span className="text-xs font-mono text-muted-foreground">
          {sectionIdx + 1}/{totalSections}
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
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={prevSection}
          disabled={lessonIdx === 0 && sectionIdx === 0}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> {t("lesson.prev")}
        </Button>
        <div className="flex gap-1">
          {lesson.sections.map((_, i) => (
            <button
              key={i}
              onClick={() => setSectionIdx(i)}
              aria-label={`Section ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === sectionIdx ? "w-6 bg-primary" : i < sectionIdx ? "w-2 bg-primary/50" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
        <Button size="sm" onClick={nextSection} className="gap-1">
          {lessonIdx + 1 >= topic.lessons.length && sectionIdx + 1 >= totalSections ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> {t("lesson.takeQuiz")}
            </>
          ) : (
            <>
              {t("lesson.next")} <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
