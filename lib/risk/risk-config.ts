import type { Decision, ThreatLevel } from "@/types/risk";

export const RISK_WEIGHTS = {
  messageRisk: 0.3,
  urlRisk: 0.2,
  deviceRisk: 0.25,
  transactionRisk: 0.25,
} as const;

export const DECISION_THRESHOLDS = {
  ALLOW_MAX: 29,
  VERIFY_MAX: 59,
  HOLD_MAX: 79,
} as const;

export const TRANSACTION_RISK_POINTS = {
  newRecipient: 20,
  highAmount: 20,
  paymentRequest: 15,
  urgentPayment: 15,
  unknownRecipient: 15,
  unusualTransaction: 15,
} as const;

export const HIGH_AMOUNT_INR = 5_000;

export const DEVICE_RISK_POINTS = {
  remoteAccess: 40,
  screenSharing: 30,
  unknownSource: 20,
  accessibilityRisk: 10,
} as const;

export const ATTACK_CHAIN_BONUS = {
  elevatedAt: 20,
  threeSignals: 8,
  fourSignals: 12,
} as const;

export function clampScore(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function decisionFromScore(score: number): Decision {
  const clamped = clampScore(score);
  if (clamped <= DECISION_THRESHOLDS.ALLOW_MAX) return "ALLOW";
  if (clamped <= DECISION_THRESHOLDS.VERIFY_MAX) return "VERIFY";
  if (clamped <= DECISION_THRESHOLDS.HOLD_MAX) return "HOLD";
  return "BLOCK";
}

export function severityFromScore(score: number): ThreatLevel {
  const clamped = clampScore(score);
  if (clamped <= 19) return "SAFE";
  if (clamped <= 29) return "LOW";
  if (clamped <= 59) return "MEDIUM";
  if (clamped <= 79) return "HIGH";
  return "CRITICAL";
}
