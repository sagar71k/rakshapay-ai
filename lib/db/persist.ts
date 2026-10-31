import { getSupabase } from "./supabase";
import { memoryStore, type TransactionRecord } from "./memory-store";
import type { AnalysisRecord, ThreatRecord } from "@/types/analysis";

export async function persistAnalysis(record: AnalysisRecord): Promise<void> {
  memoryStore.addAnalysis(record);
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("analyses").insert(record);
  } catch {
    // Demo continues with in-memory data.
  }
}

export async function persistTransaction(record: TransactionRecord): Promise<void> {
  memoryStore.addTransaction(record);
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("transactions").insert(record);
  } catch {
    // Demo continues with in-memory data.
  }
}

export async function persistThreat(record: ThreatRecord): Promise<void> {
  memoryStore.addThreat(record);
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("threats").insert({
      id: record.id,
      threat_type: record.threat_type,
      severity: record.severity,
      description: record.description,
      source: record.source,
      created_at: record.created_at,
    });
  } catch {
    // Demo continues with in-memory data.
  }
}

export async function loadHistory(): Promise<ThreatRecord[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("threats")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(80);
      if (!error && data?.length) {
        return data as ThreatRecord[];
      }
    } catch {
      // fall through
    }
  }
  return memoryStore.history();
}
