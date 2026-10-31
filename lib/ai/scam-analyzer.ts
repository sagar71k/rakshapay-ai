import { z } from "zod";
import { getOpenAIClient } from "./openai";
import { SCAM_JSON_SCHEMA, SCAM_SYSTEM_PROMPT } from "./prompts";
import { fallbackScamAnalysis } from "./fallback";
import { isOpenAiConfigured } from "@/lib/demo/mode";
import type { ScamAnalysis, ScamType } from "@/types/analysis";

const scamTypeSchema = z.enum([
  "Bank impersonation",
  "KYC scam",
  "Digital arrest",
  "Fake police/government authority",
  "Fake customer support",
  "OTP scam",
  "Payment request scam",
  "Investment scam",
  "Prize/reward scam",
  "Delivery scam",
  "Remote-access scam",
  "Job scam",
  "Other social engineering",
  "None",
]);

export const scamAnalysisSchema = z.object({
  scam_detected: z.boolean(),
  scam_type: z.string().transform((v) => {
    const parsed = scamTypeSchema.safeParse(v);
    return (parsed.success ? parsed.data : "Other social engineering") as ScamType;
  }),
  confidence: z.number().min(0).max(100),
  urgency_score: z.number().min(0).max(100),
  impersonation_score: z.number().min(0).max(100),
  financial_request_score: z.number().min(0).max(100),
  social_engineering_score: z.number().min(0).max(100),
  remote_access_request: z.boolean(),
  payment_request: z.boolean(),
  suspicious_urls: z.array(z.string()),
  signals: z.array(z.string()),
  explanation: z.string(),
});

export type AnalyzeResult = {
  analysis: ScamAnalysis;
  usedFallback: boolean;
  demoMode: boolean;
};

export async function analyzeScamText(
  text: string,
  source: "message" | "transcript" = "message",
): Promise<AnalyzeResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      analysis: fallbackScamAnalysis(""),
      usedFallback: true,
      demoMode: !isOpenAiConfigured(),
    };
  }

  if (!isOpenAiConfigured()) {
    return {
      analysis: fallbackScamAnalysis(trimmed),
      usedFallback: true,
      demoMode: true,
    };
  }

  try {
    const client = getOpenAIClient();
    if (!client) throw new Error("OpenAI client unavailable");

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      input: [
        { role: "system", content: SCAM_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Source: ${source}\n\nContent:\n${trimmed.slice(0, 8000)}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "scam_analysis",
          strict: true,
          schema: SCAM_JSON_SCHEMA,
        },
      },
    });

    const raw = response.output_text;
    if (!raw) throw new Error("Empty model output");
    const parsed = scamAnalysisSchema.parse(JSON.parse(raw));
    return { analysis: parsed, usedFallback: false, demoMode: false };
  } catch {
    return {
      analysis: fallbackScamAnalysis(trimmed),
      usedFallback: true,
      demoMode: false,
    };
  }
}
