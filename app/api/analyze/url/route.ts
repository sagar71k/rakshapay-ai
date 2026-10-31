import { errorResponse, json, readJson } from "@/lib/api/http";
import { urlBodySchema } from "@/lib/api/schemas";
import { persistThreat } from "@/lib/db/persist";
import { analyzeUrl } from "@/lib/security/url-analyzer";
import { severityFromScore } from "@/lib/risk/risk-config";
import { newId, truncate } from "@/lib/utils/format";

export async function POST(request: Request) {
  try {
    const body = urlBodySchema.parse(await readJson(request));
    if (!body.url.trim()) {
      return json({ error: "URL is required" }, 400);
    }
    const analysis = analyzeUrl(body.url);
    await persistThreat({
      id: newId("threat"),
      threat_type: analysis.suspicious ? "Suspicious URL" : "URL inspection",
      severity: severityFromScore(analysis.risk_score),
      description: truncate(analysis.explanation, 160),
      source: "url",
      created_at: new Date().toISOString(),
      risk_score: analysis.risk_score,
    });
    return json(analysis);
  } catch (error) {
    return errorResponse(error);
  }
}
