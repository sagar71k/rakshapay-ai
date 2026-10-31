import { errorResponse, json } from "@/lib/api/http";
import { loadHistory } from "@/lib/db/persist";

export async function GET() {
  try {
    const history = await loadHistory();
    return json({ history });
  } catch (error) {
    return errorResponse(error, "History unavailable");
  }
}
