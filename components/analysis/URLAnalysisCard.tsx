import type { UrlAnalysis } from "@/types/analysis";

export function URLAnalysisCard({ analysis }: { analysis: UrlAnalysis }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-2 text-sm font-semibold tracking-wide">URL inspection</h3>
      <p className="font-mono text-2xl text-cyan-200">{analysis.risk_score}/100</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{analysis.explanation}</p>
      {analysis.indicators.length ? (
        <ul className="mt-3 space-y-1 text-sm text-slate-300">
          {analysis.indicators.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
