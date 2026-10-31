import type { ScamAnalysis } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";

export function ScamAnalysisCard({
  analysis,
  fallbackMessage,
}: {
  analysis: ScamAnalysis;
  fallbackMessage?: string | null;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold tracking-wide">Scam analysis</h3>
        <Badge className={analysis.scam_detected ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : ""}>
          {analysis.scam_detected ? "SCAM SIGNALS" : "NO SCAM PATTERN"}
        </Badge>
      </div>
      {fallbackMessage ? (
        <p className="mb-3 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
          {fallbackMessage}
        </p>
      ) : null}
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-slate-400">Type</dt>
          <dd>{analysis.scam_type}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Confidence</dt>
          <dd className="font-mono">{analysis.confidence}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Urgency</dt>
          <dd className="font-mono">{analysis.urgency_score}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Impersonation</dt>
          <dd className="font-mono">{analysis.impersonation_score}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-slate-300">{analysis.explanation}</p>
      {analysis.signals.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {analysis.signals.map((signal) => (
            <li
              key={signal}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-300"
            >
              {signal}
            </li>
            
          ))}
        </ul>
      ) : null}
    </div>
  );
}
