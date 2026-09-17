"use client";

import { useI18n } from "@/lib/i18n";

export type JournalLine = {
  id: string;
  accountEn: string;
  accountMs: string;
  debit: number;
  credit: number;
  desc?: string;
};

type TAccountProps = {
  accountName: string;
  accountNameMs: string;
  category: string;
  entries: { side: "debit" | "credit"; amount: number; desc?: string }[];
};

export function TAccount({ accountName, accountNameMs, category, entries }: TAccountProps) {
  const { t, locale } = useI18n();
  const debitEntries = entries.filter((e) => e.side === "debit");
  const creditEntries = entries.filter((e) => e.side === "credit");
  const totalDebit = debitEntries.reduce((s, e) => s + e.amount, 0);
  const totalCredit = creditEntries.reduce((s, e) => s + e.amount, 0);
  const balance = totalDebit - totalCredit;
  const balanceSide = balance >= 0 ? "debit" : "credit";

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
      <div className="mb-2 text-center">
        <div className="text-sm font-semibold">{locale === "ms" ? accountNameMs : accountName}</div>
        <div className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
          {t(`cat.${category}`)}
        </div>
      </div>
      <div className="grid grid-cols-2 border-t-2 border-b-2 border-foreground/70 text-xs">
        <div className="border-r border-border p-2">
          <div className="mb-1 text-center font-bold uppercase text-muted-foreground">Debit</div>
          <div className="space-y-1">
            {debitEntries.length === 0 && (
              <div className="text-center text-muted-foreground/60 italic">—</div>
            )}
            {debitEntries.map((e, i) => (
              <div key={i} className="flex justify-between gap-1">
                <span className="truncate text-muted-foreground">{e.desc ?? ""}</span>
                <span className="font-mono">{e.amount.toLocaleString()}</span>
              </div>
            ))}
            {balanceSide === "debit" && balance !== 0 && (
              <div className="mt-1 flex justify-between border-t border-dashed pt-1 font-semibold">
                <span className="italic">Bal c/d</span>
                <span className="font-mono">{Math.abs(balance).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-2">
          <div className="mb-1 text-center font-bold uppercase text-muted-foreground">Credit</div>
          <div className="space-y-1">
            {creditEntries.length === 0 && (
              <div className="text-center text-muted-foreground/60 italic">—</div>
            )}
            {creditEntries.map((e, i) => (
              <div key={i} className="flex justify-between gap-1">
                <span className="truncate text-muted-foreground">{e.desc ?? ""}</span>
                <span className="font-mono">{e.amount.toLocaleString()}</span>
              </div>
            ))}
            {balanceSide === "credit" && balance !== 0 && (
              <div className="mt-1 flex justify-between border-t border-dashed pt-1 font-semibold">
                <span className="italic">Bal c/d</span>
                <span className="font-mono">{Math.abs(balance).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[0.7rem]">
        <span className="text-muted-foreground">
          Σ Dr: <span className="font-mono font-semibold">{totalDebit.toLocaleString()}</span>
        </span>
        <span className="text-muted-foreground">
          Σ Cr: <span className="font-mono font-semibold">{totalCredit.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}
