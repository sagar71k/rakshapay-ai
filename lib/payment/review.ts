import { analyzeScamText } from "@/lib/ai/scam-analyzer";
import { messageRiskFromAnalysis } from "@/lib/ai/fallback";
import { persistAnalysis, persistThreat, persistTransaction } from "@/lib/db/persist";
import { isDemoMode } from "@/lib/demo/mode";
import { evaluateRisk } from "@/lib/risk/risk-engine";
import { computeTransactionRisk, inferTransactionFlags } from "@/lib/risk/transaction-risk";
import { computeDeviceRisk } from "@/lib/security/device-risk";
import { analyzeUrl } from "@/lib/security/url-analyzer";
import { newId, truncate } from "@/lib/utils/format";
import type { DeviceSignals, ScamAnalysis } from "@/types/analysis";
import type { RiskContributor } from "@/types/risk";
import type { PaymentReviewResult, TransactionInput } from "@/types/transaction";

function emptyDevice(): DeviceSignals {
  return {
    remoteAccess: false,
    screenSharing: false,
    unknownSource: false,
    accessibilityRisk: false,
  };
}

export async function reviewPayment(input: TransactionInput): Promise<PaymentReviewResult> {
  const device = input.device ?? emptyDevice();
  let messageAnalysis: ScamAnalysis | null = null;
  let usedFallback = false;

  if (input.messageContext.trim()) {
    const result = await analyzeScamText(input.messageContext, "message");
    messageAnalysis = result.analysis;
    usedFallback = result.usedFallback;
  }

  const urlAnalysis = input.suspiciousUrl.trim() ? analyzeUrl(input.suspiciousUrl) : null;
  const deviceEval = computeDeviceRisk(device);
  const flags = inferTransactionFlags(input, {
    paymentRequest: messageAnalysis?.payment_request,
    urgencyScore: messageAnalysis?.urgency_score,
  });
  const txEval = computeTransactionRisk({
    amount: input.amount,
    newRecipient: input.newRecipient,
    knownRecipient: input.knownRecipient,
    ...flags,
  });

  const messageRisk = messageAnalysis ? messageRiskFromAnalysis(messageAnalysis) : 0;
  const urlRisk = urlAnalysis?.risk_score ?? 0;

  const contributors: RiskContributor[] = [];
  if (messageAnalysis) {
    if (messageAnalysis.scam_detected) {
      contributors.push({
        key: "scam_type",
        label: messageAnalysis.scam_type,
        points: Math.round(messageRisk * 0.35),
        category: "message",
      });
    }
    if (messageAnalysis.urgency_score >= 40) {
      contributors.push({
        key: "urgency",
        label: "Urgency / threat language",
        points: Math.round(messageAnalysis.urgency_score * 0.25),
        category: "message",
      });
    }
    if (messageAnalysis.impersonation_score >= 40) {
      contributors.push({
        key: "impersonation",
        label: "Authority / bank impersonation",
        points: Math.round(messageAnalysis.impersonation_score * 0.25),
        category: "message",
      });
    }
    if (messageAnalysis.remote_access_request) {
      contributors.push({
        key: "remote_msg",
        label: "Remote-access request in message",
        points: 12,
        category: "message",
      });
    }
  }
  if (urlAnalysis?.suspicious) {
    contributors.push({
      key: "url",
      label: "Suspicious URL detected",
      points: Math.round(urlRisk * 0.35),
      category: "url",
    });
  }
  contributors.push(...deviceEval.contributors, ...txEval.contributors);

  const risk = evaluateRisk({
    breakdown: {
      messageRisk,
      urlRisk,
      deviceRisk: deviceEval.score,
      transactionRisk: txEval.score,
    },
    contributors,
  });

  const attackChain = [
    "Message received",
    messageAnalysis?.scam_detected ? `${messageAnalysis.scam_type} detected` : null,
    (messageAnalysis?.urgency_score ?? 0) >= 40 ? "Urgency manipulation detected" : null,
    urlAnalysis?.suspicious ? "Suspicious URL detected" : null,
    device.remoteAccess || messageAnalysis?.remote_access_request
      ? "Remote-access risk detected"
      : null,
    input.newRecipient ? "New UPI recipient detected" : null,
    input.amount >= 5000 ? "High-value transaction detected" : null,
    `Risk score: ${risk.score}`,
    risk.decision === "BLOCK"
      ? "PAYMENT BLOCKED"
      : risk.decision === "HOLD"
        ? "PAYMENT HELD"
        : risk.decision === "VERIFY"
          ? "VERIFICATION REQUIRED"
          : "PAYMENT ALLOWED",
  ].filter((s): s is string => Boolean(s));

  const created_at = new Date().toISOString();
  const threatId = newId("threat");

  await persistThreat({
    id: threatId,
    threat_type: messageAnalysis?.scam_type || (urlAnalysis?.suspicious ? "Suspicious URL" : "Payment review"),
    severity: risk.severity,
    description: truncate(risk.explanation, 160),
    source: "payment",
    created_at,
    decision: risk.decision,
    risk_score: risk.score,
  });

  await persistTransaction({
    id: newId("txn"),
    amount: input.amount,
    recipient_name: input.recipientName,
    recipient_upi: input.recipientUpi,
    new_recipient: input.newRecipient,
    message_risk: messageRisk,
    url_risk: urlRisk,
    device_risk: deviceEval.score,
    transaction_risk: txEval.score,
    final_risk: risk.score,
    decision: risk.decision,
    created_at,
  });

  if (messageAnalysis) {
    await persistAnalysis({
      id: newId("an"),
      input_type: "message",
      input_text: truncate(input.messageContext, 500),
      scam_detected: messageAnalysis.scam_detected,
      scam_type: messageAnalysis.scam_type,
      confidence: messageAnalysis.confidence,
      risk_score: messageRisk,
      explanation: messageAnalysis.explanation,
      created_at,
    });
  }

  return {
    simulated: true,
    label: "SIMULATED UPI PAYMENT",
    amount: input.amount,
    recipientName: input.recipientName,
    recipientUpi: input.recipientUpi,
    newRecipient: input.newRecipient,
    messageAnalysis,
    urlAnalysis,
    deviceRisk: deviceEval.score,
    transactionRisk: txEval.score,
    messageRisk,
    urlRisk,
    score: risk.score,
    severity: risk.severity,
    decision: risk.decision,
    contributors: risk.contributors,
    explanation: risk.explanation,
    attackChain,
    usedFallback,
    demoMode: isDemoMode() || usedFallback,
  };
}
