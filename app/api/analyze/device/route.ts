import { errorResponse, json, readJson } from "@/lib/api/http";
import { deviceBodySchema } from "@/lib/api/schemas";
import { computeDeviceRisk } from "@/lib/security/device-risk";

export async function POST(request: Request) {
  try {
    const body = deviceBodySchema.parse(await readJson(request));
    const result = computeDeviceRisk(body);
    return json({
      label: "PROTOTYPE DEVICE SECURITY SIGNAL",
      risk_score: result.score,
      contributors: result.contributors,
      signals: body,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
