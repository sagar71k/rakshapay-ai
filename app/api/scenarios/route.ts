import { json } from "@/lib/api/http";
import { DEMO_SCENARIOS } from "@/lib/demo/scenarios";

export async function GET() {
  return json({ scenarios: DEMO_SCENARIOS });
}
