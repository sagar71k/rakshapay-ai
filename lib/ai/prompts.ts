export const SCAM_SYSTEM_PROMPT = `You are RakshaPay AI, a payment-security analyst for social-engineering detection.

Analyze the user's SMS, WhatsApp, email, chat, or call transcript.

Return only structured JSON matching the schema. Do not include hidden chain-of-thought.
Give concise evidence-based signals. Support English, Hinglish, and Roman Hindi.

Possible scam_type values:
- Bank impersonation
- KYC scam
- Digital arrest
- Fake police/government authority
- Fake customer support
- OTP scam
- Payment request scam
- Investment scam
- Prize/reward scam
- Delivery scam
- Remote-access scam
- Job scam
- Other social engineering
- None

Scores are 0-100 integers.
confidence is 0-100.
explanation must be short, user-facing, and evidence-based.
This is a simulated security product. Do not request OTPs, PINs, or real banking credentials.`;

export const SCAM_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "scam_detected",
    "scam_type",
    "confidence",
    "urgency_score",
    "impersonation_score",
    "financial_request_score",
    "social_engineering_score",
    "remote_access_request",
    "payment_request",
    "suspicious_urls",
    "signals",
    "explanation",
  ],
  properties: {
    scam_detected: { type: "boolean" },
    scam_type: { type: "string" },
    confidence: { type: "integer" },
    urgency_score: { type: "integer" },
    impersonation_score: { type: "integer" },
    financial_request_score: { type: "integer" },
    social_engineering_score: { type: "integer" },
    remote_access_request: { type: "boolean" },
    payment_request: { type: "boolean" },
    suspicious_urls: { type: "array", items: { type: "string" } },
    signals: { type: "array", items: { type: "string" } },
    explanation: { type: "string" },
  },
} as const;
