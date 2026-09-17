"use client";

import { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LineChart, Activity } from "lucide-react";

const VIEWPORT = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
const WIDTH = 400;
const HEIGHT = 400;

function toPx(x: number, y: number) {
  const px = ((x - VIEWPORT.xMin) / (VIEWPORT.xMax - VIEWPORT.xMin)) * WIDTH;
  const py = HEIGHT - ((y - VIEWPORT.yMin) / (VIEWPORT.yMax - VIEWPORT.yMin)) * HEIGHT;
  return { px, py };
}

function formatNum(n: number, dp = 2): string {
  if (!isFinite(n)) return "—";
  const r = Math.round(n * 10 ** dp) / 10 ** dp;
  if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
  return r.toFixed(dp);
}

export function GraphView() {
  const { t, locale } = useI18n();
  const [type, setType] = useState<"linear" | "quadratic">("quadratic");
  const [m, setM] = useState("2");
  const [c, setC] = useState("-1");
  const [a, setA] = useState("1");
  const [b, setB] = useState("-2");
  const [c2, setC2] = useState("-3");

  // Build path string for the curve
  const path = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const step = 0.1;
    for (let x = VIEWPORT.xMin; x <= VIEWPORT.xMax; x += step) {
      let y: number;
      if (type === "linear") {
        y = parseFloat(m) * x + parseFloat(c);
      } else {
        y = parseFloat(a) * x * x + parseFloat(b) * x + parseFloat(c2);
      }
      if (isFinite(y)) points.push({ x, y });
    }
    return points
      .map((p, i) => {
        const { px, py } = toPx(p.x, p.y);
        return `${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`;
      })
      .join(" ");
  }, [type, m, c, a, b, c2]);

  // Calculate key features
  const features = useMemo(() => {
    if (type === "linear") {
      const mN = parseFloat(m);
      const cN = parseFloat(c);
      const xIntercept = mN !== 0 ? -cN / mN : null;
      return {
        equation: `y = ${mN}x ${cN >= 0 ? "+" : "−"} ${Math.abs(cN)}`,
        xIntercepts: xIntercept !== null && isFinite(xIntercept) ? [formatNum(xIntercept)] : [],
        vertex: null as { x: number; y: number } | null,
        yIntercept: formatNum(cN),
      };
    } else {
      const aN = parseFloat(a);
      const bN = parseFloat(b);
      const cN = parseFloat(c2);
      const disc = bN * bN - 4 * aN * cN;
      const roots: string[] = [];
      if (disc >= 0) {
        const sqD = Math.sqrt(disc);
        const r1 = (-bN + sqD) / (2 * aN);
        const r2 = (-bN - sqD) / (2 * aN);
        if (Math.abs(r1 - r2) < 1e-9) roots.push(formatNum(r1));
        else {
          roots.push(formatNum(r1));
          roots.push(formatNum(r2));
        }
      }
      const vertexX = -bN / (2 * aN);
      const vertexY = aN * vertexX * vertexX + bN * vertexX + cN;
      return {
        equation: `y = ${aN}x² ${bN >= 0 ? "+" : "−"} ${Math.abs(bN)}x ${cN >= 0 ? "+" : "−"} ${Math.abs(cN)}`,
        xIntercepts: roots,
        vertex: { x: vertexX, y: vertexY },
        yIntercept: formatNum(cN),
      };
    }
  }, [type, m, c, a, b, c2]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("graph.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("graph.subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)]">
        {/* Graph SVG */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LineChart className="h-4 w-4 text-primary" />
              {features.equation}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="mx-auto w-full max-w-md rounded-lg border border-border bg-card"
                role="img"
                aria-label="Graph plot"
              >
                {/* Grid lines */}
                {Array.from({ length: 21 }).map((_, i) => {
                  const x = VIEWPORT.xMin + i;
                  const { px } = toPx(x, 0);
                  return (
                    <line
                      key={`v${i}`}
                      x1={px}
                      y1={0}
                      x2={px}
                      y2={HEIGHT}
                      stroke={x === 0 ? "currentColor" : "var(--border)"}
                      strokeWidth={x === 0 ? 1.5 : 0.5}
                      opacity={x === 0 ? 0.6 : 0.3}
                    />
                  );
                })}
                {Array.from({ length: 21 }).map((_, i) => {
                  const y = VIEWPORT.yMin + i;
                  const { py } = toPx(0, y);
                  return (
                    <line
                      key={`h${i}`}
                      x1={0}
                      y1={py}
                      x2={WIDTH}
                      y2={py}
                      stroke={y === 0 ? "currentColor" : "var(--border)"}
                      strokeWidth={y === 0 ? 1.5 : 0.5}
                      opacity={y === 0 ? 0.6 : 0.3}
                    />
                  );
                })}

                {/* Axis labels */}
                {[-8, -4, 4, 8].map((x) => (
                  <text
                    key={`xl${x}`}
                    x={toPx(x, 0).px}
                    y={toPx(0, 0).py + 12}
                    fontSize={9}
                    fill="currentColor"
                    opacity={0.6}
                    textAnchor="middle"
                  >
                    {x}
                  </text>
                ))}
                {[-8, -4, 4, 8].map((y) => (
                  <text
                    key={`yl${y}`}
                    x={toPx(0, 0).px + 4}
                    y={toPx(0, y).py + 3}
                    fontSize={9}
                    fill="currentColor"
                    opacity={0.6}
                  >
                    {y}
                  </text>
                ))}

                {/* The curve */}
                <path
                  d={path}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                />

                {/* Vertex marker (quadratic) */}
                {features.vertex && (
                  <g>
                    <circle
                      cx={toPx(features.vertex.x, features.vertex.y).px}
                      cy={toPx(features.vertex.x, features.vertex.y).py}
                      r={5}
                      fill="var(--primary)"
                    />
                    <text
                      x={toPx(features.vertex.x, features.vertex.y).px + 8}
                      y={toPx(features.vertex.x, features.vertex.y).py - 6}
                      fontSize={10}
                      fill="var(--primary)"
                      fontWeight="bold"
                    >
                      ({formatNum(features.vertex.x)}, {formatNum(features.vertex.y)})
                    </text>
                  </g>
                )}

                {/* x-intercepts */}
                {features.xIntercepts.map((xr, i) => {
                  const xv = parseFloat(xr);
                  if (!isFinite(xv) || Math.abs(xv) > 10) return null;
                  return (
                    <g key={`xr${i}`}>
                      <circle
                        cx={toPx(xv, 0).px}
                        cy={toPx(0, 0).py}
                        r={4}
                        fill="var(--chart-2)"
                        stroke="var(--background)"
                        strokeWidth={1.5}
                      />
                    </g>
                  );
                })}

                {/* y-intercept */}
                <circle
                  cx={toPx(0, 0).px}
                  cy={toPx(0, parseFloat(features.yIntercept)).py}
                  r={4}
                  fill="var(--chart-3)"
                  stroke="var(--background)"
                  strokeWidth={1.5}
                />
              </svg>
            </div>

            {/* Key features */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-md border border-border p-2">
                <div className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                  {t("graph.yIntercept")}
                </div>
                <div className="mt-0.5 font-mono font-semibold">{features.yIntercept}</div>
              </div>
              <div className="rounded-md border border-border p-2">
                <div className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                  {t("graph.xIntercepts")}
                </div>
                <div className="mt-0.5 font-mono font-semibold text-xs">
                  {features.xIntercepts.length > 0
                    ? features.xIntercepts.join(", ")
                    : t("graph.none")}
                </div>
              </div>
              {features.vertex && (
                <div className="rounded-md border border-border p-2">
                  <div className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                    {t("graph.vertex")}
                  </div>
                  <div className="mt-0.5 font-mono font-semibold text-xs">
                    ({formatNum(features.vertex.x)}, {formatNum(features.vertex.y)})
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              {locale === "ms" ? "Kawalan" : "Controls"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={type === "linear" ? "default" : "outline"}
                onClick={() => setType("linear")}
                className="flex-1"
              >
                {t("graph.linear")}
              </Button>
              <Button
                size="sm"
                variant={type === "quadratic" ? "default" : "outline"}
                onClick={() => setType("quadratic")}
                className="flex-1"
              >
                {t("graph.quadratic")}
              </Button>
            </div>

            {type === "linear" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="m" className="text-xs">
                    {t("graph.gradient")}
                  </Label>
                  <Input
                    id="m"
                    type="number"
                    step="0.5"
                    value={m}
                    onChange={(e) => setM(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="c" className="text-xs">
                    {t("graph.intercept")}
                  </Label>
                  <Input
                    id="c"
                    type="number"
                    step="0.5"
                    value={c}
                    onChange={(e) => setC(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="a" className="text-xs">
                    {t("graph.coefficientA")}
                  </Label>
                  <Input
                    id="a"
                    type="number"
                    step="0.5"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="b" className="text-xs">
                    {t("graph.coefficientB")}
                  </Label>
                  <Input
                    id="b"
                    type="number"
                    step="0.5"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="c2" className="text-xs">
                    {t("graph.coefficientC")}
                  </Label>
                  <Input
                    id="c2"
                    type="number"
                    step="0.5"
                    value={c2}
                    onChange={(e) => setC2(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Color legend */}
            <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: "var(--primary)" }} />
                <span>{locale === "ms" ? "Lengkung/Garis" : "Curve/Line"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: "var(--chart-2)" }}
                />
                <span>{t("graph.xIntercepts")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: "var(--chart-3)" }}
                />
                <span>{t("graph.yIntercept")}</span>
              </div>
              {features.vertex && (
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  <span>{t("graph.vertex")}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "y = x²", vals: { a: "1", b: "0", c: "0" } },
                { label: "y = x² − 4", vals: { a: "1", b: "0", c: "-4" } },
                { label: "y = 2x + 1", vals: { m: "2", c: "1" } },
                { label: "y = -x + 3", vals: { m: "-1", c: "3" } },
              ].map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => {
                    if ("m" in ex.vals) {
                      setType("linear");
                      setM(ex.vals.m);
                      setC(ex.vals.c);
                    } else {
                      setType("quadratic");
                      setA(ex.vals.a);
                      setB(ex.vals.b);
                      setC2(ex.vals.c);
                    }
                  }}
                  className="focus-ring rounded-md border border-border px-2 py-1 font-mono text-xs hover:border-primary/40 hover:bg-muted/50"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
