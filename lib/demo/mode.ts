export function isDemoFlagEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "REPLACE_ME");
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http"),
  );
}

export function isDemoMode(): boolean {
  return isDemoFlagEnabled() || !isOpenAiConfigured() || !isSupabaseConfigured();
}
