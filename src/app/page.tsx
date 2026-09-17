"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/app/header";
import { Footer } from "@/components/app/footer";
import { HomeView } from "@/components/app/home-view";
import { SubjectsView } from "@/components/app/subjects-view";
import { TopicDetailView } from "@/components/app/topic-detail-view";
import { SolverView } from "@/components/app/solver-view";
import { GraphView } from "@/components/app/graph-view";
import { FormulasView } from "@/components/app/formulas-view";
import { SpmView } from "@/components/app/spm-view";
import { QuizView } from "@/components/app/quiz-view";
import { ProgressView } from "@/components/app/progress-view";
import { AuthProvider, useAuth } from "@/components/app/auth-provider";
import {
  Home,
  BookOpen,
  Calculator,
  LineChart as LineChartIcon,
  MoreHorizontal,
  Brain,
  FunctionSquare,
  FileText,
  Sigma,
} from "lucide-react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

type Tab = "home" | "subjects" | "topic" | "solver" | "graph" | "formulas" | "spm" | "quiz" | "progress";

export default function Home_() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthAwareRefresher />
          <AppShell />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AuthAwareRefresher() {
  const { user } = useAuth();
  const qc = useQueryClient();
  useEffect(() => {
    qc.invalidateQueries();
  }, [user?.uid, qc]);
  return null;
}

function AppShell() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("home");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [topicSlug, setTopicSlug] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  function openTopic(sSlug: string, tSlug: string) {
    setSubjectSlug(sSlug);
    setTopicSlug(tSlug);
    setTab("topic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchTab(next: string) {
    setTab(next as Tab);
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Bottom nav: 5 primary items (Home, Topics, Solver, Quiz, More)
  const primaryTabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "home", label: t("nav.home"), icon: Home },
    { id: "subjects", label: t("nav.subjects"), icon: BookOpen },
    { id: "solver", label: t("nav.solver"), icon: Calculator },
    { id: "quiz", label: t("nav.quiz"), icon: Brain },
  ];

  const moreTabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "graph", label: t("nav.graph"), icon: LineChartIcon },
    { id: "formulas", label: t("nav.formulas"), icon: Sigma },
    { id: "spm", label: t("nav.spm"), icon: FileText },
    { id: "progress", label: t("nav.progress"), icon: FunctionSquare },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Desktop top tab bar (lg and up) */}
      <nav className="sticky top-14 z-30 hidden w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6">
          {[...primaryTabs, ...moreTabs].map((tb) => {
            const active = tab === tb.id || (tb.id === "subjects" && tab === "topic");
            return (
              <button
                key={tb.id}
                onClick={() => switchTab(tb.id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm transition-colors ${
                  active
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tb.icon className="h-4 w-4" />
                <span>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 pb-20 sm:px-6 sm:py-6 lg:pb-6">
        {tab === "home" && <HomeView onOpenTopic={openTopic} onSwitchTab={switchTab} />}
        {tab === "subjects" && <SubjectsView onOpen={openTopic} />}
        {tab === "topic" && subjectSlug && topicSlug && (
          <TopicDetailView
            subjectSlug={subjectSlug}
            topicSlug={topicSlug}
            onBack={() => switchTab("subjects")}
            onCompleteQuiz={() => switchTab("quiz")}
          />
        )}
        {tab === "solver" && <SolverView />}
        {tab === "graph" && <GraphView />}
        {tab === "formulas" && <FormulasView />}
        {tab === "spm" && <SpmView />}
        {tab === "quiz" && <QuizView />}
        {tab === "progress" && <ProgressView onOpenTopic={openTopic} />}
      </main>

      <Footer />

      {/* Bottom navigation (mobile-first PWA style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-stretch justify-around px-1">
          {primaryTabs.map((tb) => {
            const active = tab === tb.id || (tb.id === "subjects" && tab === "topic");
            return (
              <button
                key={tb.id}
                onClick={() => switchTab(tb.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.65rem] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <tb.icon className="h-5 w-5" />
                <span className="truncate">{tb.label}</span>
              </button>
            );
          })}

          {/* More button — opens sheet with secondary tabs */}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.65rem] ${
                  ["graph", "formulas", "spm", "progress"].includes(tab)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span>{t("nav.home") === "Home" ? "More" : "Lagi"}</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-left">
                  {t("nav.home") === "Home" ? "More Tools" : "Lagi Alat"}
                </SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-3 p-4 pb-8">
                {moreTabs.map((tb) => {
                  const active = tab === tb.id;
                  return (
                    <Button
                      key={tb.id}
                      variant={active ? "default" : "outline"}
                      onClick={() => switchTab(tb.id)}
                      className="h-20 flex-col gap-2"
                    >
                      <tb.icon className="h-6 w-6" />
                      <span className="text-xs">{tb.label}</span>
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
