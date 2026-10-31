import { ThreatHistoryTable } from "@/components/history/ThreatHistoryTable";

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Threat history</h1>
      <p className="text-sm text-slate-400">
        Session events are stored in demo memory, and in Supabase when configured.
      </p>
      <ThreatHistoryTable />
    </div>
  );
}
