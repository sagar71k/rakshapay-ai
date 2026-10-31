import OpenAI from "openai";
import { isOpenAiConfigured } from "@/lib/demo/mode";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!isOpenAiConfigured()) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 12_000 });
  }
  return client;
}
