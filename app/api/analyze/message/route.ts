import { analyzeScamText } from "@/lib/ai/scam-analyzer";
import { messageRiskFromAnalysis } from "@/lib/ai/fallback";
import { errorResponse, json, readJson } from "@/lib/api/http";
import { messageBodySchema } from "@/lib/api/schemas";
import { persistAnalysis, persistThreat } from "@/lib/db/persist";
import { isDemoMode } from "@/lib/demo/mode";
import { newId, truncate } from "@/lib/utils/format";
import { severityFromScore } from "@/lib/risk/risk-config";

export async function POST(request: Request) {
  try {
    const body = messageBodySchema.parse(await readJson(request));
    if (!body.text.trim()) {
      return json({ error: "Message text is required" }, 400);
    }
    const result = await analyzeScamText(body.text, "message");
    const risk_score = messageRiskFromAnalysis(result.analysis);
    const created_at = new Date().toISOString();
    await persistAnalysis({
      id: newId("an"),
      input_type: "message",
      input_text: truncate(body.text, 500),
      scam_detected: result.analysis.scam_detected,
      scam_type: result.analysis.scam_type,
      confidence: result.analysis.confidence,
      risk_score,
      explanation: result.analysis.explanation,
      created_at,
    });
    await persistThreat({
      id: newId("threat"),
      threat_type: result.analysis.scam_type,
      severity: severityFromScore(risk_score),
      description: truncate(result.analysis.explanation, 160),
      source: "message",
      created_at,
      risk_score,
    });
    return json({
      ...result.analysis,
      risk_score,
      usedFallback: result.usedFallback,
      demoMode: result.demoMode || isDemoMode(),
      fallbackMessage: result.usedFallback ? "AI unavailable — fallback security analysis used." : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
