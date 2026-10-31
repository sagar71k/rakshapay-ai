import type { ScamAnalysis, ScamType } from "@/types/analysis";
import { extractUrls } from "@/lib/security/url-analyzer";
import { clampScore } from "@/lib/risk/risk-config";

type Rule = {
  id: string;
  pattern: RegExp;
  scam: ScamType;
  signal: string;
  urgency?: number;
  impersonation?: number;
  financial?: number;
  social?: number;
  remote?: boolean;
  payment?: boolean;
};

const RULES: Rule[] = [
  { id: "kyc", pattern: /\bkyc\b|e-kyc|ekyc/i, scam: "KYC scam", signal: "KYC update language", impersonation: 25, urgency: 15, financial: 10, social: 20 },
  { id: "bank", pattern: /\bbank\b|sbi|hdfc|icici|axis bank|rbi\b/i, scam: "Bank impersonation", signal: "Bank impersonation language", impersonation: 30, social: 15 },
  { id: "block", pattern: /account (will be )?block|block hone wala|permanently block|account suspension|blocked in \d+/i, scam: "Bank impersonation", signal: "Account-block threat", urgency: 30, impersonation: 15, social: 20 },
  { id: "arrest", pattern: /digital arrest|cyber crime police|cybercrime|your aadhaar has been linked|illegal activity/i, scam: "Digital arrest", signal: "Digital arrest / police impersonation", urgency: 35, impersonation: 35, social: 25, financial: 20, payment: true },
  { id: "police", pattern: /\bpolice\b|cid\b|cbi\b|ed\b|enforcement directorate|government authority/i, scam: "Fake police/government authority", signal: "Authority impersonation", impersonation: 30, urgency: 20, social: 15 },
  { id: "otp", pattern: /\botp\b|one time password|share (the )?otp|otp batao/i, scam: "OTP scam", signal: "OTP request", financial: 25, social: 20, payment: true },
  { id: "refund", pattern: /\brefund\b|customer care|customer support/i, scam: "Fake customer support", signal: "Fake support / refund lure", impersonation: 20, financial: 15, social: 15 },
  { id: "anydesk", pattern: /anydesk|teamviewer|ultraviewer|remote access|share your screen|screen share|install this (application|app|support)/i, scam: "Remote-access scam", signal: "Remote-access or screen-share request", remote: true, social: 30, impersonation: 10 },
  { id: "access", pattern: /accessibility permission|accessibility service|unknown source|sideload/i, scam: "Remote-access scam", signal: "Accessibility / unknown-source install request", remote: true, social: 25 },
  { id: "urgent", pattern: /immediately|urgent|abhi|within \d+ minutes|10 minutes|abhi nahi kiya/i, scam: "Other social engineering", signal: "Urgency manipulation", urgency: 30, social: 15 },
  { id: "pay", pattern: /transfer money|verification payment|pay now|upi|send ₹|send rs|payment karo/i, scam: "Payment request scam", signal: "Payment / transfer request", financial: 30, payment: true, social: 10 },
  { id: "prize", pattern: /\bprize\b|\breward\b|you have won|lottery/i, scam: "Prize/reward scam", signal: "Prize or reward lure", financial: 20, social: 15 },
  { id: "invest", pattern: /\binvestment\b|guaranteed return|trading tip|crypto profit/i, scam: "Investment scam", signal: "Investment lure", financial: 25, social: 10 },
  { id: "job", pattern: /work from home|part[- ]time job|pay registration fee/i, scam: "Job scam", signal: "Job / registration-fee lure", financial: 20, social: 10 },
  { id: "delivery", pattern: /parcel|courier|delivery failed|customs fee/i, scam: "Delivery scam", signal: "Delivery / customs fee lure", financial: 15, social: 10 },
];

export function fallbackScamAnalysis(text: string): ScamAnalysis {
  const content = text.trim();
  if (!content) {
    return {
      scam_detected: false,
      scam_type: "None",
      confidence: 0,
      urgency_score: 0,
      impersonation_score: 0,
      financial_request_score: 0,
      social_engineering_score: 0,
      remote_access_request: false,
      payment_request: false,
      suspicious_urls: [],
      signals: [],
      explanation: "No message content was provided.",
    };
  }

  let urgency = 0;
  let impersonation = 0;
  let financial = 0;
  let social = 0;
  let remote = false;
  let payment = false;
  const signals: string[] = [];
  const vote = new Map<ScamType, number>();

  for (const rule of RULES) {
    if (!rule.pattern.test(content)) continue;
    signals.push(rule.signal);
    urgency += rule.urgency ?? 0;
    impersonation += rule.impersonation ?? 0;
    financial += rule.financial ?? 0;
    social += rule.social ?? 0;
    remote = remote || Boolean(rule.remote);
    payment = payment || Boolean(rule.payment);
    vote.set(rule.scam, (vote.get(rule.scam) ?? 0) + 1);
  }

  const urls = extractUrls(content);
  if (urls.length) {
    signals.push("Embedded URL in message");
    social += 10;
  }

  const scam_type =
    [...vote.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
    (signals.length ? "Other social engineering" : "None");

  const social_engineering_score = clampScore(social + Math.min(20, signals.length * 4));
  const urgency_score = clampScore(urgency);
  const impersonation_score = clampScore(impersonation);
  const financial_request_score = clampScore(financial);
  const confidence = clampScore(
    Math.max(urgency_score, impersonation_score, financial_request_score, social_engineering_score),
  );
  const scam_detected = signals.length >= 2 || confidence >= 40;

  return {
    scam_detected,
    scam_type: scam_detected ? scam_type : "None",
    confidence,
    urgency_score,
    impersonation_score,
    financial_request_score,
    social_engineering_score,
    remote_access_request: remote,
    payment_request: payment,
    suspicious_urls: urls,
    signals: [...new Set(signals)],
    explanation: scam_detected
      ? `Fallback security analysis found ${signals.length} social-engineering signal(s), including ${signals.slice(0, 3).join(", ")}.`
      : "Fallback security analysis did not find a strong social-engineering pattern.",
  };
}

export function messageRiskFromAnalysis(analysis: ScamAnalysis): number {
  if (!analysis.scam_detected && analysis.confidence < 20) {
    return clampScore(Math.max(analysis.social_engineering_score * 0.2, analysis.confidence * 0.15));
  }
  const weighted =
    analysis.urgency_score * 0.25 +
    analysis.impersonation_score * 0.3 +
    analysis.financial_request_score * 0.2 +
    analysis.social_engineering_score * 0.25;
  const remoteBoost = analysis.remote_access_request ? 15 : 0;
  const detectedFloor = analysis.scam_detected ? Math.max(analysis.confidence, weighted) : weighted;
  return clampScore(detectedFloor + remoteBoost);
}
