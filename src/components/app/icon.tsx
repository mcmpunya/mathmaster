"use client";

import {
  Calculator,
  FunctionSquare,
  Hash,
  Sigma,
  Grid3X3,
  Triangle,
  BarChart3,
  ArrowLeftRight,
  TrendingUp,
  MoveRight,
  Shuffle,
  HelpCircle,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const map: Record<string, ComponentType<LucideProps>> = {
  Calculator,
  FunctionSquare,
  Hash,
  Sigma,
  Grid3X3,
  Triangle,
  BarChart3,
  ArrowLeftRight,
  TrendingUp,
  MoveRight,
  Shuffle,
};

export function TopicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = map[name] ?? HelpCircle;
  return <Cmp {...props} />;
}
