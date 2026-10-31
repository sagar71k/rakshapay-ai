import { ZodError } from "zod";

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(error: unknown, fallback = "Request failed") {
  if (error instanceof ZodError) {
    const issue = error.issues[0];
    return json(
      {
        error: "Validation failed",
        details: issue?.message ?? "Invalid input",
        path: issue?.path.join(".") ?? "",
      },
      400,
    );
  }
  const message = error instanceof Error ? error.message : fallback;
  const status = error instanceof Error && error.name === "BadRequest" ? 400 : 500;
  return json({ error: message }, status);
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    const error = new Error("Invalid JSON body");
    error.name = "BadRequest";
    throw error;
  }
}
