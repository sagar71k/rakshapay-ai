import Link from "next/link";
import { DEMO_SCENARIOS } from "@/lib/demo/scenarios";

export default function ScenariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Demo scenarios</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          One-click attack chains for judges. Each scenario fills the simulated UPI flow.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_SCENARIOS.map((scenario) => (
          <Link
            key={scenario.id}
            href={`/payment?scenario=${scenario.id}`}
            className="glass rounded-2xl p-5 hover:border-cyan-400/30"
          >
            <p className="text-lg font-medium">{scenario.name}</p>
            <p className="mt-2 text-sm text-slate-400">{scenario.description}</p>
            <p className="mt-4 text-xs tracking-[0.16em] text-cyan-300">
              EXPECTED {scenario.expectedDecision}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
