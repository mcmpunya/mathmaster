"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, RotateCcw, Lightbulb, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { TAccount, type JournalLine } from "./t-account";
import { Badge } from "@/components/ui/badge";

type AccountRow = {
  id: string;
  code: string;
  nameEn: string;
  nameMs: string;
  category: string;
  normalBalance: "debit" | "credit";
};

type Scenario = {
  id: string;
  titleEn: string;
  titleMs: string;
  descEn: string;
  descMs: string;
  solution: { account: string; debit: number; credit: number; desc?: string }[];
};

const scenarios: Scenario[] = [
  {
    id: "owner-invest",
    titleEn: "Owner invests RM10,000 cash",
    titleMs: "Pemilik melabur RM10,000 tunai",
    descEn: "Aisha deposits RM10,000 of her own money into the business bank account to start a consulting practice.",
    descMs: "Aishah mendepositkan RM10,000 daripada wang sendiri ke akaun bank perniagaan untuk memulakan perniagaan perundingan.",
    solution: [
      { account: "Cash", debit: 10000, credit: 0, desc: "Owner investment" },
      { account: "Owner's Capital", debit: 0, credit: 10000, desc: "Capital contribution" },
    ],
  },
  {
    id: "buy-equipment-cash",
    titleEn: "Buy equipment for RM3,500 cash",
    titleMs: "Beli peralatan RM3,500 tunai",
    descEn: "The business buys a laptop for RM3,500 in cash.",
    descMs: "Perniagaan membeli komputer riba dengan RM3,500 secara tunai.",
    solution: [
      { account: "Equipment", debit: 3500, credit: 0, desc: "Purchase of laptop" },
      { account: "Cash", debit: 0, credit: 3500, desc: "Cash payment" },
    ],
  },
  {
    id: "pay-rent",
    titleEn: "Pay office rent RM1,200",
    titleMs: "Bayar sewa pejabat RM1,200",
    descEn: "The business pays RM1,200 cash for office rent for the month.",
    descMs: "Perniagaan membayar RM1,200 tunai untuk sewa pejabat bulan ini.",
    solution: [
      { account: "Rent Expense", debit: 1200, credit: 0, desc: "Monthly rent" },
      { account: "Cash", debit: 0, credit: 1200, desc: "Cash payment" },
    ],
  },
  {
    id: "service-on-credit",
    titleEn: "Perform service on credit RM2,500",
    titleMs: "Berikan perkhidmatan secara kredit RM2,500",
    descEn: "The business performs RM2,500 of consulting services for a client who will pay next month.",
    descMs: "Perniagaan memberi perkhidmatan perundingan RM2,500 kepada pelanggan yang akan membayar bulan depan.",
    solution: [
      { account: "Accounts Receivable", debit: 2500, credit: 0, desc: "Billed client" },
      { account: "Service Revenue", debit: 0, credit: 2500, desc: "Service rendered" },
    ],
  },
  {
    id: "inventory-on-credit",
    titleEn: "Purchase inventory RM8,000 on credit",
    titleMs: "Beli inventori RM8,000 secara kredit",
    descEn: "ABC Trading purchases RM8,000 of inventory from Supplier XYZ on 30-day credit terms.",
    descMs: "ABC Trading membeli inventori RM8,000 daripada Pembekal XYZ dengan syarat kredit 30 hari.",
    solution: [
      { account: "Inventory", debit: 8000, credit: 0, desc: "Purchase on credit" },
      { account: "Accounts Payable", debit: 0, credit: 8000, desc: "Owed to supplier" },
    ],
  },
  {
    id: "compound-entry",
    titleEn: "Buy equipment RM5,000 (RM2k cash + RM3k note)",
    titleMs: "Beli peralatan RM5,000 (RM2k tunai + RM3k wesel)",
    descEn: "The business buys equipment for RM5,000, paying RM2,000 cash and signing a note payable for RM3,000.",
    descMs: "Perniagaan membeli peralatan RM5,000, membayar RM2,000 tunai dan menandatangani wesel bayar untuk RM3,000.",
    solution: [
      { account: "Equipment", debit: 5000, credit: 0, desc: "Purchase of equipment" },
      { account: "Cash", debit: 0, credit: 2000, desc: "Cash portion" },
      { account: "Notes Payable", debit: 0, credit: 3000, desc: "Note portion" },
    ],
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyLine(): JournalLine {
  return { id: uid(), accountEn: "", accountMs: "", debit: 0, credit: 0, desc: "" };
}

export function PracticeView() {
  const { t, locale } = useI18n();
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [lines, setLines] = useState<JournalLine[]>([emptyLine(), emptyLine()]);
  const [showSolution, setShowSolution] = useState(false);

  const { data: accounts = [] } = useQuery<AccountRow[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const r = await fetch("/api/accounts");
      return r.json();
    },
  });

  const scenario = scenarios.find((s) => s.id === scenarioId)!;

  const totalDebits = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredits = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const isBalanced = totalDebits > 0 && totalDebits === totalCredits;

  // Build T-account data per account used
  const tAccountMap = useMemo(() => {
    const map = new Map<string, { account: AccountRow; entries: { side: "debit" | "credit"; amount: number; desc?: string }[] }>();
    for (const l of lines) {
      if (!l.accountEn) continue;
      const acc = accounts.find((a) => `${a.code} ${a.nameEn}` === l.accountEn || a.nameEn === l.accountEn);
      if (!acc) continue;
      const key = acc.code;
      if (!map.has(key)) map.set(key, { account: acc, entries: [] });
      if (l.debit) map.get(key)!.entries.push({ side: "debit", amount: Number(l.debit) || 0, desc: l.desc });
      if (l.credit) map.get(key)!.entries.push({ side: "credit", amount: Number(l.credit) || 0, desc: l.desc });
    }
    return Array.from(map.values());
  }, [lines, accounts]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const r = await fetch("/api/practice/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId,
          entriesJson: JSON.stringify(lines),
          isBalanced,
        }),
      });
      if (!r.ok) throw new Error("save failed");
      return r.json();
    },
    onSuccess: () => toast.success(t("practice.saved")),
    onError: () => toast.error(t("common.error")),
  });

  function updateLine(id: string, patch: Partial<JournalLine>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function addLine() { setLines((p) => [...p, emptyLine()]); }
  function removeLine(id: string) {
    setLines((p) => (p.length > 2 ? p.filter((l) => l.id !== id) : p));
  }
  function reset() {
    setLines([emptyLine(), emptyLine()]);
    setShowSolution(false);
  }
  function loadScenario(id: string) {
    setScenarioId(id);
    setLines([emptyLine(), emptyLine()]);
    setShowSolution(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("practice.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("practice.subtitle")}</p>
      </div>

      {/* Scenario selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("practice.scenarios")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => loadScenario(s.id)}
                className={`focus-ring rounded-lg border p-3 text-left text-sm transition-colors ${
                  s.id === scenarioId
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                <div className="font-medium">
                  {locale === "ms" ? s.titleMs : s.titleEn}
                </div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {locale === "ms" ? s.descMs : s.descEn}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario description */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {locale === "ms" ? "S" : "S"}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                {t("practice.scenario")}
              </div>
              <div className="mt-1 text-sm font-medium">
                {locale === "ms" ? scenario.titleMs : scenario.titleEn}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {locale === "ms" ? scenario.descMs : scenario.descEn}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)]">
        {/* Journal entry builder */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Journal Entry</CardTitle>
              <CardDescription className="text-xs">
                {locale === "ms"
                  ? "Pilih akaun, masukkan jumlah debit atau kredit."
                  : "Pick an account, enter a debit or credit amount."}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={reset} className="gap-1">
                <RotateCcw className="h-3.5 w-3.5" /> {t("practice.reset")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSolution((v) => !v)}
                className="gap-1"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                {showSolution ? t("practice.hideSolution") : t("practice.showSolution")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-2 pr-2 font-medium">{t("practice.account")}</th>
                    <th className="px-2 py-2 font-medium text-right">{t("practice.debit")}</th>
                    <th className="px-2 py-2 font-medium text-right">{t("practice.credit")}</th>
                    <th className="px-2 py-2 font-medium">{t("practice.description")}</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, idx) => (
                    <tr key={l.id} className="border-b border-border/60">
                      <td className="py-2 pr-2">
                        <Select
                          value={l.accountEn}
                          onValueChange={(v) => {
                            const acc = accounts.find((a) => `${a.code} ${a.nameEn}` === v);
                            updateLine(l.id, {
                              accountEn: v,
                              accountMs: acc?.nameMs ?? "",
                            });
                          }}
                        >
                          <SelectTrigger className="h-9 min-w-[180px]">
                            <SelectValue placeholder={locale === "ms" ? "Pilih akaun…" : "Select account…"} />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((a) => (
                              <SelectItem key={a.code} value={`${a.code} ${a.nameEn}`}>
                                <span className="font-mono text-xs text-muted-foreground">{a.code}</span>{" "}
                                {locale === "ms" ? a.nameMs : a.nameEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          type="number"
                          min={0}
                          value={l.debit || ""}
                          onChange={(e) =>
                            updateLine(l.id, {
                              debit: Number(e.target.value) || 0,
                              credit: 0,
                            })
                          }
                          className="h-9 text-right font-mono"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          type="number"
                          min={0}
                          value={l.credit || ""}
                          onChange={(e) =>
                            updateLine(l.id, {
                              credit: Number(e.target.value) || 0,
                              debit: 0,
                            })
                          }
                          className="h-9 text-right font-mono"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          value={l.desc ?? ""}
                          onChange={(e) => updateLine(l.id, { desc: e.target.value })}
                          className="h-9"
                          placeholder={locale === "ms" ? "Penerangan…" : "Description…"}
                        />
                      </td>
                      <td className="py-2 pl-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeLine(l.id)}
                          disabled={lines.length <= 2}
                          aria-label="Remove line"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-foreground/70">
                    <td className="py-2 pr-2 text-right text-xs font-semibold uppercase text-muted-foreground">
                      {t("practice.totalDebits")} / {t("practice.totalCredits")}
                    </td>
                    <td className="px-2 py-2 text-right font-mono font-semibold">
                      {totalDebits.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 text-right font-mono font-semibold">
                      {totalCredits.toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={addLine} className="gap-1">
                <Plus className="h-3.5 w-3.5" /> {t("practice.addEntry")}
              </Button>
              <Button
                size="sm"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || totalDebits === 0}
                className="gap-1"
              >
                <Save className="h-3.5 w-3.5" /> {t("practice.saveAttempt")}
              </Button>
              <div className="ml-auto">
                {isBalanced ? (
                  <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t("practice.balanced")}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> {t("practice.unbalanced")}
                  </Badge>
                )}
              </div>
            </div>

            {showSolution && (
              <div className="mt-4 rounded-md border border-amber-300/50 bg-amber-50 p-3 text-sm dark:bg-amber-950/30">
                <div className="mb-2 flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-semibold">
                    {locale === "ms" ? "Penyelesaian" : "Solution"}
                  </span>
                </div>
                <ul className="space-y-1 text-xs">
                  {scenario.solution.map((s, i) => (
                    <li key={i} className="font-mono">
                      {s.debit > 0 ? "Dr" : "Cr"} {s.account} —{" "}
                      <span className="font-semibold">
                        RM {(s.debit || s.credit).toLocaleString()}
                      </span>
                      {s.desc && <span className="text-muted-foreground"> ({s.desc})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live T-accounts */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">{t("practice.tAccounts")}</CardTitle>
            <CardDescription className="text-xs">
              {locale === "ms"
                ? "Dikemas kini secara langsung semasa anda menaip."
                : "Updates live as you type."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tAccountMap.length === 0 ? (
              <div className="grid h-40 place-items-center rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
                {t("practice.emptyTAccounts")}
              </div>
            ) : (
              <div className="grid max-h-[600px] gap-3 overflow-y-auto scroll-area-thin pr-1">
                {tAccountMap.map(({ account, entries }) => (
                  <TAccount
                    key={account.code}
                    accountName={`${account.code} ${account.nameEn}`}
                    accountNameMs={`${account.code} ${account.nameMs}`}
                    category={account.category}
                    entries={entries}
                  />
                ))}
              </div>
            )}

            <div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs">
              <div className="mb-1 font-semibold">{t("practice.balance")}</div>
              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-muted-foreground">
                  Dr: <span className="font-mono font-semibold">{totalDebits.toLocaleString()}</span>
                  {"  ·  "}
                  Cr: <span className="font-mono font-semibold">{totalCredits.toLocaleString()}</span>
                  {"  ·  "}
                  Δ:{" "}
                  <span className={`font-mono font-semibold ${isBalanced ? "text-emerald-600" : "text-destructive"}`}>
                    {Math.abs(totalDebits - totalCredits).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
