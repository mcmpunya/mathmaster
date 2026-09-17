"use client";

import { Fragment } from "react";

export function MarkdownLite({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((para, pi) => {
        const lines = para.split(/\n/);
        const isBulletList = lines.every(
          (l) => /^\s*[-•]\s+/.test(l) || /^\s*\(\d+\)\s+/.test(l)
        );
        if (isBulletList) {
          return (
            <ul key={pi} className="my-3 space-y-1.5 pl-1">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2 text-[0.95rem] leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                  <span>{renderInline(l.replace(/^\s*[-•]\s+|^\s*\(\d+\)\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={pi} className="my-2 text-[0.95rem] leading-relaxed">
            {renderInline(para)}
          </p>
        );
      })}
    </>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}
