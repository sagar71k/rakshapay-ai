import { errorResponse, json, readJson } from "@/lib/api/http";
import { transactionBodySchema } from "@/lib/api/schemas";
import { evaluateRisk } from "@/lib/risk/risk-engine";
import { computeTransactionRisk, inferTransactionFlags } from "@/lib/risk/transaction-risk";
import { computeDeviceRisk } from "@/lib/security/device-risk";
import { analyzeUrl } from "@/lib/security/url-analyzer";
import { fallbackScamAnalysis, messageRiskFromAnalysis } from "@/lib/ai/fallback";

export async function POST(request: Request) {
  try {
    const body = transactionBodySchema.parse(await readJson(request));
    if (body.amount <= 0) {
      return json({ error: "Amount must be greater than 0" }, 400);
    }
    const message = body.messageContext ? fallbackScamAnalysis(body.messageContext) : null;
    const url = body.suspiciousUrl ? analyzeUrl(body.suspiciousUrl) : null;
    const device = computeDeviceRisk(
      body.device ?? {
        remoteAccess: false,
        screenSharing: false,
        unknownSource: false,
        accessibilityRisk: false,
      },
    );
    const flags = inferTransactionFlags(
      {
        ...body,
        knownRecipient: body.knownRecipient ?? !body.newRecipient,
        messageContext: body.messageContext ?? "",
        suspiciousUrl: body.suspiciousUrl ?? "",
        device: body.device ?? {
          remoteAccess: false,
          screenSharing: false,
          unknownSource: false,
          accessibilityRisk: false,
        },
      },
      { paymentRequest: message?.payment_request, urgencyScore: message?.urgency_score },
    );
    const tx = computeTransactionRisk({
      amount: body.amount,
      newRecipient: body.newRecipient,
      knownRecipient: body.knownRecipient ?? !body.newRecipient,
      ...flags,
    });
    const risk = evaluateRisk({
      breakdown: {
        messageRisk: message ? messageRiskFromAnalysis(message) : 0,
        urlRisk: url?.risk_score ?? 0,
        deviceRisk: device.score,
        transactionRisk: tx.score,
      },
      contributors: [...device.contributors, ...tx.contributors],
    });
    return json(risk);
  } catch (error) {
    return errorResponse(error);
  }
}
