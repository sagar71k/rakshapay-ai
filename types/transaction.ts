import type { Decision, RiskContributor, ThreatLevel } from "./risk";
import type { DeviceSignals, ScamAnalysis, UrlAnalysis } from "./analysis";

export type TransactionInput = {
  amount: number;
  recipientName: string;
  recipientUpi: string;
  newRecipient: boolean;
  knownRecipient: boolean;
  messageContext: string;
  suspiciousUrl: string;
  device: DeviceSignals;
  paymentRequest?: boolean;
  urgentPayment?: boolean;
  unusualTransaction?: boolean;
};

export type PaymentReviewResult = {
  simulated: true;
  label: "SIMULATED UPI PAYMENT";
  amount: number;
  recipientName: string;
  recipientUpi: string;
  newRecipient: boolean;
  messageAnalysis: ScamAnalysis | null;
  urlAnalysis: UrlAnalysis | null;
  deviceRisk: number;
  transactionRisk: number;
  messageRisk: number;
  urlRisk: number;
  score: number;
  severity: ThreatLevel;
  decision: Decision;
  contributors: RiskContributor[];
  explanation: string;
  attackChain: string[];
  usedFallback: boolean;
  demoMode: boolean;
};
