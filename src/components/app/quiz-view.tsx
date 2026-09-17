"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Play,
  ArrowRight,
  Brain,
} from "lucide-react";
import { safeParse } from "@/lib/constants";
import { MarkdownLite } from "./markdown-lite";

type Question = {
  id: string;
  type: "mcq" | "numeric";
  promptEn: string;
  promptMs: string;
  optionsEn: string[];
  optionsMs: string[];
  answerKey: string;
  explanationEn: string;
  explanationMs: string;
  difficulty: string;
  points: number;
  topic: {
    slug: string;
    titleEn: string;
    titleMs: string;
    subject: { slug: string; nameEn: string; nameMs: string; color: string };
  } | null;
};

type AttemptResult = {
  attemptId: string;
  isCorrect: boolean;
  pointsEarned: number;
  correctAnswer: string;
  explanationEn: string;
  explanationMs: string;
};

export function QuizView() {
  const { t, locale } = useI18n();
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState<AttemptResult | null>(null);
  const [history, setHistory] = useState<AttemptResult[]>([]);
  const [finished, setFinished] = useState(false);

  const { data: questions = [], isFetching } = useQuery<Question[]>({
    queryKey: ["quiz", "mixed"],
    enabled: started,
    queryFn: async () => {
      const r = await fetch("/api/quiz?count=10");
      const data = await r.json();
      return data.map((q: Record<string, unknown>) => ({
        ...q,
        optionsEn: safeParse<string[]>((q.optionsEn as string) ?? "[]", []),
        optionsMs: safeParse<string[]>((q.optionsMs as string) ?? "[]", []),
      }));
    },
  });

  const submitMutation = useMutation({
    mutationFn: async ({ questionId, selectedAnswer }: { questionId: string; selectedAnswer: string }) => {
      const r = await fetch("/api/quiz/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, selectedAnswer }),
      });
      if (!r.ok) throw new Error("submit failed");
      return r.json();
    },
    onSuccess: (data: AttemptResult) => {
      setSubmitted(data);
      setHistory((h) => [...h, data]);
    },
  });

  const current = questions[currentIdx];

  function start() {
    setStarted(true);
    setCurrentIdx(0);
    setSelected("");
    setSubmitted(null);
    setHistory([]);
    setFinished(false);
  }

  function next() {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrentIdx((i) => i + 1);
    setSelected("");
    setSubmitted(null);
  }

  function restart() {
    setStarted(false);
    setFinished(false);
    setSelected("");
    setSubmitted(null);
    setHistory([]);
    setCurrentIdx(0);
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("quiz.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("quiz.subtitle")}</p>
        </div>
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {locale === "ms" ? "Kuiz Campuran" : "Mixed Quiz"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "ms"
                    ? "10 soalan dari semua topik. Markah serta-merta dengan penjelasan."
                    : "10 questions from all topics. Instant scoring with explanations."}
                </p>
              </div>
              <Button size="lg" onClick={start} className="gap-2">
                <Play className="h-4 w-4" /> {t("quiz.start")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isFetching || questions.length === 0) {
    return (
      <div className="grid h-64 place-items-center">
        <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  if (finished) {
    const correct = history.filter((h) => h.isCorrect).length;
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    const points = history.reduce((s, h) => s + h.pointsEarned, 0);
    const maxPoints = questions.reduce((s, q) => s + (q.points ?? 1), 0);

    const tier =
      pct >= 80
        ? { icon: Trophy, msg: t("quiz.excellent"), color: "text-amber-500" }
        : pct >= 60
        ? { icon: CheckCircle2, msg: t("quiz.good"), color: "text-emerald-600" }
        : { icon: RotateCcw, msg: t("quiz.keepGoing"), color: "text-muted-foreground" };

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <tier.icon className={`h-12 w-12 ${tier.color}`} />
              <h2 className="text-2xl font-bold">{t("quiz.result")}</h2>
              <p className="text-sm text-muted-foreground">{tier.msg}</p>
              <div className="mt-4 grid w-full max-w-md grid-cols-3 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <div className="text-2xl font-bold text-primary">{pct}%</div>
                  <div className="text-xs text-muted-foreground">{t("quiz.score")}</div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-2xl font-bold">{correct}/{total}</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === "ms" ? "Betul" : "Correct"}
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-2xl font-bold">{points}/{maxPoints}</div>
                  <div className="text-xs text-muted-foreground">{t("quiz.points")}</div>
                </div>
              </div>
              <Button onClick={restart} className="mt-4 gap-2">
                <RotateCcw className="h-4 w-4" /> {t("quiz.tryAgain")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const options = locale === "ms" ? current.optionsMs : current.optionsEn;
  const prompt = locale === "ms" ? current.promptMs : current.promptEn;
  const explanation = submitted
    ? locale === "ms"
      ? submitted.explanationMs
      : submitted.explanationEn
    : "";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <Brain className="h-5 w-5 text-primary" />
            {t("quiz.title")}
          </h1>
          <Badge variant="secondary">
            {t("quiz.question")} {currentIdx + 1} {t("quiz.of")} {questions.length}
          </Badge>
        </div>
        <Progress value={(currentIdx / questions.length) * 100} className="mt-3 h-1.5" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {current.difficulty}
            </Badge>
            <Badge variant="outline">{current.points} {t("quiz.points")}</Badge>
            <Badge variant="outline" className="capitalize">
              {current.type === "mcq" ? "MCQ" : "Numeric"}
            </Badge>
            {current.topic && (
              <>
                <Badge
                  variant="outline"
                  className={
                    current.topic.subject.color === "emerald"
                      ? "border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
                      : "border-amber-500/50 text-amber-700 dark:text-amber-400"
                  }
                >
                  {locale === "ms" ? current.topic.subject.nameMs : current.topic.subject.nameEn}
                </Badge>
                <Badge variant="outline">
                  {locale === "ms" ? current.topic.titleMs : current.topic.titleEn}
                </Badge>
              </>
            )}
          </div>
          <CardTitle className="mt-2 text-base leading-relaxed">
            <MarkdownLite text={prompt} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {current.type === "mcq" ? (
            !submitted ? (
              <RadioGroup value={selected} onValueChange={setSelected} className="space-y-2">
                {options.map((opt, i) => (
                  <Label
                    key={i}
                    htmlFor={`opt-${i}`}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                      selected === String(i)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <RadioGroupItem value={String(i)} id={`opt-${i}`} className="mt-0.5" />
                    <span className="flex-1">{opt}</span>
                  </Label>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {options.map((opt, i) => {
                  const isCorrect = String(i) === submitted!.correctAnswer;
                  const isUserPick = String(i) === selected;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                          : isUserPick
                          ? "border-destructive bg-destructive/5"
                          : "border-border opacity-70"
                      }`}
                    >
                      <div className="mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : isUserPick ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-border" />
                        )}
                      </div>
                      <span className="flex-1">{opt}</span>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            // Numeric answer
            !submitted ? (
              <div className="space-y-3">
                <Label htmlFor="numeric-answer" className="text-sm">
                  {t("quiz.enterAnswer")}
                </Label>
                <Input
                  id="numeric-answer"
                  type="text"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="font-mono"
                  placeholder="3 s.f."
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    submitted.isCorrect
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-destructive bg-destructive/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {submitted.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {locale === "ms" ? "Jawapan anda: " : "Your answer: "}
                    </span>
                    <span className="font-mono font-semibold">{selected}</span>
                    {!submitted.isCorrect && (
                      <>
                        <span className="text-xs text-muted-foreground mx-2">·</span>
                        <span className="text-xs text-muted-foreground">
                          {locale === "ms" ? "Betul: " : "Correct: "}
                        </span>
                        <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          {submitted.correctAnswer}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {submitted && (
        <Card
          className={`border-l-4 ${
            submitted.isCorrect
              ? "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
              : "border-l-destructive bg-destructive/5"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {submitted.isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              {submitted.isCorrect ? t("quiz.correct") : t("quiz.incorrect")}
              <Badge variant="secondary" className="ml-2">
                +{submitted.pointsEarned} {t("quiz.points")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("quiz.explanation")}
            </div>
            <div className="mt-1 text-sm">
              <MarkdownLite text={explanation} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        {!submitted ? (
          <Button
            disabled={!selected || submitMutation.isPending}
            onClick={() =>
              submitMutation.mutate({
                questionId: current.id,
                selectedAnswer: selected,
              })
            }
            className="gap-2"
          >
            {t("quiz.submit")}
          </Button>
        ) : (
          <Button onClick={next} className="gap-2">
            {currentIdx + 1 >= questions.length ? t("quiz.finish") : t("quiz.next")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
