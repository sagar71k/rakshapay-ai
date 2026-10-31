"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { DEMO_SCENARIOS } from "@/lib/demo/scenarios";
import { formatTime } from "@/lib/utils/format";
import { loadLastReview } from "@/lib/client/session";
import { RiskScoreGauge } from "@/components/risk/RiskScoreGauge";
import { RiskBreakdown } from "@/components/risk/RiskBreakdown";
import { DecisionBadge } from "@/components/risk/DecisionBadge";
import { Badge } from "@/components/ui/badge";
import { RiskBars } from "@/components/charts/RiskBars";
import type { PaymentReviewResult } from "@/types/transaction";
import type { ThreatRecord } from "@/types/analysis";

export function DashboardView() {
  const [last, setLast] = useState<PaymentReviewResult | null>(null);
  const [history, setHistory] = useState<ThreatRecord[]>([]);

  useEffect(() => {
    setLast(loadLastReview());
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => setHistory(data.history ?? []))
      .catch(() => setHistory([]));
  }, []);

  const score = last?.score ?? 12;
  const severity = last?.severity ?? "SAFE";
  const threats = last?.contributors.map((c) => c.label).slice(0, 6) ?? [
    "No active payment threat",
  ];

  return (
    <div className="space-y-8">
      <section className="grid-fade overflow-hidden rounded-3xl border border-white/10 p-6 md:p-10">
        <p className="text-xs tracking-[0.22em] text-cyan-300">RAKSHAPAY AI</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Your payment. Protected before you pay.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
          RakshaPay AI detects social-engineering signals across messages, links, device risk and
          transaction behavior before authorization.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/scenarios"
            className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950"
          >
            Run Security Demo
          </Link>
          <Link
            href="/analyze"
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-200"
          >
            Analyze a Scam
          </Link>
        </div>
        <p className="mt-6 max-w-xl text-sm text-slate-500">
          Communication + URL + Device + Transaction = Attack chain = Risk decision. A scammer
          doesn&apos;t need to hack your bank. They only need to convince you to press Pay.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-xs tracking-[0.18em] text-slate-400">PROTECTION STATUS</p>
          <div className="mt-3 flex items-center gap-2 text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-lg font-semibold">ACTIVE</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Real-time payment protection is monitoring this session.
          </p>
        </div>
        <div className="glass flex flex-col items-center rounded-2xl p-5">
          <p className="mb-2 text-xs tracking-[0.18em] text-slate-400">CURRENT RISK SCORE</p>
          <RiskScoreGauge score={score} severity={severity} size={160} />
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs tracking-[0.18em] text-slate-400">THREAT LEVEL</p>
          <p className="mt-3 text-2xl font-semibold">{severity}</p>
          {last ? <div className="mt-3"><DecisionBadge decision={last.decision} /></div> : <Badge className="mt-3">NO OPEN REVIEW</Badge>}
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="mb-4 text-xs tracking-[0.18em] text-slate-400">RISK BREAKDOWN</p>
          <RiskBreakdown
            messageRisk={last?.messageRisk ?? 4}
            urlRisk={last?.urlRisk ?? 0}
            deviceRisk={last?.deviceRisk ?? 0}
            transactionRisk={last?.transactionRisk ?? 8}
          />
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-semibold tracking-wide">Signal mix</h2>
        <RiskBars
          messageRisk={last?.messageRisk ?? 4}
          urlRisk={last?.urlRisk ?? 0}
          deviceRisk={last?.deviceRisk ?? 0}
          transactionRisk={last?.transactionRisk ?? 8}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold tracking-wide">Active threats</h2>
          <ul className="mt-4 space-y-2">
            {threats.map((t) => (
              <li key={t} className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-sm">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold tracking-wide">Recent protection events</h2>
          <ul className="mt-4 space-y-3">
            {(history.slice(0, 5).length ? history.slice(0, 5) : []).map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="text-slate-200">{item.description}</p>
                  <p className="text-xs text-slate-500">{item.threat_type}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-slate-400">
                  {formatTime(item.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide">Demo scenarios</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {DEMO_SCENARIOS.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/payment?scenario=${scenario.id}`}
              className="glass rounded-2xl p-4 transition hover:border-cyan-400/30"
            >
              <p className="font-medium">{scenario.name}</p>
              <p className="mt-1 text-sm text-slate-400">{scenario.description}</p>
              <p className="mt-3 text-xs tracking-wide text-cyan-300">Expected {scenario.expectedDecision}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
