import type { RiskContributor } from "@/types/risk";

export function ExplainableRisk({
  contributors,
  total,
}: {
  contributors: RiskContributor[];
  total: number;
}) {
  const shown = contributors.filter((c) => c.points > 0).slice(0, 8);
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-slate-400">
        WHY WAS THIS BLOCKED?
      </h3>
      <div className="space-y-2">
        {shown.length === 0 ? (
          <p className="text-sm text-slate-400">No elevated contributors.</p>
        ) : (
          shown.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2"
            >
              <span className="text-sm text-slate-200">{item.label}</span>
              <span className="font-mono text-sm text-rose-300">+{item.points}</span>
            </div>
          ))
        )}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-sm font-semibold text-slate-100">TOTAL</span>
          <span className="font-mono text-sm text-cyan-200">{total} / 100</span>
        </div>
      </div>
    </div>
  );
}
