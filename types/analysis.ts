export type InputType = "message" | "transcript" | "url" | "device" | "transaction" | "payment";

export type ScamType =
  | "Bank impersonation"
  | "KYC scam"
  | "Digital arrest"
  | "Fake police/government authority"
  | "Fake customer support"
  | "OTP scam"
  | "Payment request scam"
  | "Investment scam"
  | "Prize/reward scam"
  | "Delivery scam"
  | "Remote-access scam"
  | "Job scam"
  | "Other social engineering"
  | "None";

export type ScamAnalysis = {
  scam_detected: boolean;
  scam_type: ScamType;
  confidence: number;
  urgency_score: number;
  impersonation_score: number;
  financial_request_score: number;
  social_engineering_score: number;
  remote_access_request: boolean;
  payment_request: boolean;
  suspicious_urls: string[];
  signals: string[];
  explanation: string;
};

export type UrlAnalysis = {
  risk_score: number;
  suspicious: boolean;
  indicators: string[];
  explanation: string;
  hostname?: string;
  protocol?: string;
};

export type DeviceSignals = {
  remoteAccess: boolean;
  screenSharing: boolean;
  unknownSource: boolean;
  accessibilityRisk: boolean;
};

export type AnalysisRecord = {
  id: string;
  input_type: InputType;
  input_text: string;
  scam_detected: boolean;
  scam_type: string;
  confidence: number;
  risk_score: number;
  explanation: string;
  created_at: string;
};

export type ThreatRecord = {
  id: string;
  threat_type: string;
  severity: string;
  description: string;
  source: string;
  created_at: string;
  decision?: string;
  risk_score?: number;
};
