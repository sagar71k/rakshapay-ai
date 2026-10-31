import type { AnalysisRecord, ThreatRecord } from "@/types/analysis";
import type { Decision } from "@/types/risk";

export type TransactionRecord = {
  id: string;
  amount: number;
  recipient_name: string;
  recipient_upi: string;
  new_recipient: boolean;
  message_risk: number;
  url_risk: number;
  device_risk: number;
  transaction_risk: number;
  final_risk: number;
  decision: Decision;
  created_at: string;
};

const analyses: AnalysisRecord[] = [];
const transactions: TransactionRecord[] = [];
const threats: ThreatRecord[] = seedThreats();

function seedThreats(): ThreatRecord[] {
  const now = Date.now();
  return [
    {
      id: "seed_1",
      threat_type: "KYC scam",
      severity: "HIGH",
      description: "Fake KYC scam detected",
      source: "message",
      created_at: new Date(now - 1000 * 60 * 21).toISOString(),
      decision: "HOLD",
      risk_score: 72,
    },
    {
      id: "seed_2",
      threat_type: "Suspicious URL",
      severity: "HIGH",
      description: "Suspicious URL analyzed",
      source: "url",
      created_at: new Date(now - 1000 * 60 * 26).toISOString(),
      decision: "VERIFY",
      risk_score: 64,
    },
    {
      id: "seed_3",
      threat_type: "Safe payment",
      severity: "SAFE",
      description: "Safe payment verified",
      source: "payment",
      created_at: new Date(now - 1000 * 60 * 41).toISOString(),
      decision: "ALLOW",
      risk_score: 8,
    },
  ];
}

export const memoryStore = {
  analyses,
  transactions,
  threats,
  addAnalysis(record: AnalysisRecord) {
    analyses.unshift(record);
    if (analyses.length > 80) analyses.pop();
  },
  addTransaction(record: TransactionRecord) {
    transactions.unshift(record);
    if (transactions.length > 80) transactions.pop();
  },
  addThreat(record: ThreatRecord) {
    threats.unshift(record);
    if (threats.length > 80) threats.pop();
  },
  history() {
    return [...threats].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  },
};
