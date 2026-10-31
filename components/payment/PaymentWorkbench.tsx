"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DeviceSignals } from "@/types/analysis";
import type { PaymentReviewResult } from "@/types/transaction";
import { DEMO_SCENARIOS, getScenario } from "@/lib/demo/scenarios";
import { saveLastReview } from "@/lib/client/session";
import { formatInr } from "@/lib/utils/format";
import { DeviceRiskSimulator } from "@/components/security/DeviceRiskSimulator";
import { AttackChain } from "@/components/risk/AttackChain";
import { DecisionBadge } from "@/components/risk/DecisionBadge";
import { ExplainableRisk } from "@/components/risk/ExplainableRisk";
import { RiskScoreGauge } from "@/components/risk/RiskScoreGauge";
import { RiskBreakdown } from "@/components/risk/RiskBreakdown";
import { ScamAnalysisCard } from "@/components/analysis/ScamAnalysisCard";
import { URLAnalysisCard } from "@/components/analysis/URLAnalysisCard";
import { ErrorState, LoadingState } from "@/components/layout/states";
import { Badge } from "@/components/ui/badge";

const emptyDevice: DeviceSignals = {
  remoteAccess: false,
  screenSharing: false,
  unknownSource: false,
  accessibilityRisk: false,
};

export function PaymentWorkbench() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenario") ?? "";
  const [amount, setAmount] = useState(500);
  const [recipientName, setRecipientName] = useState("Rahul Sharma");
  const [recipientUpi, setRecipientUpi] = useState("rahul.sharma@oksbi");
  const [newRecipient, setNewRecipient] = useState(false);
  const [messageContext, setMessageContext] = useState("");
  const [suspiciousUrl, setSuspiciousUrl] = useState("");
  const [device, setDevice] = useState<DeviceSignals>(emptyDevice);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentReviewResult | null>(null);

  useEffect(() => {
    const scenario = getScenario(scenarioId);
    if (!scenario) return;
    setAmount(scenario.amount);
    setRecipientName(scenario.recipientName);
    setRecipientUpi(scenario.recipientUpi);
    setNewRecipient(scenario.newRecipient);
    setMessageContext(scenario.message);
    setSuspiciousUrl(scenario.url);
    setDevice(scenario.device);
    setResult(null);
  }, [scenarioId]);

  async function review() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/payment/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          recipientName,
          recipientUpi,
          newRecipient,
          knownRecipient: !newRecipient,
          messageContext,
          suspiciousUrl,
          device,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Review failed");
      setResult(data);
      saveLastReview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setLoading(false);
    }
  }

  const blocked = result && (result.decision === "BLOCK" || result.decision === "HOLD");

  const scenarioChips = useMemo(() => DEMO_SCENARIOS, []);

  return (
    <div className="space-y-6">
      <div>
        <Badge className="border-amber-400/30 bg-amber-400/10 text-amber-200">SIMULATED UPI PAYMENT</Badge>
        <h1 className="mt-3 text-2xl font-semibold">Payment security check</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          No real money is sent. This screen evaluates the attack chain before a fictional Pay action.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {scenarioChips.map((s) => (
          <a
            key={s.id}
            href={`/payment?scenario=${s.id}`}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400/40"
          >
            {s.name}
          </a>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form
          className="glass space-y-4 rounded-2xl p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void review();
          }}
        >
          <label className="block text-sm">
            Amount (INR)
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </label>
          <label className="block text-sm">
            Recipient name
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            Fictional UPI ID
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
              value={recipientUpi}
              onChange={(e) => setRecipientUpi(e.target.value)}
              required
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-cyan-400"
              checked={newRecipient}
              onChange={(e) => setNewRecipient(e.target.checked)}
            />
            New recipient
          </label>
          <label className="block text-sm">
            Message context
            <textarea
              className="mt-1 min-h-28 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
              value={messageContext}
              onChange={(e) => setMessageContext(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Suspicious URL
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2"
              value={suspiciousUrl}
              onChange={(e) => setSuspiciousUrl(e.target.value)}
              placeholder="https://…"
            />
          </label>
          <DeviceRiskSimulator value={device} onChange={setDevice} />
          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-300 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Reviewing…" : "Review Payment"}
          </button>
        </form>

        <div className="space-y-4">
          {loading ? <LoadingState /> : null}
          {error ? <ErrorState message={error} onRetry={() => void review()} /> : null}
          {result ? (
            <>
              {blocked ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5">
                  <p className="text-xs tracking-[0.2em] text-rose-200">PAYMENT PROTECTION TRIGGERED</p>
                  <h2 className="mt-2 text-2xl font-semibold text-rose-100">
                    {result.decision === "BLOCK" ? "PAYMENT BLOCKED" : "PAYMENT HELD"}
                  </h2>
                  <p className="mt-2 text-sm text-rose-100/80">
                    {formatInr(result.amount)} to {result.recipientName} was not authorized in this simulation.
                  </p>
                </div>
              ) : null}
              <div className="glass rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-[0.18em] text-slate-400">RISK SCORE</p>
                    <DecisionBadge decision={result.decision} className="mt-2" />
                  </div>
                  <RiskScoreGauge score={result.score} severity={result.severity} size={140} />
                </div>
                <div className="mt-4">
                  <RiskBreakdown
                    messageRisk={result.messageRisk}
                    urlRisk={result.urlRisk}
                    deviceRisk={result.deviceRisk}
                    transactionRisk={result.transactionRisk}
                  />
                </div>
                {result.usedFallback ? (
                  <p className="mt-4 text-xs text-amber-200">AI unavailable — fallback security analysis used.</p>
                ) : null}
                {result.demoMode ? <Badge className="mt-3">DEMO MODE</Badge> : null}
              </div>
              <div className="glass rounded-2xl p-5">
                <h3 className="mb-4 text-sm font-semibold tracking-wide">Attack chain</h3>
                <AttackChain steps={result.attackChain} />
              </div>
              <div className="glass rounded-2xl p-5">
                <ExplainableRisk contributors={result.contributors} total={result.score} />
              </div>
              {result.messageAnalysis ? (
                <ScamAnalysisCard
                  analysis={result.messageAnalysis}
                  fallbackMessage={result.usedFallback ? "AI unavailable — fallback security analysis used." : null}
                />
              ) : null}
              {result.urlAnalysis ? <URLAnalysisCard analysis={result.urlAnalysis} /> : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
