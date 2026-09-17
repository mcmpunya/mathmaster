"use client";

import { Calculator } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30 pb-16 pt-6 lg:pb-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Calculator className="h-4 w-4 text-primary" />
          <span className="font-semibold">{t("app.title")}</span>
          <span className="hidden text-muted-foreground sm:inline">— {t("footer.tagline")}</span>
        </div>
        <div className="text-xs text-muted-foreground">{t("footer.disclaimer")}</div>
      </div>
    </footer>
  );
}
