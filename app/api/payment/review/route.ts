import { errorResponse, json, readJson } from "@/lib/api/http";
import { paymentReviewSchema } from "@/lib/api/schemas";
import { reviewPayment } from "@/lib/payment/review";

export async function POST(request: Request) {
  try {
    const body = paymentReviewSchema.parse(await readJson(request));
    if (body.amount <= 0) {
      return json({ error: "Amount must be greater than 0" }, 400);
    }
    if (!body.recipientUpi.includes("@")) {
      return json({ error: "Enter a fictional UPI ID such as name@oksbi" }, 400);
    }
    const result = await reviewPayment({
      amount: body.amount,
      recipientName: body.recipientName,
      recipientUpi: body.recipientUpi,
      newRecipient: body.newRecipient,
      knownRecipient: body.knownRecipient ?? !body.newRecipient,
      messageContext: body.messageContext ?? "",
      suspiciousUrl: body.suspiciousUrl ?? "",
      device: body.device ?? {
        remoteAccess: false,
        screenSharing: false,
        unknownSource: false,
        accessibilityRisk: false,
      },
      paymentRequest: body.paymentRequest,
      urgentPayment: body.urgentPayment,
      unusualTransaction: body.unusualTransaction,
    });
    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
