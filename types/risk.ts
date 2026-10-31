export type ThreatLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Decision = "ALLOW" | "VERIFY" | "HOLD" | "BLOCK";

export type RiskContributor = {
  key: string;
  label: string;
  points: number;
  category: "message" | "url" | "device" | "transaction";
};

export type RiskBreakdown = {
  messageRisk: number;
  urlRisk: number;
  deviceRisk: number;
  transactionRisk: number;
};

export type RiskResult = {
  score: number;
  severity: ThreatLevel;
  decision: Decision;
  contributors: RiskContributor[];
  explanation: string;
  breakdown: RiskBreakdown;
};
