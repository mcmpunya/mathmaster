"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { TopicIcon } from "./icon";

type Formula = {
  id: string;
  nameEn: string;
  nameMs: string;
  formulaLatex: string;
  formulaDisplay: string;
  descEn: string;
  descMs: string;
  exampleEn: string | null;
  exampleMs: string | null;
  topic: {
    id: string;
    slug: string;
    titleEn: string;
    titleMs: string;
    icon: string;
    formLevel: number;
    subject: { slug: string; nameEn: string; nameMs: string; color: string };
  };
};

export function FormulasView() {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const { data: formulas = [], isLoading } = useQuery<Formula[]>({
    queryKey: ["formulas"],
    queryFn: async () => {
      const r = await fetch("/api/formulas");
      return r.json();
    },
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return formulas.filter((f) => {
      if (subjectFilter !== "all" && f.topic.subject.slug !== subjectFilter) return false;
      if (!q) return true;
      return (
        f.nameEn.toLowerCase().includes(q) ||
        f.nameMs.toLowerCase().includes(q) ||
        f.formulaDisplay.toLowerCase().includes(q) ||
        f.descEn.toLowerCase().includes(q) ||
        f.descMs.toLowerCase().includes(q) ||
        f.topic.titleEn.toLowerCase().includes(q) ||
        f.topic.titleMs.toLowerCase().includes(q)
      );
    });
  }, [formulas, query, subjectFilter]);

  const subjects = useMemo(() => {
    const map = new Map<string, { slug: string; nameEn: string; nameMs: string }>();
    formulas.forEach((f) => {
      if (!map.has(f.topic.subject.slug)) {
        map.set(f.topic.subject.slug, {
          slug: f.topic.subject.slug,
          nameEn: f.topic.subject.nameEn,
          nameMs: f.topic.subject.nameMs,
        });
      }
    });
    return Array.from(map.values());
  }, [formulas]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("formulas.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("formulas.subtitle")}</p>
      </div>

      {/* Search bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("formulas.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSubjectFilter("all")}
            className={`focus-ring rounded-md border px-3 py-2 text-sm transition-colors ${
              subjectFilter === "all"
                ? "border-primary bg-primary/10 text-primary"
                : "hover:bg-muted/50"
            }`}
          >
            {t("formulas.all")}
          </button>
          {subjects.map((s) => (
            <button
              key={s.slug}
              onClick={() => setSubjectFilter(s.slug)}
              className={`focus-ring rounded-md border px-3 py-2 text-sm transition-colors ${
                subjectFilter === s.slug
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted/50"
              }`}
            >
              {locale === "ms" ? s.nameMs : s.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Formula cards */}
      {isLoading ? (
        <div className="grid h-32 place-items-center text-sm text-muted-foreground">
          {t("common.loading")}
        </div>
      ) : filtered.length === 0 ? (
        <div className="grid h-32 place-items-center text-sm text-muted-foreground">
          {t("formulas.noResults")}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((f) => (
            <Card key={f.id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <TopicIcon name={f.topic.icon} className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">
                        {locale === "ms" ? f.nameMs : f.nameEn}
                      </h3>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {locale === "ms" ? f.topic.titleMs : f.topic.titleEn}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      f.topic.subject.color === "emerald"
                        ? "border-violet-500/50 text-violet-700 dark:text-violet-400"
                        : "border-fuchsia-500/50 text-fuchsia-700 dark:text-fuchsia-400"
                    }
                  >
                    {locale === "ms" ? f.topic.subject.nameMs : f.topic.subject.nameEn}
                  </Badge>
                </div>

                <div className="my-3 rounded-lg bg-primary/5 p-3 text-center font-mono text-base font-semibold text-primary">
                  {f.formulaDisplay}
                </div>

                <p className="text-sm text-muted-foreground">
                  {locale === "ms" ? f.descMs : f.descEn}
                </p>

                {f.exampleEn && (
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-muted/40 p-2 text-xs">
                    <BookOpen className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{t("formulas.example")}: </span>
                      <span className="font-mono">
                        {locale === "ms" ? f.exampleMs : f.exampleEn}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
