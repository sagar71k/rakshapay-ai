import type { RiskContributor } from "@/types/risk";
import type { TransactionInput } from "@/types/transaction";
import { HIGH_AMOUNT_INR, TRANSACTION_RISK_POINTS, clampScore } from "./risk-config";

export function computeTransactionRisk(input: {
  amount: number;
  newRecipient: boolean;
  knownRecipient: boolean;
  paymentRequest: boolean;
  urgentPayment: boolean;
  unusualTransaction: boolean;
}): { score: number; contributors: RiskContributor[] } {
  const contributors: RiskContributor[] = [];
  let score = 0;

  if (input.newRecipient) {
    score += TRANSACTION_RISK_POINTS.newRecipient;
    contributors.push({
      key: "new_recipient",
      label: "New recipient",
      points: TRANSACTION_RISK_POINTS.newRecipient,
      category: "transaction",
    });
  }

  if (input.amount >= HIGH_AMOUNT_INR) {
    score += TRANSACTION_RISK_POINTS.highAmount;
    contributors.push({
      key: "high_amount",
      label: "High-value transaction",
      points: TRANSACTION_RISK_POINTS.highAmount,
      category: "transaction",
    });
  }

  if (input.paymentRequest) {
    score += TRANSACTION_RISK_POINTS.paymentRequest;
    contributors.push({
      key: "payment_request",
      label: "Payment request in context",
      points: TRANSACTION_RISK_POINTS.paymentRequest,
      category: "transaction",
    });
  }

  if (input.urgentPayment) {
    score += TRANSACTION_RISK_POINTS.urgentPayment;
    contributors.push({
      key: "urgent_payment",
      label: "Urgent payment pressure",
      points: TRANSACTION_RISK_POINTS.urgentPayment,
      category: "transaction",
    });
  }

  if (!input.knownRecipient) {
    score += TRANSACTION_RISK_POINTS.unknownRecipient;
    contributors.push({
      key: "unknown_recipient",
      label: "Unknown recipient",
      points: TRANSACTION_RISK_POINTS.unknownRecipient,
      category: "transaction",
    });
  }

  if (input.unusualTransaction) {
    score += TRANSACTION_RISK_POINTS.unusualTransaction;
    contributors.push({
      key: "unusual_transaction",
      label: "Unusual transaction pattern",
      points: TRANSACTION_RISK_POINTS.unusualTransaction,
      category: "transaction",
    });
  }

  return { score: clampScore(score), contributors };
}

export function inferTransactionFlags(input: TransactionInput, messageHints?: {
  paymentRequest?: boolean;
  urgencyScore?: number;
}): {
  paymentRequest: boolean;
  urgentPayment: boolean;
  unusualTransaction: boolean;
} {
  const paymentRequest = Boolean(input.paymentRequest || messageHints?.paymentRequest);
  const urgentPayment = Boolean(input.urgentPayment || (messageHints?.urgencyScore ?? 0) >= 60);
  const unusualTransaction = Boolean(
    input.unusualTransaction ||
      (input.newRecipient && input.amount >= HIGH_AMOUNT_INR) ||
      (paymentRequest && urgentPayment),
  );
  return { paymentRequest, urgentPayment, unusualTransaction };
}
