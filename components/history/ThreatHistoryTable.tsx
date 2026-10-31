"use client";

import { useEffect, useMemo, useState } from "react";
import type { Decision } from "@/types/risk";
import type { ThreatRecord } from "@/types/analysis";
import { DecisionBadge } from "@/components/risk/DecisionBadge";
import { formatDateTime } from "@/lib/utils/format";
import { EmptyState, ErrorState, LoadingState } from "@/components/layout/states";

const FILTERS = ["All", "BLOCK", "HOLD", "VERIFY", "ALLOW"] as const;

export function ThreatHistoryTable() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [rows, setRows] = useState<ThreatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/history");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load history");
      setRows(data.history ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return rows;
    return rows.filter((row) => row.decision === filter);
  }, [filter, rows]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full border px-3 py-1 text-xs ${
              filter === item ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-white/10 text-slate-300"
            }`}
          >
            {item === "All" ? "All" : item === "BLOCK" ? "Blocked" : item === "HOLD" ? "Held" : item === "VERIFY" ? "Verified" : "Allowed"}
          </button>
        ))}
      </div>
      {loading ? <LoadingState label="Loading threat history…" /> : null}
      {error ? <ErrorState message={error} onRetry={() => void load()} /> : null}
      {!loading && !error && filtered.length === 0 ? (
        <EmptyState title="No events yet" body="Run a payment review or analyzer to populate this list." />
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">Decision</th>
              <th className="px-3 py-2">Explanation</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-white/5">
                <td className="px-3 py-3 font-mono text-xs text-slate-400">{formatDateTime(row.created_at)}</td>
                <td className="px-3 py-3">{row.threat_type}</td>
                <td className="px-3 py-3 font-mono">{row.risk_score ?? "—"}</td>
                <td className="px-3 py-3">
                  {row.decision ? <DecisionBadge decision={row.decision as Decision} /> : "—"}
                </td>
                <td className="px-3 py-3 text-slate-300">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
