import type { RiskBreakdown, RiskContributor, RiskResult } from "@/types/risk";
import {
  ATTACK_CHAIN_BONUS,
  RISK_WEIGHTS,
  clampScore,
  decisionFromScore,
  severityFromScore,
} from "./risk-config";

export function attackChainBonus(breakdown: RiskBreakdown): number {
  const values = [
    breakdown.messageRisk,
    breakdown.urlRisk,
    breakdown.deviceRisk,
    breakdown.transactionRisk,
  ];
  const elevated = values.filter((v) => v >= ATTACK_CHAIN_BONUS.elevatedAt).length;
  if (elevated >= 4) return ATTACK_CHAIN_BONUS.fourSignals;
  if (elevated >= 3) return ATTACK_CHAIN_BONUS.threeSignals;
  return 0;
}

export function computeFinalScore(breakdown: RiskBreakdown): number {
  const score =
    breakdown.messageRisk * RISK_WEIGHTS.messageRisk +
    breakdown.urlRisk * RISK_WEIGHTS.urlRisk +
    breakdown.deviceRisk * RISK_WEIGHTS.deviceRisk +
    breakdown.transactionRisk * RISK_WEIGHTS.transactionRisk +
    attackChainBonus(breakdown);
  return clampScore(score);
}

export function evaluateRisk(input: {
  breakdown: RiskBreakdown;
  contributors?: RiskContributor[];
  extraExplanation?: string;
}): RiskResult {
  const breakdown: RiskBreakdown = {
    messageRisk: clampScore(input.breakdown.messageRisk),
    urlRisk: clampScore(input.breakdown.urlRisk),
    deviceRisk: clampScore(input.breakdown.deviceRisk),
    transactionRisk: clampScore(input.breakdown.transactionRisk),
  };
  const score = computeFinalScore(breakdown);
  const decision = decisionFromScore(score);
  const severity = severityFromScore(score);
  const contributors = (input.contributors ?? []).filter((c) => c.points > 0);

  const explanation =
    input.extraExplanation ??
    buildExplanation(score, decision, severity, breakdown);

  return { score, severity, decision, contributors, explanation, breakdown };
}

export function buildExplanation(
  score: number,
  decision: string,
  severity: string,
  breakdown: RiskBreakdown,
): string {
  const parts = [
    `Combined protection score is ${score}/100 (${severity}).`,
    `Signals: message ${breakdown.messageRisk}, URL ${breakdown.urlRisk}, device ${breakdown.deviceRisk}, transaction ${breakdown.transactionRisk}.`,
  ];
  if (decision === "ALLOW") {
    parts.push("No high-risk attack chain was detected. Simulated payment may proceed.");
  } else if (decision === "VERIFY") {
    parts.push("Additional verification is recommended before authorization.");
  } else if (decision === "HOLD") {
    parts.push("Payment is held pending a security review of the attack chain.");
  } else {
    parts.push("Payment is blocked because multiple social-engineering signals align.");
  }
  return parts.join(" ");
}

export function buildAttackChain(steps: Array<string | false | null | undefined>): string[] {
  return ["Message / context captured", ...steps.filter((s): s is string => Boolean(s)), "Risk engine evaluated"];
}
