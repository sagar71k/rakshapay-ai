"use client";

import { useState } from "react";
import { ErrorState, LoadingState } from "@/components/layout/states";
import { ScamAnalysisCard } from "@/components/analysis/ScamAnalysisCard";
import { URLAnalysisCard } from "@/components/analysis/URLAnalysisCard";
import type { ScamAnalysis, UrlAnalysis } from "@/types/analysis";

type MessageResponse = ScamAnalysis & {
  risk_score: number;
  usedFallback?: boolean;
  fallbackMessage?: string | null;
};

export function MessageAnalyzer({
  title,
  endpoint,
  placeholder,
}: {
  title: string;
  endpoint: string;
  placeholder: string;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MessageResponse | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <textarea
        className="min-h-40 w-full rounded-2xl border border-white/10 bg-black/30 p-4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        aria-label={title}
      />
      <button
        type="button"
        onClick={() => void run()}
        className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950"
        disabled={loading}
      >
        Analyze
      </button>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} onRetry={() => void run()} /> : null}
      {result ? (
        <ScamAnalysisCard analysis={result} fallbackMessage={result.fallbackMessage} />
      ) : null}
    </div>
  );
}

export function UrlAnalyzerForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UrlAnalysis | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">URL Analyzer</h1>
      <p className="text-sm text-slate-400">
        Heuristic inspection only. A single indicator does not prove a URL is malicious.
      </p>
      <input
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://sbi-kyc-verify-secure.example.com/update"
        aria-label="URL"
      />
      <button
        type="button"
        onClick={() => void run()}
        className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950"
        disabled={loading}
      >
        Inspect URL
      </button>
      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} onRetry={() => void run()} /> : null}
      {result ? <URLAnalysisCard analysis={result} /> : null}
    </div>
  );
}
