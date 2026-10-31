export function ThreatCard({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
      <p className="text-sm text-slate-200">{title}</p>
      {detail ? <p className="text-xs text-slate-500">{detail}</p> : null}
    </div>
  );
}
