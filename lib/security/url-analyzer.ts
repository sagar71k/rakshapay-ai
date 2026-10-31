import type { UrlAnalysis } from "@/types/analysis";
import { clampScore } from "@/lib/risk/risk-config";

const SUSPICIOUS_KEYWORDS = [
  "kyc",
  "verify",
  "verification",
  "otp",
  "upi",
  "bank",
  "sbi",
  "hdfc",
  "icici",
  "axis",
  "rbi",
  "aadhaar",
  "aadhar",
  "pan",
  "refund",
  "reward",
  "prize",
  "login",
  "secure-update",
  "account-update",
];

const TYPO_BANK_TOKENS = [
  "sbi-online",
  "sbionlne",
  "hdfcbankk",
  "icicibnk",
  "paytmm",
  "phonepe-secure",
  "gpay-verify",
  "upipay-secure",
];

export function analyzeUrl(raw: string): UrlAnalysis {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      risk_score: 0,
      suspicious: false,
      indicators: [],
      explanation: "No URL provided.",
    };
  }

  let parsed: URL | null = null;
  const candidate = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
  try {
    parsed = new URL(candidate);
  } catch {
    return {
      risk_score: 55,
      suspicious: true,
      indicators: ["Malformed URL structure"],
      explanation: "Suspicious indicators detected. The URL could not be parsed into a valid address.",
    };
  }

  const indicators: string[] = [];
  let score = 0;
  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.replace(":", "");
  const full = `${hostname}${parsed.pathname}${parsed.search}`.toLowerCase();

  if (protocol !== "https") {
    score += 20;
    indicators.push("Non-HTTPS protocol");
  }

  const ipv4 = /^\d{1,3}(\.\d{1,3}){3}$/;
  if (ipv4.test(hostname) || hostname.includes(":")) {
    score += 30;
    indicators.push("IP-based host");
  }

  const labels = hostname.split(".").filter(Boolean);
  if (labels.length >= 4) {
    score += 15;
    indicators.push("Unusual domain structure");
  }

  if (hostname.length > 40 || candidate.length > 120) {
    score += 10;
    indicators.push("Unusually long URL");
  }

  if (/%[0-9a-f]{2}/i.test(parsed.pathname + parsed.search)) {
    score += 12;
    indicators.push("Encoded characters in path or query");
  }

  const keywordHits = SUSPICIOUS_KEYWORDS.filter((k) => full.includes(k));
  if (keywordHits.length) {
    score += Math.min(25, 8 * keywordHits.length);
    indicators.push(`Banking/KYC keywords: ${keywordHits.slice(0, 4).join(", ")}`);
  }

  const typoHits = TYPO_BANK_TOKENS.filter((t) => hostname.includes(t) || full.includes(t));
  if (typoHits.length) {
    score += 25;
    indicators.push("Typosquatting-like patterns");
  }

  if (/login|verify|update|secure|kyc/i.test(parsed.pathname)) {
    score += 10;
    indicators.push("Suspicious path");
  }

  if (hostname.split(".").some((part) => part.length > 20)) {
    score += 8;
    indicators.push("Abnormally long subdomain or label");
  }

  const risk_score = clampScore(score);
  const suspicious = risk_score >= 30;

  let explanation = "No high-risk URL characteristics were detected from static inspection.";
  if (suspicious && risk_score < 60) {
    explanation =
      "Suspicious indicators detected. The link shows high-risk characteristics and should be treated as potentially dangerous.";
  } else if (risk_score >= 60) {
    explanation =
      "High-risk characteristics detected. Multiple URL features resemble phishing or payment-harvesting pages.";
  }

  return {
    risk_score,
    suspicious,
    indicators,
    explanation,
    hostname,
    protocol,
  };
}

export function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s]+|(?:www\.)[^\s]+/gi) ?? [];
  return [...new Set(matches.map((m) => m.replace(/[),.;]+$/, "")))];
}
