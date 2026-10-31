import type { Decision } from "@/types/risk";
import { cn } from "@/lib/utils/cn";

const STYLES: Record<Decision, string> = {
  ALLOW: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  VERIFY: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  HOLD: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  BLOCK: "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

export function DecisionBadge({
  decision,
  className,
}: {
  decision: Decision;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-[0.14em]",
        STYLES[decision],
        className,
      )}
    >
      {decision}
    </span>
  );
}
