"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Calculator, Sigma, ArrowRight } from "lucide-react";

type Solution = {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  nature: "twoReal" | "oneReal" | "noReal";
  root1: number | null;
  root2: number | null;
  root1Exact: string;
  root2Exact: string;
};

function formatNum(n: number, dp = 4): string {
  if (!isFinite(n)) return "—";
  const rounded = Math.round(n * 10 ** dp) / 10 ** dp;
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
  return rounded.toFixed(dp).replace(/\.?0+$/, "");
}

function simplifySqrt(n: number): string {
  if (n < 0) return `√(${n})`;
  if (n === 0) return "0";
  // Try perfect squares up to 1000
  for (let i = Math.floor(Math.sqrt(n)); i >= 1; i--) {
    if (n % (i * i) === 0) {
      const outside = i;
      const inside = n / (i * i);
      if (inside === 1) return `${outside}`;
      return `${outside}√${inside}`;
    }
  }
  return `√${n}`;
}

function solve(a: number, b: number, c: number): Solution | null {
  if (a === 0) return null;
  const discriminant = b * b - 4 * a * c;
  let nature: Solution["nature"] = "twoReal";
  if (discriminant > 0) nature = "twoReal";
  else if (discriminant === 0) nature = "oneReal";
  else nature = "noReal";

  let root1: number | null = null;
  let root2: number | null = null;
  let root1Exact = "—";
  let root2Exact = "—";

  if (nature !== "noReal") {
    const sqD = Math.sqrt(Math.abs(discriminant));
    root1 = (-b + sqD) / (2 * a);
    root2 = (-b - sqD) / (2 * a);
    root1Exact = `(${formatNum(-b)} + ${simplifySqrt(discriminant)}) / ${formatNum(2 * a)}`;
    root2Exact = `(${formatNum(-b)} − ${simplifySqrt(discriminant)}) / ${formatNum(2 * a)}`;
    if (nature === "oneReal") {
      root2 = null;
      root2Exact = "—";
    }
  }

  return { a, b, c, discriminant, nature, root1, root2, root1Exact, root2Exact };
}

const examples = [
  { a: 1, b: -5, c: 6, label: "x² − 5x + 6 = 0" },
  { a: 1, b: -4, c: 4, label: "x² − 4x + 4 = 0" },
  { a: 1, b: 0, c: 9, label: "x² + 9 = 0" },
  { a: 1, b: -4, c: 1, label: "x² − 4x + 1 = 0" },
];

export function SolverView() {
  const { t, locale } = useI18n();
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");
  const [submitted, setSubmitted] = useState(true);

  const solution = useMemo(() => {
    const aN = parseFloat(a);
    const bN = parseFloat(b);
    const cN = parseFloat(c);
    if (isNaN(aN) || isNaN(bN) || isNaN(cN) || aN === 0) return null;
    return solve(aN, bN, cN);
  }, [a, b, c]);

  function loadExample(ex: { a: number; b: number; c: number }) {
    setA(String(ex.a));
    setB(String(ex.b));
    setC(String(ex.c));
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("solver.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("solver.subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="h-4 w-4 text-primary" />
              {locale === "ms" ? "Masukkan Pekali" : "Enter Coefficients"}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === "ms"
                ? "Persamaan: ax² + bx + c = 0"
                : "Equation: ax² + bx + c = 0"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="a" className="text-xs">
                  {t("solver.coefficientA")}
                </Label>
                <Input
                  id="a"
                  type="number"
                  value={a}
                  onChange={(e) => {
                    setA(e.target.value);
                    setSubmitted(false);
                  }}
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <Label htmlFor="b" className="text-xs">
                  {t("solver.coefficientB")}
                </Label>
                <Input
                  id="b"
                  type="number"
                  value={b}
                  onChange={(e) => {
                    setB(e.target.value);
                    setSubmitted(false);
                  }}
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <Label htmlFor="c" className="text-xs">
                  {t("solver.coefficientC")}
                </Label>
                <Input
                  id="c"
                  type="number"
                  value={c}
                  onChange={(e) => {
                    setC(e.target.value);
                    setSubmitted(false);
                  }}
                  className="mt-1 font-mono"
                />
              </div>
            </div>

            {/* Live equation preview */}
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center font-mono text-lg">
              {a || 0}x² + ({b || 0})x + ({c || 0}) = 0
            </div>

            <Button
              onClick={() => setSubmitted(true)}
              disabled={!solution}
              className="w-full gap-2"
            >
              <Sigma className="h-4 w-4" />
              {t("solver.solve")}
            </Button>

            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                {t("solver.tryExample")}
              </div>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => loadExample(ex)}
                    className="focus-ring rounded-md border border-border px-2 py-1 font-mono text-xs hover:border-primary/40 hover:bg-muted/50"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("solver.solution")}</CardTitle>
          </CardHeader>
          <CardContent>
            {!submitted || !solution ? (
              <div className="grid h-48 place-items-center text-sm text-muted-foreground">
                {locale === "ms"
                  ? "Masukkan pekali dan klik Selesaikan."
                  : "Enter coefficients and click Solve."}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Equation */}
                <div className="rounded-lg bg-primary/5 p-3 text-center font-mono">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("solver.equation")}
                  </div>
                  <div className="mt-1 text-base font-semibold">
                    {solution.a}x² {solution.b >= 0 ? "+" : "−"} {Math.abs(solution.b)}x{" "}
                    {solution.c >= 0 ? "+" : "−"} {Math.abs(solution.c)} = 0
                  </div>
                </div>

                {/* Discriminant */}
                <div className="rounded-lg border border-border p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {t("solver.discriminant")} (Δ = b² − 4ac)
                  </div>
                  <div className="mt-1 font-mono text-base">
                    Δ = ({solution.b})² − 4({solution.a})({solution.c}) ={" "}
                    <span className="font-semibold">{solution.discriminant}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={solution.nature === "noReal" ? "destructive" : "default"}
                      className="capitalize"
                    >
                      {t(`solver.${solution.nature}`)}
                    </Badge>
                  </div>
                </div>

                {/* Roots */}
                <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-3">
                  <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    {locale === "ms" ? "Punca (Formula Kuadratik)" : "Roots (Quadratic Formula)"}
                  </div>
                  <div className="mb-3 font-mono text-xs text-muted-foreground">
                    x = (−b ± √(b² − 4ac)) / 2a
                  </div>
                  {solution.nature === "noReal" ? (
                    <div className="text-sm text-destructive">
                      {t("solver.noReal")}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground">{t("solver.root1")}</div>
                        <div className="font-mono text-sm">
                          x₁ = {solution.root1Exact}
                        </div>
                        <div className="font-mono text-base font-semibold text-primary">
                          x₁ = {solution.root1 !== null ? formatNum(solution.root1) : "—"}
                        </div>
                      </div>
                      {solution.nature !== "oneReal" && (
                        <div>
                          <div className="text-xs text-muted-foreground">{t("solver.root2")}</div>
                          <div className="font-mono text-sm">
                            x₂ = {solution.root2Exact}
                          </div>
                          <div className="font-mono text-base font-semibold text-primary">
                            x₂ = {solution.root2 !== null ? formatNum(solution.root2) : "—"}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-amber-50/50 p-3 text-xs dark:bg-amber-950/20">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <div>
                    <span className="font-medium">
                      {locale === "ms" ? "Tip peperiksaan: " : "Exam tip: "}
                    </span>
                    {locale === "ms"
                      ? "Sentiasa nyatakan jawapan kepada 3 angka bererti jika punca tidak bulat."
                      : "Always state answers to 3 significant figures if roots are not exact."}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Step-by-step working */}
      {submitted && solution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowRight className="h-4 w-4 text-primary" />
              {t("solver.steps")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <div>
                  <div className="font-medium">
                    {locale === "ms"
                      ? "Kenal pasti pekali dari persamaan"
                      : "Identify coefficients from the equation"}
                  </div>
                  <div className="mt-1 font-mono text-xs">
                    a = {solution.a}, b = {solution.b}, c = {solution.c}
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <div>
                  <div className="font-medium">
                    {locale === "ms"
                      ? "Kira diskriminan untuk menentukan sifat punca"
                      : "Calculate the discriminant to determine nature of roots"}
                  </div>
                  <div className="mt-1 font-mono text-xs">
                    Δ = b² − 4ac = ({solution.b})² − 4({solution.a})({solution.c}) = {solution.discriminant}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {solution.discriminant > 0 &&
                      (locale === "ms"
                        ? "Δ > 0 → dua punca nyata berbeza"
                        : "Δ > 0 → two distinct real roots")}
                    {solution.discriminant === 0 &&
                      (locale === "ms"
                        ? "Δ = 0 → satu punca berulang"
                        : "Δ = 0 → one repeated root")}
                    {solution.discriminant < 0 &&
                      (locale === "ms"
                        ? "Δ < 0 → tiada punca nyata"
                        : "Δ < 0 → no real roots")}
                  </div>
                </div>
              </li>
              {solution.nature !== "noReal" && (
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </span>
                  <div>
                    <div className="font-medium">
                      {locale === "ms"
                        ? "Gantikan ke dalam formula kuadratik"
                        : "Substitute into the quadratic formula"}
                    </div>
                    <div className="mt-1 font-mono text-xs">
                      x = (−({solution.b}) ± √{solution.discriminant}) / (2 × {solution.a})
                    </div>
                    <div className="mt-1 font-mono text-xs">
                      x = ({formatNum(-solution.b)} ± {simplifySqrt(solution.discriminant)}) / {formatNum(2 * solution.a)}
                    </div>
                  </div>
                </li>
              )}
              {solution.nature === "twoReal" && (
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-primary-foreground">
                    4
                  </span>
                  <div>
                    <div className="font-medium">
                      {locale === "ms" ? "Punca:" : "Roots:"}
                    </div>
                    <div className="mt-1 font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400">
                      x = {formatNum(solution.root1!)} atau x = {formatNum(solution.root2!)}
                    </div>
                  </div>
                </li>
              )}
              {solution.nature === "oneReal" && (
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-primary-foreground">
                    4
                  </span>
                  <div>
                    <div className="font-medium">
                      {locale === "ms" ? "Punca berulang:" : "Repeated root:"}
                    </div>
                    <div className="mt-1 font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400">
                      x = {formatNum(solution.root1!)}
                    </div>
                  </div>
                </li>
              )}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
