import { RISK_WEIGHTS, DECISION_THRESHOLDS } from "@/lib/risk/risk-config";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings / About</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          RakshaPay AI is a GRAVITON 2026 hackathon prototype. It is a simulated UPI social-engineering
          interceptor. It does not connect to banks, freeze real transactions, or inspect installed apps.
        </p>
      </div>
      <section className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold tracking-wide">How protection works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>The LLM extracts scam signals from messages or transcripts.</li>
          <li>URL, device, and transaction modules score deterministic heuristics.</li>
          <li>The risk engine combines weighted scores and makes ALLOW / VERIFY / HOLD / BLOCK.</li>
          <li>The model never makes the final payment decision.</li>
        </ol>
      </section>
      <section className="glass rounded-2xl p-5 text-sm text-slate-300">
        <h2 className="text-sm font-semibold tracking-wide text-white">Risk engine config</h2>
        <p className="mt-2">Weights: message {RISK_WEIGHTS.messageRisk}, URL {RISK_WEIGHTS.urlRisk}, device {RISK_WEIGHTS.deviceRisk}, transaction {RISK_WEIGHTS.transactionRisk}</p>
        <p className="mt-1">
          Thresholds: ALLOW 0–{DECISION_THRESHOLDS.ALLOW_MAX}, VERIFY {DECISION_THRESHOLDS.ALLOW_MAX + 1}–{DECISION_THRESHOLDS.VERIFY_MAX}, HOLD {DECISION_THRESHOLDS.VERIFY_MAX + 1}–{DECISION_THRESHOLDS.HOLD_MAX}, BLOCK {DECISION_THRESHOLDS.HOLD_MAX + 1}–100
        </p>
      </section>
      <section className="glass rounded-2xl p-5 text-sm text-slate-400">
        <p>Do not enter real OTPs, UPI PINs, card numbers, or banking passwords.</p>
        <p className="mt-2">Demo UPI IDs are fictional, such as rahul.sharma@oksbi.</p>
      </section>
    </div>
  );
}
