import { BarChart3, Clapperboard, Code2, Lightbulb, Palette, PenTool } from "lucide-react";

import type { Discipline } from "@/data/portfolio";

const ICONS = {
  cinema: Clapperboard,
  writing: PenTool,
  analytics: BarChart3,
  tech: Code2,
  creative: Palette,
  impact: Lightbulb,
} as const satisfies Record<Discipline, unknown>;

export function DisciplineIcon({ id }: { id: Discipline }) {
  const Icon = ICONS[id];
  return <Icon className="rail__icon" strokeWidth={1.6} aria-hidden="true" />;
}
